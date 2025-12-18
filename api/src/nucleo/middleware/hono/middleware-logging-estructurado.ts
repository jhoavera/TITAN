import pino from 'pino'
import type { Context } from 'hono'

const logger = pino({ level: process.env.LOG_LEVEL ?? 'info' })

export function middlewareLoggingEstructurado() {
  return async (c: Context, next: () => Promise<void>) => {
    const start = Date.now()
    const req = c.req
    const trace: Record<string, unknown> = {
      method: req.method,
      path: new URL(req.url).pathname,
      inquilino: req.headers.get('x-identificador-inquilino') ?? null
    }
    try {
      await next()
      const duration = Date.now() - start
      trace['status'] = (c as any).res?.status ?? 200
      trace['duration_ms'] = duration
      logger.info(trace as any, 'request')
    } catch (err: any) {
      const duration = Date.now() - start
      trace['duration_ms'] = duration
      trace['error'] = err?.message ?? String(err)
      logger.error(trace as any, 'request_error')
      throw err
    }
  }
}
