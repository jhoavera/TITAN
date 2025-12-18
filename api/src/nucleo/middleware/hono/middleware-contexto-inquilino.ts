import type { Context } from 'hono';

export function middlewareContextoInquilinoHono() {
  return async (c: Context, next: () => Promise<void>) => {
    // Priorizar header X
    const header = (c.req.headers.get('x-identificador-inquilino') ?? '').trim();
    if (header) {
      (c as any).req.identificadorInquilino = header
      await next()
      return
    }

    // Intentar extraer del usuario (si existe)
    try {
      const usuario = (c as any).req.usuario ?? c.get('usuario')
      if (usuario && (usuario as any).inquilino) {
        (c as any).req.identificadorInquilino = (usuario as any).inquilino
        await next()
        return
      }
    } catch (_e) {
      // ignorar
    }

    (c as any).req.identificadorInquilino = null
    await next()
  }
}
