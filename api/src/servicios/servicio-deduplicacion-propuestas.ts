import fs from 'fs';
import path from 'path';
import { rutaADRs } from '@nucleo/rutas/rutas-docs';

export type Propuesta = {
  path: string;
  titulo?: string;
  terminoDetectado?: string;
  fecha?: string;
  estado?: string;
};

const docsRoot = rutaADRs();
export const CARPETA_ADRS = docsRoot;

export function listarPropuestas(): Propuesta[] {
  if (!fs.existsSync(CARPETA_ADRS)) return [];
  const archivos = fs.readdirSync(CARPETA_ADRS);
  const archivosSolo = archivos.filter((f) => fs.statSync(path.join(CARPETA_ADRS, f)).isFile());
  const propuestas = archivosSolo
    // aceptar archivos de tipo propuesta genéricos para facilitar pruebas y detección
    .filter((f) => f.includes('propuesta') || f.includes('proponer-traduccion') || f.includes('propuesta-traducir'))
    .map((f) => {
      const full = path.join(CARPETA_ADRS, f);
      const texto = fs.existsSync(full) ? fs.readFileSync(full, 'utf-8') : '';
      // Extraer título de frontmatter de forma robusta (acepta comillas internas)
      let titulo: string | undefined = undefined;
      const lines = texto.split('\n');
      for (const line of lines) {
        const l = line.trim();
        if (l.toLowerCase().startsWith('titulo:')) {
          const rest = l.split(':').slice(1).join(':').trim();
          if ((rest.startsWith('"') && rest.endsWith('"')) || (rest.startsWith("'") && rest.endsWith("'"))) {
            titulo = rest.slice(1, -1);
          } else {
            titulo = rest;
          }
          break;
        }
      }
      const fechaMatch = texto.match(/fecha:\s*"?([0-9T:\-\.Z]+)"?/i);
      return {
        path: full,
        titulo: titulo,
        fecha: fechaMatch ? fechaMatch[1] : undefined,
      } as Propuesta;
    });
  return propuestas;
}

export function agruparYDeduplicar(propuestas: Propuesta[]): { clave: string; archivos: string[] }[] {
  // intentamos extraer el termino central del título o filename
  const mapa = new Map<string, Set<string>>();
  for (const p of propuestas) {
    const nombre = path.basename(p.path).toLowerCase();
    let clave = '';
    // heurística: buscar 'migrations', 'migrate', 'migration' en nombre o titulo
    const m = nombre.match(/migrat|migration|migrations|migrate/);
    if (m) {
      clave = 'migraciones';
    } else {
      const t = (p.titulo || '').toLowerCase();
      if (/migrat|migration|migrations|migrate/.test(t)) {
        clave = 'migraciones';
      } else {
        const other = p.titulo ? p.titulo.match(/"([^\"]+)"/) : null;
        if (other) {
          const val = other[1].toLowerCase();
          if (/migrat|migration|migrations|migrate/.test(val)) {
            clave = 'migraciones';
          } else {
            clave = val;
          }
        } else {
          clave = nombre.replace(/[^a-z0-9\-]/g, '_');
        }
      }
    }
    if (!mapa.has(clave)) mapa.set(clave, new Set());
    mapa.get(clave)!.add(p.path);
  }
  const result: { clave: string; archivos: string[] }[] = [];
  for (const [clave, setArch] of mapa.entries()) {
    result.push({ clave, archivos: Array.from(setArch) });
  }
  return result;
}

export function consolidar(propuestasAgrupadas: { clave: string; archivos: string[] }[], salidaPath?: string) {
  const out = {
    fecha: new Date().toISOString(),
    grupos: propuestasAgrupadas,
  } as const;
  const destino = salidaPath || path.resolve(process.cwd(), 'reports', 'dedup-propuestas.json');
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, JSON.stringify(out, null, 2), 'utf-8');
  return destino;
}
