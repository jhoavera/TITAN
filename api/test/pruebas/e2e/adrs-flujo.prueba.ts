import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock cliente DB para evitar inicialización real
vi.mock('@infraestructura/base-de-datos/cliente', () => ({ inicializarDb: () => {}, obtenerDb: () => ({}) }));

// Mock in-memory para repositorio de ADRs
const store: Record<string, any> = {};

vi.mock('@infraestructura/repositorios/repositorio-adrs', () => ({
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

describe('E2E ADRs Hono - flujo crear → enviar a revisión → aprobar', async () => {
  let app: any;

  beforeEach(async () => {
    for (const k of Object.keys(store)) delete store[k];
    const servidor = await import('@infraestructura/servidor/servidor-hono');
    app = servidor.default;
    const { _resetRateLimitForTests } = await import('@nucleo/middleware/hono/middleware-rate-limit-inquilino');
    _resetRateLimitForTests();
  });

  it('flujo completo con git_ref al aprobar', async () => {
    const headers = {
      authorization: 'Bearer token-usuario-prueba',
      'x-identificador-inquilino': 'TNT-PRUEBA-000001',
      'content-type': 'application/json'
    };

    const crearResp = await app.request('/api/v1/adrs', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        numero: 42,
        titulo: 'Prueba flujo E2E ADR',
        objetivo: 'Verificar flujo de creación y aprobación',
        decision: 'Elegir opción de prueba'
      })
    });

    const crearBody = await crearResp.json();
    expect(crearResp.status).toBe(201);
    expect(crearBody.creado.numero).toBe(42);

    const enviarResp = await app.request(`/api/v1/adrs/${crearBody.creado.id}`, {
      method: 'PATCH', headers, body: JSON.stringify({ estado: 'PENDIENTE' })
    });
    const pendiente = await enviarResp.json();
    expect(enviarResp.status).toBe(200);
    expect(pendiente.estado).toBe('PENDIENTE');

    const aprobarResp = await app.request(`/api/v1/adrs/${crearBody.creado.id}`, {
      method: 'PATCH', headers, body: JSON.stringify({ estado: 'APROBADO', notas_revision: 'Aprobado en pruebas', git_ref: 'refs/heads/main@{2025-12-15}' })
    });
    const aprobado = await aprobarResp.json();
    expect(aprobarResp.status).toBe(200);
    expect((aprobado as any).git_ref || (aprobado as any).gitRef).toBeTruthy();

    const getResp = await app.request(`/api/v1/adrs/${crearBody.creado.id}`, { headers });
    const finalObj = await getResp.json();
    expect(getResp.status).toBe(200);
    expect(finalObj.estado).toBe('APROBADO');
  });
});
