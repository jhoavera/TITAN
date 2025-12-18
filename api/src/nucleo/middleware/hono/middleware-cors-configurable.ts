import type { Context } from 'hono'

export type CorsOptions = {
  origin?: string | ((originHeader: string | null) => string | null)
  methods?: string
  headers?: string
  credentials?: boolean
}

export function middlewareCorsConfigurable(opts: CorsOptions = {}) {
  const methods = opts.methods ?? 'GET,POST,PATCH,PUT,DELETE,OPTIONS'
  const headers = opts.headers ?? 'Content-Type,Authorization'
  const credentials = opts.credentials ? 'true' : 'false'

  return async (c: Context, next: () => Promise<void>) => {
    const origin = c.req.headers.get('origin') ?? null
    let allowed: string | null = null
    if (typeof opts.origin === 'function') allowed = opts.origin(origin)
    else allowed = opts.origin ?? '*'

    // Añadir cabeceras CORS básicas
    c.header('Access-Control-Allow-Origin', allowed ?? '*')
    c.header('Access-Control-Allow-Methods', methods)
    c.header('Access-Control-Allow-Headers', headers)
    c.header('Access-Control-Allow-Credentials', credentials)

    // Responder OPTIONS inmediatamente
    if (c.req.method === 'OPTIONS') {
      return c.text('', 204)
    }

    await next()
  }
}
