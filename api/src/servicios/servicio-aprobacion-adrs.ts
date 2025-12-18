import fs from 'fs';
import path from 'path';
import { agruparYDeduplicar } from './servicio-deduplicacion-propuestas';

export type ValidacionResultado = {
  termino: string;
  valido: boolean;
  razones: string[];
  sugerenciaCanonical?: string;
  semScore?: number;
  semExplicacion?: string;
};

const ADRS_DIR = path.resolve(process.cwd(), '../documentacion-fuente-unica-verdad/ad-rs');
const ADRS_DIR_ALT = path.resolve(process.cwd(), 'documentacion-fuente-unica-verdad', 'ad-rs');
const GLOSARIO = path.resolve(process.cwd(), '../documentacion-fuente-unica-verdad/glosario-biblioteca/glosario.md');
const DEDUP_REPORTE = path.resolve(process.cwd(), 'reports', 'dedup-propuestas.json');

function leerGlosario(): string[] {
  if (!fs.existsSync(GLOSARIO)) return [];
  const txt = fs.readFileSync(GLOSARIO, 'utf-8').toLowerCase();
  // heurística: cada linea con '- ' se considera entrada: '- termino: definición'
  const lines = txt.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  const entradas = lines
    .filter((l) => l.startsWith('- '))
    .map((l) => l.slice(2).split(':')[0].trim());
  return entradas;
}

function buscarADRsParaTerm(term: string): string[] {
  const posibles: string[] = [];
  for (const dir of [ADRS_DIR, ADRS_DIR_ALT]) {
    if (!fs.existsSync(dir)) continue;
    const archivos = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
    for (const f of archivos) {
      const full = path.join(dir, f);
      try {
        const txt = fs.readFileSync(full, 'utf-8').toLowerCase();
        if (txt.includes(term.toLowerCase())) posibles.push(full);
      } catch (_e) {
        // ignore
      }
    }
  }
  return posibles;
}

import { validarSemantica } from './servicio-validacion-semantica';

export async function validarPropuesta(termino: string, sugerencia?: string): Promise<ValidacionResultado> {
  const razones: string[] = [];
  const glosario = leerGlosario();
  if (glosario.includes(termino.toLowerCase())) razones.push('termino ya existe en glosario');
  const adrs = buscarADRsParaTerm(termino);
  if (adrs.length === 0) razones.push('no existe ADR propuesta para el termino');
  // Check dedup report to see unique canonical suggestion
  let sugerenciaCanonical: string | undefined = undefined;
  if (fs.existsSync(DEDUP_REPORTE)) {
    try {
      const report = JSON.parse(fs.readFileSync(DEDUP_REPORTE, 'utf-8'));
      if (report && Array.isArray(report.grupos)) {
        const grupo = report.grupos.find((g: any) => g.clave && g.clave.toLowerCase().includes(termino.toLowerCase()));
        if (grupo) {
          sugerenciaCanonical = grupo.clave;
        }
      }
    } catch (e) {
      razones.push('error leyendo reporte de deduplicación');
    }
  } else {
    razones.push('reporte de deduplicación no encontrado');
  }

  if (!sugerencia && sugerenciaCanonical) sugerencia = sugerenciaCanonical;

  // Validación semántica (async, stub) — si falla, agregar razón
  let semScore: number | undefined = undefined;
  let semExplicacion: string | undefined = undefined;
  try {
    const sem = await validarSemantica(termino, sugerencia);
    // Añadir información semántica al resultado para trazabilidad
    if (sem) {
      semScore = sem.score;
      semExplicacion = sem.explicacion;
      if (!sem.valido || sem.score < 0.7) {
        razones.push(`validacion semantica baja: score=${sem.score} razon=${sem.razon || 'baja confianza'}`);
        if (sem.explicacion) razones.push(`detalle validacion: ${sem.explicacion}`);
      }
    }
  } catch (e) {
    razones.push('error en validacion semantica');
  }

  const valido = razones.length === 0;
  return { termino, valido, razones, sugerenciaCanonical: sugerencia, semScore, semExplicacion };
}

export async function revisarYProponerAprobaciones(): Promise<{ fecha: string; propuestas: ValidacionResultado[] }> {
  const salida: ValidacionResultado[] = [];
  if (!fs.existsSync(DEDUP_REPORTE)) return { fecha: new Date().toISOString(), propuestas: [] };
  const report = JSON.parse(fs.readFileSync(DEDUP_REPORTE, 'utf-8'));
  const grupos = report.grupos as Array<{ clave: string; archivos: string[] }>;
  for (const g of grupos) {
    const term = g.clave;
    // await validarPropuesta (es async ahora)
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    const res = await validarPropuesta(term);
    salida.push(res);
  }
  const destino = path.resolve(process.cwd(), 'reports', 'propuestas-aprobacion-posible.json');
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, JSON.stringify({ fecha: new Date().toISOString(), propuestas: salida }, null, 2), 'utf-8');
  return { fecha: new Date().toISOString(), propuestas: salida };
}

/**
 * Aplica aprobaciones automáticas para propuestas que cumplan criterios estrictos.
 * Reglas básicas:
 * - propuesta.valido === true
 * - semScore >= 0.9 (si está disponible)
 * - opcionalmente ejecutar tests antes de aplicar
 */
export async function aplicarAprobacionesAutomaticas(opts?: { dryRun?: boolean; runTests?: boolean; commit?: boolean; autor?: { nombre: string; email: string } }) {
  const res = await revisarYProponerAprobaciones();
  const candidatas = res.propuestas.filter((p) => p.valido && (p.semScore === undefined || p.semScore >= 0.9));
  const aplicadas: Array<{ termino: string; archivosActualizados: string[] }> = [];

  if (opts?.runTests) {
    // correr pruebas con bun test
    try {
      const { spawnSync } = await import('child_process');
      const out = spawnSync('bun', ['test'], { encoding: 'utf8' });
      if (out.status !== 0) {
        return { testsPassed: false, aplicadas: [], detalle: 'Pruebas fallaron, no se aplicarán aprobaciones automáticas' };
      }
    } catch (_e) {
      return { testsPassed: false, aplicadas: [], detalle: 'Error al ejecutar pruebas' };
    }
  }

  for (const c of candidatas) {
    try {
      const adrs = buscarADRsParaTerm(c.termino);
      const actualizados: string[] = [];
      for (const a of adrs) {
        try {
          const contenido = fs.readFileSync(a, 'utf-8');
          const nuevo = contenido.replace(/\*\*Estado:\*\*\s*[^\n]+/, `**Estado:** aprobado`);
          const nota = `\n\n> Aprobación automática aplicada: ${new Date().toISOString()} (motivo: reglas automatizadas)`;
          fs.writeFileSync(a, nuevo + nota, 'utf-8');
          actualizados.push(a);
        } catch (e) {
          // ignore per-file
        }
      }
      if (!opts?.dryRun && actualizados.length > 0) {
        aplicadas.push({ termino: c.termino, archivosActualizados: actualizados });
      }
    } catch (err) {
      // seguir con siguientes
    }
  }

  if (opts?.commit && aplicadas.length > 0) {
    try {
      const { spawnSync } = await import('child_process');
      const mensaje = `chore(adr): auto-aprobar ${aplicadas.length} propuestas (automatizado)`;
      spawnSync('git', ['add', '-A']);
      spawnSync('git', ['commit', '-m', mensaje, '--author', `${opts?.autor?.nombre ?? 'automatizado'} <${opts?.autor?.email ?? 'automatizado@local'}>`]);
    } catch (_e) {
      // no bloquear
    }
  }

  return { testsPassed: true, aplicadas };
}

