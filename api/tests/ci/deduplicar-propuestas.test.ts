import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { listarPropuestas, agruparYDeduplicar, consolidar } from '@servicios/servicio-deduplicacion-propuestas';

const adrsDir = path.resolve(process.cwd(), '../documentacion-fuente-unica-verdad/ad-rs');
const tmpA = path.join(adrsDir, 'tmp-propuesta-a.md');
const tmpB = path.join(adrsDir, 'tmp-propuesta-b.md');

beforeAll(() => {
  if (!fs.existsSync(adrsDir)) fs.mkdirSync(adrsDir, { recursive: true });
  fs.writeFileSync(tmpA, '---\ntitulo: "Propuesta: traducir \"migraciones\""\nfecha: "2025-12-16T00:00:00Z"\n---\n');
  fs.writeFileSync(tmpB, '---\ntitulo: "Propuesta: traducir \"migrate\""\nfecha: "2025-12-16T00:00:00Z"\n---\n');
});

afterAll(() => {
  try { fs.unlinkSync(tmpA); } catch {};
  try { fs.unlinkSync(tmpB); } catch {};
  try { fs.unlinkSync(path.resolve(process.cwd(), 'reports', 'dedup-propuestas.json')); } catch {};
});

describe('servicio-deduplicacion-propuestas', () => {
  it('lista propuestas detectadas', () => {
    const lista = listarPropuestas();
    expect(lista.length).toBeGreaterThanOrEqual(2);
  });

  it('agrupar y deduplicar devuelve grupos con claves', () => {
    const lista = listarPropuestas();
    const grupos = agruparYDeduplicar(lista);
    expect(Array.isArray(grupos)).toBe(true);
    expect(grupos.some(g => g.clave === 'migraciones')).toBeTruthy();
  });

  it('consolida y escribe reporte', () => {
    const lista = listarPropuestas();
    const grupos = agruparYDeduplicar(lista);
    const destino = consolidar(grupos);
    expect(fs.existsSync(destino)).toBe(true);
    const txt = fs.readFileSync(destino, 'utf-8');
    expect(txt).toContain('grupos');
  });
});
