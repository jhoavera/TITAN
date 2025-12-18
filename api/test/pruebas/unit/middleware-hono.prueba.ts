import { describe, it, expect } from 'vitest'
import { middlewareContextoInquilinoHono } from '@nucleo/middleware/hono/middleware-contexto-inquilino'
import { middlewareCorsConfigurable } from '@nucleo/middleware/hono/middleware-cors-configurable'
import { middlewareLoggingEstructurado } from '@nucleo/middleware/hono/middleware-logging-estructurado'

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
    header: (_k: string, _v: string) => {},
    text: (_s: string, _status?: number) => {
      ctx._text = true
      ctx._status = _status ?? 200
    },
    set: (_k: string, _v: any) => { ctx[_k] = _v },
    get: (k: string) => ctx[k]
  }
  return ctx
}

describe('Middlewares Hono: contexto / cors / logging', () => {
  it('middlewareContextoInquilinoHono debe usar header x-identificador-inquilino', async () => {
    const c = makeCtx({ 'x-identificador-inquilino': 'TNT-TEST-01' })
    const mw = middlewareContextoInquilinoHono()
    let nextCalled = false
    await mw(c, async () => { nextCalled = true })
    expect(nextCalled).toBe(true)
    expect(c.req.identificadorInquilino).toBe('TNT-TEST-01')
  })

  it('middlewareContextoInquilinoHono debe extraer inquilino desde usuario', async () => {
    const c = makeCtx({}, 'GET')
    // simular usuario en request
    c.req.usuario = { inquilino: 'TNT-USER-123' }
    const mw = middlewareContextoInquilinoHono()
    await mw(c, async () => {})
    expect(c.req.identificadorInquilino).toBe('TNT-USER-123')
  })

  it('middlewareCorsConfigurable debe responder 204 a OPTIONS', async () => {
    const c = makeCtx({}, 'OPTIONS')
    const mw = middlewareCorsConfigurable()
    let nextCalled = false
    await mw(c, async () => { nextCalled = true })
    expect(c._text).toBe(true)
    expect(c._status).toBe(204)
    expect(nextCalled).toBe(false)
  })

  it('middlewareLoggingEstructurado debe llamar next sin error', async () => {
    const c = makeCtx({ 'x-identificador-inquilino': 'TNT-LOG' }, 'GET')
    const mw = middlewareLoggingEstructurado()
    let called = false
    await mw(c, async () => { called = true })
    expect(called).toBe(true)
  })
})
