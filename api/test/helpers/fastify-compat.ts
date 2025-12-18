import { Hono } from 'hono'
import { adaptarHandler } from '../../src/infraestructura/servidor/adaptadores/fastify-to-hono'

type FastifyCompat = {
  post: (path: string, optsOrHandler: any, handler?: any) => void
  get: (path: string, optsOrHandler: any, handler?: any) => void
  patch: (path: string, optsOrHandler: any, handler?: any) => void
  delete: (path: string, optsOrHandler: any, handler?: any) => void
  addHook: (name: string, fn: Function) => void
  register: (registrador: Function) => Promise<void>
  inject: (opts: { method: string; url: string; headers?: Record<string, string>; payload?: unknown }) => Promise<{ statusCode: number; payload: string }>
  ready: () => Promise<void>
  close: () => Promise<void>
}

export function crearFastifyCompat(): FastifyCompat {
  const app = new Hono()
  const preHandlers: Function[] = []

  function runPreHandlers(c: any) {
    const headersObj: Record<string, string> = {}
    try {
      // copiar headers a objeto sencillo (lowercase)
      for (const [k, v] of (c.req.raw.headers as any).entries()) headersObj[k.toLowerCase()] = String(v)
    } catch (_e) {
      // fallback: intentar acceder a header por función
      try {
        const h = c.req.header as any
        if (typeof h === 'function') {
          // no podemos enumerar, así que no hacemos nada especial
        }
      } catch (_e2) {}
    }

    const fakeReq: any = { headers: headersObj }

    return Promise.resolve()
      .then(async () => {
        for (const pre of preHandlers) {
          await pre(fakeReq)
        }
      })
      .then(() => {
        // Propagar al contexto Hono para que adaptarHandler lo lea
        if ((fakeReq as any).usuario !== undefined) (c as any).set?.('usuario', (fakeReq as any).usuario)
        if ((fakeReq as any).identificadorInquilino !== undefined) (c as any).set?.('identificadorInquilino', (fakeReq as any).identificadorInquilino)
      })
  }

  function registerRoute(method: 'get' | 'post' | 'patch' | 'delete', path: string, optsOrHandler: any, handler?: any) {
    const h = handler ?? optsOrHandler
    app[method](path, async (c) => {
      await runPreHandlers(c)
      return adaptarHandler(h)(c)
    })
  }

  return {
    post(path: string, optsOrHandler: any, handler?: any) { registerRoute('post', path, optsOrHandler, handler) },
    get(path: string, optsOrHandler: any, handler?: any) { registerRoute('get', path, optsOrHandler, handler) },
    patch(path: string, optsOrHandler: any, handler?: any) { registerRoute('patch', path, optsOrHandler, handler) },
    delete(path: string, optsOrHandler: any, handler?: any) { registerRoute('delete', path, optsOrHandler, handler) },
    addHook(name: string, fn: Function) {
      if (name === 'preHandler') preHandlers.push(fn)
    },
    async register(registrador: Function) {
      await registrador(this as any)
    },
    async inject(opts: { method: string; url: string; headers?: Record<string, string>; payload?: unknown }) {
      const headersInit = new Headers()
      if (opts.headers) for (const k of Object.keys(opts.headers)) headersInit.set(k, opts.headers[k])
      const body = opts.payload ? JSON.stringify(opts.payload) : undefined
      const req = new Request('http://localhost' + opts.url, { method: opts.method, headers: headersInit, body })
      const res = await (app as any).fetch(req)
      const text = await res.text()
      // Compat con Fastify inject: retorna { statusCode, body }
      return { statusCode: res.status, payload: text, body: text }
    },
    async ready() { /* noop */ },
    async close() { /* noop */ }
  }
}
