import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const dedup = path.resolve(process.cwd(), 'reports', 'dedup-propuestas.json');
const propuestas = path.resolve(process.cwd(), 'reports', 'propuestas-aprobacion-posible.json');
const draft = path.resolve(process.cwd(), 'reports', 'pr-draft.json');
const script = path.resolve(process.cwd(), 'scripts/ci/preparar-pr-draft.ts');

beforeAll(() => {
  fs.mkdirSync(path.dirname(dedup), { recursive: true });
  fs.writeFileSync(dedup, JSON.stringify({ fecha: new Date().toISOString(), grupos: [{ clave: 'migraciones' }] }));
  fs.writeFileSync(propuestas, JSON.stringify({ fecha: new Date().toISOString(), propuestas: [{ termino: 'migraciones' }] }));
});

afterAll(() => {
  try { fs.unlinkSync(dedup); } catch {};
  try { fs.unlinkSync(propuestas); } catch {};
  try { fs.unlinkSync(draft); } catch {};
});

describe('script preparar-pr-draft', () => {
  it('genera reports/pr-draft.json si hay reportes', () => {
    execSync(`bun ${script}`);
    expect(fs.existsSync(draft)).toBe(true);
    const contenido = JSON.parse(fs.readFileSync(draft, 'utf-8'));
    expect(contenido.resumen.grupos).toBeGreaterThan(0);
    expect(contenido.resumen.propuestasGeneradas).toBeGreaterThan(0);
  });
});
