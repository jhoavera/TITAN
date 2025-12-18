import type { RequestLike, ReplyLike } from '../types/handler'
import fs from 'fs'
import path from 'path'
import { esquemaRenombrado } from '../../../nucleo/validadores/validador-ops.ts'
// importar servicio dinámicamente dentro del handler para evitar problemas de resolución en test env

export async function renombrarPorADR(req: RequestLike, reply: ReplyLike) {
  // Validar payload con Zod
  try {
    await esquemaRenombrado.parseAsync(req.body ?? {})
  } catch (err: any) {
    reply.code(400).send({ error: 'Parámetros inválidos', detalle: err?.errors ?? String(err) })
    return
  }

  const body = req.body as any
  const adrRuta: string = body.adrRuta
  const ops: Array<{ desde: string; hacia: string }> = body.ops

  // comprobar estado ADR (frontmatter 'estado: aprobado')
  try {
    const contenido = await fs.promises.readFile(path.resolve(adrRuta), 'utf8')
    if (!/estado:\s*aprobado/.test(contenido)) {
      reply.code(400).send({ error: 'ADR no está en estado aprobado. No se aplicarán renombrados.' })
      return
    }
  } catch (e:any) {
    reply.code(400).send({ error: `No se puede leer ADR en ruta: ${adrRuta}` })
    return
  }

  try {
    const raizOverride = body?.raiz
    const allowOverride = process.env.TITAN_ALLOW_RENAME_ROOT_OVERRIDE === '1'
    const raiz = allowOverride && raizOverride ? raizOverride : process.cwd()
    const pathMod = require('path')
    const svcPath = pathMod.resolve(__dirname, '../../../nucleo/servicios/servicio-automatizacion-renombrados.ts')
    const { ejecutarRenombrados } = await import(svcPath)
    try {
      const res = await ejecutarRenombrados(raiz, ops, { mensaje: body?.mensaje })
      reply.send({ ok: true, detalle: res })
    } catch (e:any) {
      // DEBUG: registrar error con stack para investigar diferencia Fastify vs Hono
      // eslint-disable-next-line no-console
      console.error('ERROR ops-controlador ejecutarRenombrados:', e?.message ?? String(e), e?.stack)
      reply.code(500).send({ error: e?.message ?? String(e) })
    }
  } catch (e:any) {
    reply.code(500).send({ error: e?.message ?? String(e) })
  }
}

export default { renombrarPorADR }
