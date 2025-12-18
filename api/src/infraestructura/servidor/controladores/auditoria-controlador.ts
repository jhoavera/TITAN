import type { RequestLike, ReplyLike } from '@infraestructura/servidor/types/handler'
import { leerEventos, metricsText } from '@nucleo/servicios/servicio-auditoria-prevalidacion'

export async function listarPreValidacion(req: RequestLike, reply: ReplyLike) {
  const limit = Number((req.query ?? {})['limit'] ?? 100)
  const eventos = await leerEventos(limit)
  reply.send({ count: eventos.length, eventos })
}

export async function metrics(_req: RequestLike, reply: ReplyLike) {
  const txt = await metricsText()()
  reply.type('text/plain').send(txt)
}

export default { listarPreValidacion, metrics }
