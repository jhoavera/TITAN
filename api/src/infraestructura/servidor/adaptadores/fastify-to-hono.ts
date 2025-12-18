import type { Context } from 'hono';

export type RequestLike = {
  body?: unknown;
  params?: Record<string, string>;
  query?: Record<string, any>;
  identificadorInquilino?: string;
  usuario?: unknown;
};

export type ReplyLike = {
  code(code: number): ReplyLike;
  send(payload?: unknown): Response | undefined;
  type(contentType: string): ReplyLike;
};

type FastifyHandler = (request: RequestLike, reply: ReplyLike) => Promise<unknown> | unknown;

export function adaptarHandler(handler: FastifyHandler) {
  return async (c: Context) => {
    // Construir request mínimo compatible
    const body = await (async () => {
      try {
        return (await c.req.json()) as unknown;
      } catch (_err) {
        return undefined;
      }
    })();

    // Construir params como proxy para resolver dinámicamente c.req.param(name)
    const paramsProxy = new Proxy<Record<string, string>>({} as any, {
      get: (_t, p: string) => {
        try { return String(c.req.param(String(p))); } catch (_e) { return undefined as any; }
      }
    });

    const rawQuery = (typeof c.req.query === 'function') ? c.req.query() : {};
    const queryObj = (rawQuery instanceof URLSearchParams) ? Object.fromEntries(rawQuery.entries()) : (typeof rawQuery === 'object' ? rawQuery : {});

    const requestMock: RequestLike = {
      body,
      params: paramsProxy as unknown as Record<string, string>,
      query: queryObj,
      // headers accesibles a través de c.req.headers
    } as RequestLike;

    // añadir helper para contexto de inquilino y usuario si vienen en headers
      // Helper para leer headers de forma segura (c.req.header() o Headers)
      const getHeader = (name: string): string | undefined => {
        try {
          if (typeof (c.req.header) === 'function') return c.req.header(name) ?? undefined;
          const headers = (c.req as any).headers as Headers | undefined;
          return headers?.get(name) ?? undefined;
        } catch (_e) {
          return undefined;
        }
      };

      // Compatibilidad: aceptar tanto 'x-identificador-inquilino' como 'x-tenant'
      const tenantId = getHeader('x-identificador-inquilino') ?? getHeader('x-tenant') ?? 'local';
      requestMock.identificadorInquilino = tenantId;

      try {
        // Preferir valor proporcionado por middleware Hono (c.get('usuario'))
        const usuarioFromCtx = typeof (c as any).get === 'function' ? (c as any).get('usuario') as unknown : undefined;
        if (usuarioFromCtx && typeof usuarioFromCtx === 'object') {
          requestMock.usuario = usuarioFromCtx as any;
        } else {
          const usuarioHeader = getHeader('x-usuario');
          requestMock.usuario = usuarioHeader ? JSON.parse(usuarioHeader) : undefined;
        }
      } catch (_e) {
        (requestMock as any).usuario = undefined;
      }

    // Reply mock
    let statusCode = 200;
    let sentResponse: Response | undefined;
    const replyMock: ReplyLike = {
      code(code: number) {
        statusCode = code;
        return this;
      },
      send(payload?: unknown) {
        if (statusCode === 204) {
          try {
            sentResponse = c.text('', { status: 204 });
          } catch (e) {
            // Fallback: intentar crear Response manualmente
            // eslint-disable-next-line no-console
            console.warn('Adaptador Hono: c.text falló para status 204, intentando fallback', e);
            try {
              (c as any).res = new Response(null, { status: 204 });
              sentResponse = (c as any).res;
            } catch (e2) {
              // Último recurso: devolver JSON vacío con 204 (no ideal pero mantiene contrato)
              // eslint-disable-next-line no-console
              console.error('Adaptador Hono: fallback para 204 falló', e2);
              sentResponse = c.json(null, { status: 204 });
            }
          }
        } else {
          sentResponse = c.json(payload ?? null, { status: statusCode });
        }
        return sentResponse;
      },
      type(_contentType: string) {
        // noop para compatibilidad; adaptador no cambia comportamiento de respuesta
        return this;
      }
    };

    // Ejecutar handler
    try {
      const r = await handler(requestMock as RequestLike, replyMock as ReplyLike);
      // Si el handler envió la respuesta vía reply.send, devolverla
      if (sentResponse) return sentResponse;
      // Algunos controladores retornan explícitamente valores: capturarlos.
      if (r !== undefined) {
        if (statusCode === 204) return c.text('', { status: 204 });
        return c.json(r, { status: statusCode });
      }
      // Si nada respondió, devolver la respuesta por defecto
      return c.res;
    } catch (err) {
      // Manejo de errores simple: 500 y log minimal
      // Mantener traza y devolver mensaje genérico
      // eslint-disable-next-line no-console
      console.error('Error en adaptador Hono:', err);
      return c.json({ error: 'Error interno del servidor' }, { status: 500 });
    }
  };
}
