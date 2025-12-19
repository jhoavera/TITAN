import fs from 'fs';
import path from 'path';
import { recordAutoApproveMetric } from '@nucleo/telemetria/auto-approve-metrics';

export interface ResultadoHeuristica {
  razon: string;
  puntaje: number; // 0-1
  aprobacionSegura: boolean;
}

const METRICS_DIR = path.join(process.cwd(), '..', '..', 'api', 'tmp', 'metrics-auto-approve');

function asegurarDir(): void {
  if (!fs.existsSync(METRICS_DIR)) fs.mkdirSync(METRICS_DIR, { recursive: true });
}

// utilidades simples
function parseFrontmatter(content: string): Record<string, string> {
  const m = content.match(/^---\n([\s\S]*?)\n---/);
  if (!m) return {};
  const lines = m[1].split('\n').map((l) => l.trim()).filter(Boolean);
  const obj: Record<string, string> = {};
  for (const l of lines) {
    const eq = l.indexOf(':');
    if (eq < 0) continue;
    const k = l.slice(0, eq).trim().toLowerCase();
    const v = l.slice(eq + 1).trim();
    obj[k] = v;
  }
  return obj;
}

function contieneBloqueCodigo(content: string): boolean {
  return /```/.test(content) || /<code>/.test(content);
}

function contieneImportExport(content: string): boolean {
  return /(^|\n)\s*(import\s+|export\s+)/.test(content);
}

function detectaIngles(content: string): boolean {
  const patrones = /\b(the|of|and|is|migration|migrations|test|README|spec|endpoint)\b/i;
  return patrones.test(content);
}

export function heuristica_md_small(texto: string): ResultadoHeuristica {
  const palabras = texto.trim().split(/\s+/).filter(Boolean).length;
  const puntaje = palabras > 100 ? 0.95 : palabras > 40 ? 0.6 : 0.2;
  const aprobacionSegura = puntaje >= 0.9;
  const razon = `md-small: palabras=${palabras}`;
  // registro por regla
  try { recordAutoApproveMetric({ ts: new Date().toISOString(), file: 'n/a', ok: aprobacionSegura, reason: razon, rule: 'md-small', extra: { palabras } }); } catch {}
  return { razon, puntaje, aprobacionSegura };
}

export function heuristica_traducible(termino: string): ResultadoHeuristica {
  const contiene = detectaIngles(termino);
  const puntaje = contiene ? 0.1 : 0.95;
  const aprobacionSegura = puntaje >= 0.9;
  const razon = `traducible: contieneIngles=${contiene}`;
  try { recordAutoApproveMetric({ ts: new Date().toISOString(), file: 'n/a', ok: aprobacionSegura, reason: razon, rule: 'traducible', extra: { termino } }); } catch {}
  return { razon, puntaje, aprobacionSegura };
}

export type EvaluacionAutoApprove = {
  ok: boolean;
  puntaje: number;
  razones: string[];
}

export function evaluarParaAutoApprove(filePath: string, content: string): EvaluacionAutoApprove {
  asegurarDir();

  const razones: string[] = [];
  let puntaje = 0.5; // base neutra

  // frontmatter explícito fuerza aprobacion o rechazo
  const fm = parseFrontmatter(content);
  if (fm['auto-approve']) {
    const val = fm['auto-approve'].toLowerCase();
    const aprobado = val === 'yes' || val === 'si' || val === 'true' || val === 'aprobado';
    const razon = `frontmatter:auto-approve=${val}`;
    razones.push(razon);
    // registro por regla
    try { recordAutoApproveMetric({ ts: new Date().toISOString(), file: filePath, ok: aprobado, reason: razon, rule: 'frontmatter' }); } catch {}
    if (aprobado) return { ok: true, puntaje: 1.0, razones };
  }

  // md-small
  const md = heuristica_md_small(content);
  razones.push(md.razon);
  puntaje = Math.max(puntaje, md.puntaje);

  // code blocks penalizan fuertemente
  if (contieneBloqueCodigo(content)) {
    razones.push('bloque-codigo:true');
    puntaje = Math.min(puntaje, 0.2);
    try { recordAutoApproveMetric({ ts: new Date().toISOString(), file: filePath, ok: false, reason: 'bloque-codigo', rule: 'code-block' }); } catch {}
  }

  // import/export presencia => no auto-approve
  if (contieneImportExport(content)) {
    razones.push('contains-import-export:true');
    puntaje = Math.min(puntaje, 0.1);
    try { recordAutoApproveMetric({ ts: new Date().toISOString(), file: filePath, ok: false, reason: 'import-export', rule: 'imports-exports' }); } catch {}
  }

  // detect english
  if (detectaIngles(content)) {
    razones.push('detecta-ingles:true');
    // degrade confidence but don't veto alone
    puntaje = Math.min(puntaje, Math.max(0.2, puntaje * 0.6));
    try { recordAutoApproveMetric({ ts: new Date().toISOString(), file: filePath, ok: puntaje >= 0.9, reason: 'ingles-detectado', rule: 'ingles' }); } catch {}
  }

  // Final decision
  const ok = puntaje >= 0.9;
  const razonFinal = `final:puntaje=${puntaje.toFixed(3)}`;
  razones.push(razonFinal);
  try { recordAutoApproveMetric({ ts: new Date().toISOString(), file: filePath, ok, reason: razonFinal, rule: 'aggregate', extra: { razones, puntaje } }); } catch {}

  return { ok, puntaje, razones };
}
