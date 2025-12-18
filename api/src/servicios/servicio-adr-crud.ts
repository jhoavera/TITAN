/* eslint-disable @typescript-eslint/explicit-function-return-type */
// Servicio CRUD para ADRs
// Requisitos: TypeScript strict, todo en Español técnico empresarial

import fs from 'fs';
import path from 'path';

export type EstadoADR = 'pendiente' | 'en-revision' | 'aprobado' | 'rechazado';

export interface ADR {
  id: string; // formato: yyyy-mm-dd-slug
  titulo: string;
  autor: string;
  fecha: string; // ISO
  estado: EstadoADR;
  decision: string;
  contexto?: string;
}

const ADR_DIR = path.join(process.cwd(), '..', '..', 'documentacion-fuente-unica-verdad', 'ad-rs');

function asegurarDirectorio(): void {
  if (!fs.existsSync(ADR_DIR)) fs.mkdirSync(ADR_DIR, { recursive: true });
}

export const crearADR = (adr: ADR): ADR => {
  asegurarDirectorio();
  const filename = `${adr.id}-${slug(adr.titulo)}.md`;
  const content = generarContenidoADR(adr);
  fs.writeFileSync(path.join(ADR_DIR, filename), content, { encoding: 'utf8' });
  return adr;
};

export const leerADR = (idOrFilename: string): ADR | null => {
  const files = fs.readdirSync(ADR_DIR);
  const f = files.find((x) => x.startsWith(idOrFilename));
  if (!f) return null;
  const raw = fs.readFileSync(path.join(ADR_DIR, f), { encoding: 'utf8' });
  return parseContenidoADR(raw);
};

export const actualizarADR = (idOrFilename: string, patch: Partial<ADR>): ADR | null => {
  const files = fs.readdirSync(ADR_DIR);
  const f = files.find((x) => x.startsWith(idOrFilename));
  if (!f) return null;
  const p = path.join(ADR_DIR, f);
  const raw = fs.readFileSync(p, { encoding: 'utf8' });
  const adr = parseContenidoADR(raw);
  const actualizado = { ...adr, ...patch } as ADR;
  fs.writeFileSync(p, generarContenidoADR(actualizado), { encoding: 'utf8' });
  return actualizado;
};

export const eliminarADR = (idOrFilename: string): boolean => {
  const files = fs.readdirSync(ADR_DIR);
  const f = files.find((x) => x.startsWith(idOrFilename));
  if (!f) return false;
  fs.unlinkSync(path.join(ADR_DIR, f));
  return true;
};

function slug(t: string): string {
  return t.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function generarContenidoADR(a: ADR): string {
  return `# ${a.titulo}

Fecha: ${a.fecha}
Autor: ${a.autor}

Estado: ${a.estado}

## Contexto

${a.contexto ?? ''}

## Decisión

${a.decision}
`;
}

function parseContenidoADR(raw: string): ADR {
  const lines = raw.split(/\r?\n/);
  const titulo = lines[0].replace(/^# /, '').trim();
  const fechaLine = lines.find((l) => l.startsWith('Fecha:')) ?? '';
  const autorLine = lines.find((l) => l.startsWith('Autor:')) ?? '';
  const estadoLine = lines.find((l) => l.startsWith('Estado:')) ?? '';
  const fecha = fechaLine.replace('Fecha:', '').trim();
  const autor = autorLine.replace('Autor:', '').trim();
  const estado = (estadoLine.replace('Estado:', '').trim() || 'pendiente') as EstadoADR;
  const decisionIndex = lines.findIndex((l) => l.startsWith('## Decisión'));
  const contextoIndex = lines.findIndex((l) => l.startsWith('## Contexto'));
  const contexto = contextoIndex >= 0 ? lines.slice(contextoIndex + 1, decisionIndex === -1 ? undefined : decisionIndex).join('\n').trim() : '';
  const decision = decisionIndex >= 0 ? lines.slice(decisionIndex + 1).join('\n').trim() : '';

  const id = `${fecha.split('T')[0]}-${slug(titulo)}`;

  return { id, titulo, autor, fecha, estado, decision, contexto };
}
