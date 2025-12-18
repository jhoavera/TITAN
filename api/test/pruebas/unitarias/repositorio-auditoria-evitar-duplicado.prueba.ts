import { describe, it, expect, vi } from 'vitest';
import * as repoGlosario from '../../../src/infraestructura/repositorios/repositorio-glosario';
import * as repoADRs from '../../../src/infraestructura/repositorios/repositorio-adrs';
import { validarNombreArchivo } from '../../../src/nucleo/utilidades/validar-nombre-archivo';
import { limpiarCacheChequeoAuditoria } from '../../../src/infraestructura/base-de-datos/utilidades/chequeo-auditoria';

describe('Comportamiento auditoría - evitar duplicados (repositorios)', () => {
  it('validar nombre del archivo cumple estándares', () => {
    const nombre = 'repositorio-auditoria-evitar-duplicado.prueba.ts';
    const { valido, razones } = validarNombreArchivo(nombre);
    expect(valido).toBe(true);
    expect(razones.length).toBe(0);
  });

  it('repositorio ADDS: no inserta auditoría explícita cuando existen triggers', async () => {
    const fakeDb: any = {
      insert: vi.fn().mockReturnThis(),
      values: vi.fn().mockReturnThis(),
      returning: vi.fn().mockReturnThis(),
      execute: vi.fn().mockResolvedValue(undefined),
      query: vi.fn().mockResolvedValue([{ funciones: '1', triggers: '1' }]),
    };
    (fakeDb.returning as any).mockResolvedValue([{ id: 'x', numero: 1 }]);
    const creado = await repoADRs.crearADR(fakeDb as any, { numero: 1, titulo: 'T' } as any, 'tenant-1', 'autor-1');
    expect(creado).toBeDefined();
    // Solo insert llamada para crear ADR
    expect((fakeDb.insert as any).mock.calls.length).toBe(1);
  });

  it('repositorio Glosario: inserta auditoría explícita cuando no hay triggers', async () => {
    // limpiar cache entre escenarios para simular estado independiente de BD
    limpiarCacheChequeoAuditoria();
    const fakeDb: any = {
      insert: vi.fn().mockReturnThis(),
      values: vi.fn().mockReturnThis(),
      returning: vi.fn().mockReturnThis(),
      execute: vi.fn().mockResolvedValue(undefined),
      query: vi.fn().mockResolvedValue([{ funciones: '0', triggers: '0' }]),
    };
    (fakeDb.returning as any).mockResolvedValue([{ id: 'g1', termino: 'foo' }]);
    const creado = await repoGlosario.crearGlosario(fakeDb as any, { termino: 'foo', definicion: 'bar' } as any, 'tenant-1', 'autor-1');
    expect(creado).toBeDefined();
    // insert called at least twice (glosario + auditoría)
    expect((fakeDb.insert as any).mock.calls.length).toBeGreaterThanOrEqual(2);
  });
});
