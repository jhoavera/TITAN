import { describe, it, expect, beforeEach } from 'vitest'

describe('Ops: validación payload Zod en Hono', () => {
  let app: any

  beforeEach(async () => {
    const servidor = await import('@infraestructura/servidor/servidor-hono')
    app = servidor.default
    const { _resetRateLimitForTests } = await import('@nucleo/middleware/hono/middleware-rate-limit-inquilino')
    _resetRateLimitForTests()
  })

  it('Devuelve 400 cuando payload es inválido (ops vacío)', async () => {
    const payload = { adrRuta: 'ruta.md', ops: [] }
    const headers = { authorization: 'Bearer token-usuario-prueba', 'x-identificador-inquilino': 'TNT-TEST-0001', 'content-type': 'application/json' }

    const reqHono = await app.request('/api/v1/ops/renombrar-por-adr', { method: 'POST', headers, body: JSON.stringify(payload) })
    expect(reqHono.status).toBe(400)
  })
})
