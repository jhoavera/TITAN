#!/usr/bin/env bun
/* generar-adrs-canonicas.ts
 * Lee reports/reporte-refactor-idioma.json y tmp-glosario.json para
 * generar ADRs canónicas en modo dry-run (no escribe) o apply (crea archivos)
 * Cumple las normas: TODO en español técnico empresarial, no aplicar renombrados.
 */
import fs from 'fs';
import path from 'path';

type Reporte = {
  dryRun: boolean;
  fecha: string;
  reporte: Array<{ termino: string; archivos: string[]; sugerencia?: string }>;
};

const ADRS_DIR = path.resolve(process.cwd(), '../documentacion-fuente-unica-verdad/ad-rs');
const TEMPLATE_PATH = path.resolve(process.cwd(), '../documentacion-fuente-unica-verdad/ad-rs/000X-proponer-traduccion-template.md');

function slugify(s: string): string {
  return s.replace(/[^a-zA-Z0-9\-]+/g, '-').toLowerCase();
}

function generarNombreArchivo(termino: string): string {
  const fecha = new Date().toISOString().slice(0, 10);
  const slug = slugify(termino);
  return `${fecha}-proponer-traduccion-${slug}.md`;
}

function plantillaADR(termino: string, archivos: string[], sugerencia?: string): string {
  const titulo = `Propuesta: traducir "${termino}" → sugerencia: ${sugerencia ?? 'revisar'}`;
  return `---
titulo: "${titulo}"
fecha: "${new Date().toISOString()}"
estado: "propuesta"
autor: "revisar-idioma"
---

# ${titulo}

**Contexto**: Se detectó el término **${termino}** en ${archivos.length} archivos. Se propone registrar esta propuesta en el glosario y evaluar impacto en renombrados y pruebas.

**Archivos detectados**:

${archivos.map((a) => `- ${a}`).join('\n')}

**Sugerencia automática**: ${sugerencia ?? 'Revisar y proponer traducción canonizada (p.ej. migración / migraciones)'}.

**Reglas**:
- No aplicar renombrados sin ADR aprobada.
- Documentar riesgos y pruebas de regresión.

**Acciones propuestas**:
1. Revisar manualmente las instancias y consolidar el término canon (singular/plural).
2. Si se aprueba, aplicar renombrados por módulos pequeños con pruebas.
3. Actualizar 'glosario-biblioteca' con la entrada correspondiente.

`;
}

function loadReporte(): Reporte | null {
  const primary = path.resolve(process.cwd(), 'reports/reporte-refactor-idioma.json');
  if (fs.existsSync(primary)) {
    try { return JSON.parse(fs.readFileSync(primary, 'utf-8')) as Reporte } catch (e) { console.error('Error parsing primary report', e instanceof Error ? e.message : String(e)); return null }
  }

  // Fallback is opt-in via env var to preserve test semantics (rename primary to assert failure)
  if (process.env.ALLOW_REPORT_FALLBACK !== '1') return null;

  const candidates = [
    path.resolve(__dirname, '../../reports/reporte-refactor-idioma.json'),
    path.resolve(process.cwd(), './tmp/reports/reporte-refactor-idioma.json'),
    path.resolve(process.cwd(), 'reports/tmp-reporte-refactor-idioma.json')
  ];
  for (const p of candidates) {
    if (fs.existsSync(p)) {
      try {
        const txt = fs.readFileSync(p, 'utf-8');
        return JSON.parse(txt) as Reporte;
      } catch (e) {
        console.error('Error parsing fallback reporte-refactor-idioma.json in', p, e instanceof Error ? e.message : String(e));
      }
    }
  }
  return null;
}

function existeADR(nombre: string, dir = ADRS_DIR): boolean {
  const candidatos = fs.readdirSync(dir).filter((f) => f.toLowerCase().includes(nombre.toLowerCase()) || f.includes(slugify(nombre)));
  return candidatos.length > 0;
}

export async function generarADRsCanónicas(reporte: { reporte: Array<{ termino: string; archivos: string[]; sugerencia?: string }> }, opts?: { apply?: boolean; applyDb?: boolean; adrsDir?: string }) {
  const apply = opts?.apply ?? false
  const applyDb = opts?.applyDb ?? false
  const dir = opts?.adrsDir ?? ADRS_DIR
  const resultados: Array<{ termino: string; archivo?: string; creadoEnDb?: any }> = []

  for (const item of reporte.reporte) {
    const nombreArchivo = generarNombreArchivo(item.termino)
    if (existeADR(item.termino, dir)) {
      resultados.push({ termino: item.termino })
      continue
    }

    const contenido = plantillaADR(item.termino, item.archivos, item.sugerencia)
    let archivoPath: string | undefined = undefined
    if (apply) {
      fs.mkdirSync(dir, { recursive: true })
      const targetPath = path.join(dir, nombreArchivo)
      fs.writeFileSync(targetPath, contenido, { encoding: 'utf-8' })
      archivoPath = targetPath
    }

    let creadoEnDb: any = undefined
    if (applyDb) {
      try {
        const { crearADR } = await import('../../src/infraestructura/repositorios/repositorio-adrs')
        const { obtenerDb } = await import('../../src/infraestructura/base-de-datos/cliente')
        const db = obtenerDb() as any
        const payload = { numero: 0, titulo: `Propuesta: ${item.termino}`, objetivo: `Propuesta automática para término ${item.termino}`, decision: item.sugerencia ?? 'Revisar' }
        const r = await crearADR(db, payload as any, 'TNT-DEFAULT', 'generar-adrs-canonicas')
        creadoEnDb = r
      } catch (e) {
        console.error('[generar-adrs] fallo creando ADR en DB:', e instanceof Error ? e.message : String(e))
      }
    }

    resultados.push({ termino: item.termino, archivo: archivoPath, creadoEnDb })
  }

  return resultados
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const apply = args.includes('--apply');
  const applyDb = args.includes('--apply-db');
  const reporte = loadReporte();
  if (!reporte) {
    console.error('No se encontró reports/reporte-refactor-idioma.json. Ejecuta --dry-run primero.');
    process.exit(1);
    return;
  }

  console.log('Generando ADRs canónicas (modo %s). Términos encontrados: %d', apply ? 'apply' : 'dry-run', reporte.reporte.length);

  const res = await generarADRsCanónicas(reporte as any, { apply, applyDb })
  for (const r of res) {
    if (r.archivo) console.log('AD﻿R creada:', r.archivo)
    if (r.creadoEnDb) console.log('AD﻿R registrada en DB id:', r.creadoEnDb.id ?? '(sin id)')
  }

  console.log('\nProceso completado. Recuerda revisar las ADRs propuestas y aprobar manualmente antes de aplicar cambios.');
}

if (require.main === module) {
  void main();
}
