import type { RequestLike, ReplyLike } from '../types/handler'
export async function listarPreValidacion(req: RequestLike, reply: ReplyLike) {
  const limit = Number((req.query ?? {})['limit'] ?? 100)
  const path = require('path')
  const svcPath = path.resolve(__dirname, '../../../nucleo/servicios/servicio-auditoria-prevalidacion.ts')
  const svc = await import(svcPath)
  const eventos = await svc.leerEventos(limit)
  reply.send({ count: eventos.length, eventos })
}

export async function metrics(req: RequestLike, reply: ReplyLike) {
  const path = require('path')
  const svcPath = path.resolve(__dirname, '../../../nucleo/servicios/servicio-auditoria-prevalidacion.ts')
  const svc = await import(svcPath)
  const txt = await svc.metricsText()()
  reply.type('text/plain').send(txt)
}

export default { listarPreValidacion, metrics }
