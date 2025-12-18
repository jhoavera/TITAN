import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import fs from 'fs';
import path from 'path';
import { validarPropuesta, revisarYProponerAprobaciones } from '@servicios/servicio-aprobacion-adrs';

const adrsDir = path.resolve(process.cwd(), '../documentacion-fuente-unica-verdad/ad-rs');
const dedupReport = path.resolve(process.cwd(), 'reports', 'dedup-propuestas.json');

beforeAll(() => {
  if (!fs.existsSync(adrsDir)) fs.mkdirSync(adrsDir, { recursive: true });
  // crear ADR propuesta para 'migraciones'
  fs.writeFileSync(path.join(adrsDir, '000x-proponer-migraciones.md'), '---\ntitulo: "Propuesta: traducir \"migraciones\""\nfecha: "2025-12-16T00:00:00Z"\nestado: "propuesta"\n---\n');
  // crear reporte dedup simple
  fs.mkdirSync(path.dirname(dedupReport), { recursive: true });
  fs.writeFileSync(dedupReport, JSON.stringify({ fecha: new Date().toISOString(), grupos: [{ clave: 'migraciones', archivos: ['a','b'] }] }, null, 2));
});

afterAll(() => {
  try { fs.unlinkSync(path.join(adrsDir, '000x-proponer-migraciones.md')); } catch {};
  try { fs.unlinkSync(dedupReport); } catch {};
  try { fs.unlinkSync(path.resolve(process.cwd(), 'reports', 'propuestas-aprobacion-posible.json')); } catch {};
});

describe('servicio-aprobacion-adrs', () => {
  it('valida propuesta migraciones como apta cuando ADR existe y no esta en glosario', async () => {
    const res = await validarPropuesta('migraciones');
    expect(res.valido).toBe(true);
    expect(res.razones.length).toBe(0);
    expect(typeof res.semScore).toBe('number');
    expect(res.semScore).toBeGreaterThan(0.8);
  });

  it('genera archivo de propuestas de aprobacion', async () => {
    const out = await revisarYProponerAprobaciones();
    expect(Array.isArray(out.propuestas)).toBe(true);
    expect(out.propuestas.length).toBeGreaterThan(0);
    const file = path.resolve(process.cwd(), 'reports', 'propuestas-aprobacion-posible.json');
    expect(fs.existsSync(file)).toBe(true);
    const contenido = JSON.parse(fs.readFileSync(file, 'utf-8'));
    expect(contenido.propuestas[0].semScore).toBeDefined();
  });
});
