import { describe, it, expect, beforeEach } from 'vitest';
import app from '../../src/infraestructura/servidor/servidor-hono';
import { _resetRateLimitForTests } from '../../src/nucleo/middleware/hono/middleware-rate-limit-inquilino';

const validBody = { termino: 'PruebaRateLimit', definicion: 'Definición suficientemente larga para pasar la validación de pruebas', categoria: 'TERMINO_TECNICO' };

describe('E2E rate-limit', () => {
  beforeEach(() => {
    _resetRateLimitForTests();
  });

  it('devuelve 429 cuando se supera el límite por inquilino', async () => {
    const requests = 61; // default 60 requests por ventana
    let lastStatus = 0;
    for (let i = 0; i < requests; i++) {
      const res = await app.fetch(new Request('http://localhost/api/v1/glosario', { method: 'POST', body: JSON.stringify(validBody), headers: { 'content-type': 'application/json', 'x-identificador-inquilino': 'TENANT-1' } }));
      lastStatus = res.status;
      if (i < requests - 1) {
        // expect first 60 to be success 201
        expect([201, 200]).toContain(res.status);
      }
    }

    expect(lastStatus).toBe(429);
  });
});
