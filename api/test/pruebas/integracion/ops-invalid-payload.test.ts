import { describe, it, expect, beforeEach, afterEach } from 'vitest'
const { crearFastifyCompat } = await import('../../helpers/fastify-compat')
import fs from 'fs'
import os from 'os'
import path from 'path'

describe('Ops: validación payload Zod', () => {
  let honoApp: any
  let fastifyApp: any
  let tmpDir: string

  beforeEach(async () => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'titan-ops-invalid-'))
    const servidor = await import('../../../src/infraestructura/servidor/servidor-hono')
    honoApp = servidor.default

    fastifyApp = crearFastifyCompat()
    const rutaOps = await import('../../../src/infraestructura/servidor/rutas/ops')
    await rutaOps.default(fastifyApp)
  })

  afterEach(async () => {
    try { fs.rmSync(tmpDir, { recursive: true }) } catch (_) {}
    if (honoApp && typeof honoApp.close === 'function') await honoApp.close()
    if (fastifyApp && typeof fastifyApp.close === 'function') await fastifyApp.close()
  })

  it('Devuelve 400 cuando payload es inválido (ops vacío)', async () => {
    const payload = { adrRuta: 'ruta.md', ops: [] }
    const headers = { authorization: 'Bearer t', 'x-identificador-inquilino': 'TNT-TEST-0001' }

    const reqFast = await fastifyApp.inject({ method: 'POST', url: '/api/v1/ops/renombrar-por-adr', headers, payload })
    expect(reqFast.statusCode).toBe(400)

    const reqHono = await honoApp.fetch(new Request('http://localhost/api/v1/ops/renombrar-por-adr', { method: 'POST', headers: { ...headers, 'content-type': 'application/json' }, body: JSON.stringify(payload) }))
    expect(reqHono.status).toBe(400)
  })
})
