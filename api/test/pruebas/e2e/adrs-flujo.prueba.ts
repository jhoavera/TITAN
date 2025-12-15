import { describe, it, expect, beforeEach, vi } from 'vitest';
import fastify from 'fastify';

// Mock cliente DB para evitar inicialización real
vi.mock('../../../src/infraestructura/base-de-datos/cliente', () => ({ inicializarDb: () => {}, obtenerDb: () => ({}) }));

// Mock in-memory para repositorio de ADRs
const store: Record<string, any> = {};

vi.mock('../../../src/infraestructura/repositorios/repositorio-adrs', () => ({
  crearADR: async (_db: any, body: any, identificadorInquilino: string, autorId: string) => {
    const id = '00000000-0000-0000-0000-0000000000' + (Object.keys(store).length + 1);
    const obj = { ...body, id, identificador_inquilino: identificadorInquilino, autor: autorId, estado: body.estado || 'BORRADOR' };
    store[id] = obj;
    return obj;
  },
  obtenerADRPorId: async (_db: any, id: string) => {
    return store[id] || null;
  },
  actualizarADR: async (_db: any, id: string, body: any) => {
    store[id] = { ...store[id], ...body };
    return store[id];
  },
  eliminarADR: async () => {},
  obtenerListaADRs: async () => Object.values(store),
}));

describe('E2E ADRs - flujo crear → enviar a revisión → aprobar', async () => {
  let app: ReturnType<typeof fastify>;

  beforeEach(async () => {
    // reset store
    for (const k of Object.keys(store)) delete store[k];
    app = fastify();
    // middleware que establece identificador de inquilino y usuario
    app.addHook('preHandler', (req: any, _reply, done) => {
      req.identificadorInquilino = 'TNT-PRUEBA-000001';
      req.usuario = { id: '00000000-0000-0000-0000-000000000001' };
      done();
    });
    // registrar rutas reales (import dinámico para compatibilidad ESM)
    const rutaADRs = (await import('../../../src/infraestructura/servidor/rutas/adrs')).default;
    await app.register(rutaADRs);
  });

  it('flujo completo con git_ref al aprobar', async () => {
    // Crear ADR
    const crearResp = await app.inject({ method: 'POST', url: '/api/v1/adrs', payload: {
      numero: 42,
      titulo: 'Prueba flujo E2E ADR',
      objetivo: 'Verificar flujo de creación y aprobación',
      decision: 'Elegir opción de prueba',
    }});

    if (crearResp.statusCode !== 201) {
      // mostrar payload para diagnosticar fallo en ambiente de pruebas
      // eslint-disable-next-line no-console
      console.error('CREAR RESP INESPERADA:', crearResp.statusCode, crearResp.payload);
    }
    expect(crearResp.statusCode).toBe(201);
    const creado = JSON.parse(crearResp.payload);
    expect(creado.numero).toBe(42);

    // Enviar a revisión (actualizar estado)
    const enviarResp = await app.inject({ method: 'PATCH', url: `/api/v1/adrs/${creado.id}`, payload: { estado: 'PENDIENTE' }});
    expect(enviarResp.statusCode).toBe(200);
    const pendiente = JSON.parse(enviarResp.payload);
    expect(pendiente.estado).toBe('PENDIENTE');

    // Aprobar (simular que aprobador añade git_ref)
    const aprobarResp = await app.inject({ method: 'PATCH', url: `/api/v1/adrs/${creado.id}`, payload: { estado: 'APROBADO', notas_revision: 'Aprobado en pruebas', git_ref: 'refs/heads/main@{2025-12-15}' } as any });
    expect(aprobarResp.statusCode).toBe(200);
    const aprobado = JSON.parse(aprobarResp.payload);
    // Validar que git_ref quedó registrado
    expect((aprobado as any).git_ref || (aprobado as any).gitRef).toBeTruthy();

    // Obtener y verificar
    const getResp = await app.inject({ method: 'GET', url: `/api/v1/adrs/${creado.id}` });
    expect(getResp.statusCode).toBe(200);
    const finalObj = JSON.parse(getResp.payload);
    expect(finalObj.estado).toBe('APROBADO');
  });
});
