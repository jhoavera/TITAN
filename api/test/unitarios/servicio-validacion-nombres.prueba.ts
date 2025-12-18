import { describe, it, expect } from 'vitest';
import { ServicioValidacionNombres } from '@servicios/servicio-validacion-nombres';

describe('ServicioValidacionNombres', () => {
  const svc = new ServicioValidacionNombres();

  it('sugiere traducción para migracion/migraciones', () => {
    expect(svc.sugerirTraduccion('migracion')).toBe('migración / migraciones');
    expect(svc.sugerirTraduccion('migraciones')).toBe('migración / migraciones');
  });

  it('valida nombres correctos y detecta inglés', () => {
    const resultado = svc.validarNombreElemento('migraciones-0001_create_table.sql');
    expect(resultado.valido).toBe(false);
    expect(resultado.razones.some(r => r.includes('Contiene término en inglés'))).toBe(true);
  });
});
