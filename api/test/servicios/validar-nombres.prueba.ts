import { describe, it, expect } from 'vitest';
import { validarNombre, validarNombres } from '@servicios/validar-nombres';

describe('servicio validar-nombres', () => {
  it('detecta término en inglés y sugiere traducción', () => {
    const r = validarNombre('db/migration/001_create_table.sql');
    expect(r.valido).toBe(false);
    expect(r.razones.some((z) => z.includes('migración'))).toBe(true);
    expect(r.sugerencia).toContain('migración');
  });

  it('acepta nombres en español y sin espacios', () => {
    const r = validarNombre('tabla_migraciones');
    expect(r.valido).toBe(true);
    expect(r.razones.length).toBe(0);
  });

  it('valida múltiples nombres', () => {
    const resultados = validarNombres(['migration', 'migraciones', 'algo con espacio']);
    expect(resultados.length).toBe(3);
    expect(resultados[0].valido).toBe(false);
    expect(resultados[1].valido).toBe(true);
    expect(resultados[2].valido).toBe(false);
  });
});
