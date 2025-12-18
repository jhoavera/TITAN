import { describe, it, expect } from 'vitest';
import app from '../../src/infraestructura/servidor/servidor-hono';

describe('servidor Hono básico', () => {
  it('devuelve ok en health', async () => {
    const res = await app.fetch(new Request('http://localhost/.well-known/health'));
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toBe('ok');
  });

  it('sirve openapi.yaml en /api/docs/openapi.yaml', async () => {
    const res = await app.fetch(new Request('http://localhost/api/docs/openapi.yaml'));
    expect(res.status).toBe(200);
    const txt = await res.text();
    expect(txt).toContain('openapi: 3.0.0');
    // Debe incluir el esquema generado desde Zod y endpoints detectados
    expect(txt).toContain('CrearGlosario');
    expect(txt).toContain('/api/v1/glosario');
    // POST debe incluir seguridad y ejemplos automáticos
    expect(txt).toContain('security:');
    expect(txt).toContain('examples:');
    expect(txt).toContain('CrearADR');
    expect(txt).toContain('/api/v1/adrs');
  });

  it('sirve UI docs en /api/docs', async () => {
    const res = await app.fetch(new Request('http://localhost/api/docs'));
    expect(res.status).toBe(200);
    const txt = await res.text();
    expect(txt).toContain('<redoc');
  });
});
