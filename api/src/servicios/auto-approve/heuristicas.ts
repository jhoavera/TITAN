import fs from 'fs';
import path from 'path';

export interface ResultadoHeuristica {
  razon: string;
  puntaje: number; // 0-1
  aprobacionSegura: boolean;
}

const METRICS_DIR = path.join(process.cwd(), '..', '..', 'api', 'tmp', 'metrics-auto-approve');

function asegurarDir(): void {
  if (!fs.existsSync(METRICS_DIR)) fs.mkdirSync(METRICS_DIR, { recursive: true });
}

export function registrarMetricas(entry: Record<string, unknown>): void {
  asegurarDir();
  const line = JSON.stringify({ ...entry, ts: new Date().toISOString() });
  const file = path.join(METRICS_DIR, 'auto-approve-metrics.jsonl');
  fs.appendFileSync(file, line + '\n', { encoding: 'utf8' });
}

export function heuristica_md_small(texto: string): ResultadoHeuristica {
  // Heurística compacta: si el ADR/Propuesta es muy corta y contiene < 30 palabras, no aprobar
  const palabras = texto.trim().split(/\s+/).filter(Boolean).length;
  const puntaje = palabras > 100 ? 0.95 : palabras > 40 ? 0.6 : 0.2;
  const aprobacionSegura = puntaje >= 0.9;
  const razon = `md-small: palabras=${palabras}`;
  registrarMetricas({ heuristica: 'md-small', palabras, puntaje, aprobacionSegura });
  return { razon, puntaje, aprobacionSegura };
}

export function heuristica_traducible(termino: string): ResultadoHeuristica {
  // Heurística: si término contiene palabras en inglés detectadas simplificadas
  const inglesPatron = /\b(the|of|and|is|migration|migrations|test|README)\b/i;
  const contiene = inglesPatron.test(termino);
  const puntaje = contiene ? 0.1 : 0.95;
  const aprobacionSegura = puntaje >= 0.9;
  const razon = `traducible: contieneIngles=${contiene}`;
  registrarMetricas({ heuristica: 'traducible', termino, puntaje, aprobacionSegura });
  return { razon, puntaje, aprobacionSegura };
}
