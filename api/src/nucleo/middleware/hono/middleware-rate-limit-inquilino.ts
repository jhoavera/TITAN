import type { Context } from 'hono'

type Bucket = {
  tokens: number
  lastRefill: number
}

function _defaultLimit(): number { return Number(process.env.RATE_LIMIT_REQUESTS ?? 60) }
function _defaultWindowMs(): number { return Number(process.env.RATE_LIMIT_WINDOW_MS ?? 60_000) }

// Simple token bucket per inquilino in-memory. Adecuado para entorno local / homelab.
const buckets = new Map<string, Bucket>()

export function middlewareRateLimitInquilino() {
  return async (c: Context, next: () => Promise<void>) => {
    // Compatibilidad con distintos adaptadores: usar c.req o c.request según exista
    const reqLike: any = (c as any).req ?? (c as any).request ?? undefined;
    const inquilino = reqLike?.headers?.get ? reqLike.headers.get('x-identificador-inquilino') : reqLike?.headers?.['x-identificador-inquilino'] ?? 'anon';
    const key = String(inquilino);
    const now = Date.now()
    const DEFAULT_LIMIT = _defaultLimit()
    const DEFAULT_WINDOW_MS = _defaultWindowMs()

    const bucket = buckets.get(key) ?? { tokens: DEFAULT_LIMIT, lastRefill: now }

    // Refill logic
    const elapsed = now - bucket.lastRefill
    if (elapsed >= DEFAULT_WINDOW_MS) {
      bucket.tokens = DEFAULT_LIMIT
      bucket.lastRefill = now
    }

    if (bucket.tokens <= 0) {
      // Too many requests -> devolver 429 con cabeceras
      return c.text(JSON.stringify({ error: 'Límite de solicitudes alcanzado' }), 429, { 'x-rate-limit-limit': String(DEFAULT_LIMIT), 'x-rate-limit-remaining': '0' })
    }

    bucket.tokens -= 1
    buckets.set(key, bucket)

    c.header('x-rate-limit-limit', String(DEFAULT_LIMIT))
    c.header('x-rate-limit-remaining', String(bucket.tokens))

    await next()
  }
}

export function _resetRateLimitForTests() {
  buckets.clear()
}
