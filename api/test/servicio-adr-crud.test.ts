import { describe, it, expect } from 'vitest';
import { crearADR, leerADR, actualizarADR, eliminarADR } from '@servicios/servicio-adr-crud';

const adrExample = {
  id: '2025-12-18-ejemplo-prueba',
  titulo: 'Prueba de ADR automática',
  autor: 'tester',
  fecha: new Date().toISOString(),
  estado: 'pendiente' as const,
  decision: 'Decisión de ejemplo para pruebas',
};

describe('Servicio ADR CRUD', () => {
  it('crea, lee, actualiza y elimina ADR', () => {
    crearADR(adrExample);
    const leido = leerADR(adrExample.id);
    expect(leido).not.toBeNull();
    expect(leido?.titulo).toBe(adrExample.titulo);
    const actualizado = actualizarADR(adrExample.id, { estado: 'aprobado' as const });
    expect(actualizado?.estado).toBe('aprobado');
    const eliminado = eliminarADR(adrExample.id);
    expect(eliminado).toBe(true);
    const despues = leerADR(adrExample.id);
    expect(despues).toBeNull();
  });
});
