import { describe, it, expect, beforeEach } from 'vitest'
import { middlewareRateLimitInquilino, _resetRateLimitForTests } from '../../../src/nucleo/middleware/hono/middleware-rate-limit-inquilino'

function makeCtx(headers: Record<string, string | undefined> = {}, method = 'GET') {
  const map = new Map(Object.entries(headers))
  const ctx: any = {
    req: {
      method,
      url: 'http://localhost/test',
      headers: {
        get: (k: string) => map.get(k)
      }
    },
    header: (k: string, v: string) => { ctx[k] = v },
    text: (s: string, status?: number) => { ctx._text = s; ctx._status = status ?? 200 },
  }
  return ctx
}

describe('middlewareRateLimitInquilino', () => {
  beforeEach(() => { _resetRateLimitForTests() })

  it('debe permitir hasta DEFAULT_LIMIT solicitudes y luego bloquear', async () => {
    // Emular variable de entorno pequeña para test
    process.env.RATE_LIMIT_REQUESTS = '3'
    process.env.RATE_LIMIT_WINDOW_MS = '60000'
    const mw = middlewareRateLimitInquilino()

    const c = makeCtx({ 'x-identificador-inquilino': 'TNT-TEST' })
    let called = 0

    // 3 peticiones deben pasar
    for (let i = 0; i < 3; i++) {
      await mw(c, async () => { called += 1 })
      expect(c['x-rate-limit-remaining']).toBe(String(3 - (i + 1)))
    }

    // 4a petición se bloquea
    const c2 = makeCtx({ 'x-identificador-inquilino': 'TNT-TEST' })
    await mw(c2, async () => { called += 1 })
    expect(c2._status).toBe(429)
    expect(c2._text).toContain('Límite de solicitudes alcanzado')
    expect(called).toBe(3)
  })
})
