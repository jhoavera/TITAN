import { describe, it, expect } from 'vitest';
import { validarSemantica } from '../../src/servicios/servicio-validacion-semantica';

describe('servicio-validacion-semantica (stub avanzado)', () => {
  it('valida sugerencia canónica con alta confianza', async () => {
    const res = await validarSemantica('migraciones', 'migraciones');
    expect(res.valido).toBe(true);
    expect(res.score).toBeGreaterThan(0.9);
    expect(res.candidatos).toBeDefined();
  });

  it('marca baja confianza si sugerencia no coincide', async () => {
    const res = await validarSemantica('migraciones', 'foobar');
    expect(res.valido).toBe(false);
    expect(res.score).toBeLessThan(0.3);
    expect(res.razon).toBeDefined();
  });

  it('da confianza moderada en coincidencias parciales', async () => {
    const res = await validarSemantica('migraciones', 'migración');
    expect(res.valido).toBe(true);
    expect(res.score).toBeGreaterThan(0.6);
  });

  it('devuelve explicacion para trazabilidad', async () => {
    const res = await validarSemantica('migrar', 'migrate');
    expect(res.explicacion).toBeDefined();
    expect(res.explicacion).toContain('Evaluación semántica');
  });
});
