import fs from 'fs';
import path from 'path';

export type EstadoTermino = 'pendiente' | 'en-revision' | 'aprobado' | 'rechazado';

export interface TerminoGlosario {
  clave: string; // slug único
  termino: string;
  definicion: string;
  autor: string;
  fecha: string; // ISO
  estado: EstadoTermino;
  categoria?: string;
}

const GLOSARIO_DIR = path.join(process.cwd(), '..', '..', 'documentacion-fuente-unica-verdad', 'glosario-biblioteca');

function asegurarDirectorio(): void {
  if (!fs.existsSync(GLOSARIO_DIR)) fs.mkdirSync(GLOSARIO_DIR, { recursive: true });
}

export const crearTermino = (t: TerminoGlosario): TerminoGlosario => {
  asegurarDirectorio();
  const filename = `${t.clave}.md`;
  const content = generarContenidoTermino(t);
  fs.writeFileSync(path.join(GLOSARIO_DIR, filename), content, { encoding: 'utf8' });
  return t;
};

export const leerTermino = (clave: string): TerminoGlosario | null => {
  const p = path.join(GLOSARIO_DIR, `${clave}.md`);
  if (!fs.existsSync(p)) return null;
  const raw = fs.readFileSync(p, { encoding: 'utf8' });
  return parseContenidoTermino(raw, clave);
};

export const actualizarTermino = (clave: string, patch: Partial<TerminoGlosario>): TerminoGlosario | null => {
  const p = path.join(GLOSARIO_DIR, `${clave}.md`);
  if (!fs.existsSync(p)) return null;
  const raw = fs.readFileSync(p, { encoding: 'utf8' });
  const t = parseContenidoTermino(raw, clave);
  const actualizado = { ...t, ...patch } as TerminoGlosario;
  fs.writeFileSync(p, generarContenidoTermino(actualizado), { encoding: 'utf8' });
  return actualizado;
};

export const eliminarTermino = (clave: string): boolean => {
  const p = path.join(GLOSARIO_DIR, `${clave}.md`);
  if (!fs.existsSync(p)) return false;
  fs.unlinkSync(p);
  return true;
};

function generarContenidoTermino(t: TerminoGlosario): string {
  return `# ${t.termino}

Clave: ${t.clave}
Autor: ${t.autor}
Fecha: ${t.fecha}
Estado: ${t.estado}
Categoria: ${t.categoria ?? ''}

## Definición

${t.definicion}
`;
}

function parseContenidoTermino(raw: string, clave: string): TerminoGlosario {
  const lines = raw.split(/\r?\n/);
  const termino = lines[0].replace(/^# /, '').trim();
  const autorLine = lines.find((l) => l.startsWith('Autor:')) ?? '';
  const fechaLine = lines.find((l) => l.startsWith('Fecha:')) ?? '';
  const estadoLine = lines.find((l) => l.startsWith('Estado:')) ?? 'pendiente';
  const categoriaLine = lines.find((l) => l.startsWith('Categoria:')) ?? '';
  const autor = autorLine.replace('Autor:', '').trim();
  const fecha = fechaLine.replace('Fecha:', '').trim();
  const estado = (estadoLine.replace('Estado:', '').trim() || 'pendiente') as EstadoTermino;
  const categoria = categoriaLine.replace('Categoria:', '').trim() || undefined;
  const defIndex = lines.findIndex((l) => l.startsWith('## Definición'));
  const definicion = defIndex >= 0 ? lines.slice(defIndex + 1).join('\n').trim() : '';
  return { clave, termino, definicion, autor, fecha, estado, categoria };
}
