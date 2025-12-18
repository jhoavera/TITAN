import type { Context } from 'hono'
import type { RequestLike, ReplyLike } from '@infraestructura/servidor/types/handler'

/**
 * Adaptador genérico de Context Hono a la interfaz RequestLike/ReplyLike
 * usada por controladores existentes. Elimina referencias a Fastify.
 */
type HandlerLike = (request: RequestLike, reply: ReplyLike) => Promise<unknown> | unknown

export function adaptarHandlerHono(handler: HandlerLike) {
  return async (c: Context) => {
    const body = await (async () => {
      try {
        return (await c.req.json()) as unknown
      } catch (_err) {
        return undefined
      }
    })()

    const paramsProxy = new Proxy<Record<string, string>>({} as any, {
      get: (_t, p: string) => {
        try { return String(c.req.param(String(p))) } catch (_e) { return undefined as any }
      }
    })

    const rawQuery = (typeof c.req.query === 'function') ? c.req.query() : {}
    const queryObj = (rawQuery instanceof URLSearchParams) ? Object.fromEntries(rawQuery.entries()) : (typeof rawQuery === 'object' ? rawQuery : {})

    const requestMock: RequestLike = {
      body,
      params: paramsProxy as unknown as Record<string, string>,
      query: queryObj,
    } as RequestLike

    const getHeader = (name: string): string | undefined => {
      try {
        if (typeof (c.req.header) === 'function') return c.req.header(name) ?? undefined
        const headers = (c.req as any).headers as Headers | undefined
        return headers?.get(name) ?? undefined
      } catch (_e) {
        return undefined
      }
    }

    const tenantId = getHeader('x-identificador-inquilino') ?? getHeader('x-tenant') ?? 'local'
    requestMock.identificadorInquilino = tenantId

    try {
      const usuarioFromCtx = typeof (c as any).get === 'function' ? (c as any).get('usuario') as unknown : undefined
      if (usuarioFromCtx && typeof usuarioFromCtx === 'object') {
        requestMock.usuario = usuarioFromCtx as any
      } else {
        const usuarioHeader = getHeader('x-usuario')
        requestMock.usuario = usuarioHeader ? JSON.parse(usuarioHeader) : undefined
      }
    } catch (_e) {
      (requestMock as any).usuario = undefined
    }

    let statusCode = 200
    let sentResponse: Response | undefined
    const replyMock: ReplyLike = {
      code(code: number) {
        statusCode = code
        return this
      },
      send(payload?: unknown) {
        if (statusCode === 204) {
          try {
            sentResponse = c.text('', { status: 204 })
          } catch (e) {
            try {
              (c as any).res = new Response(null, { status: 204 })
              sentResponse = (c as any).res
            } catch (e2) {
              sentResponse = c.json(null, { status: 204 })
            }
          }
        } else {
          sentResponse = c.json(payload ?? null, { status: statusCode })
        }
        return sentResponse
      },
      type(_contentType: string) {
        return this
      }
    }

    try {
      const r = await handler(requestMock as RequestLike, replyMock as ReplyLike)
      if (sentResponse) return sentResponse
      if (r !== undefined) {
        if (statusCode === 204) return c.text('', { status: 204 })
        return c.json(r, { status: statusCode })
      }
      return c.res
    } catch (err) {
      console.error('Error en adaptador Hono:', err)
      return c.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
  }
}
