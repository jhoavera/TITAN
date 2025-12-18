import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import path from 'path' 

describe('Migración ADRs: paridad Fastify <-> Hono', () => {
  const tmpFile = path.join(process.cwd(), 'tmp-adrs.json')
  let honoApp: any
  let fastifyApp: any

  beforeEach(async () => {
    delete process.env.DATABASE_URL
    try { await fs.promises.rm(tmpFile, { force: true }) } catch (_) {}

    const servidor = await import('../../../src/infraestructura/servidor/servidor-hono')
    honoApp = servidor.default

    const { crearFastifyCompat } = await import('../../helpers/fastify-compat')
    fastifyApp = crearFastifyCompat()
    const rutaADRs = await import('../../../src/infraestructura/servidor/rutas/adrs')
    await rutaADRs.default(fastifyApp)
  })

  afterEach(async () => {
    try { await fs.promises.rm(tmpFile, { force: true }) } catch (_) {}
    if (honoApp && typeof honoApp.close === 'function') await honoApp.close()
    if (fastifyApp && typeof fastifyApp.close === 'function') await fastifyApp.close()
  })

  it('Parity: CRUD ADRs should match between Fastify and Hono', async () => {
    // Payload válido según esquemas Zod
    const payload = {
      numero: 9999,
      titulo: 'Decidir formato de ejemplo para migración',
      objetivo: 'Asegurar que la migración preserve comportamiento y validaciones',
      decision: 'Se decide usar Hono y mantener compatibilidad con adaptador',
    }

    const headers = { authorization: 'Bearer t', 'x-identificador-inquilino': 'TNT-TEST-0001' }
    const reqFastCreate = await fastifyApp.inject({ method: 'POST', url: '/api/v1/adrs', headers, payload })
    const reqHonoCreate = await honoApp.fetch(new Request('http://localhost/api/v1/adrs', { method: 'POST', headers: { ...headers, 'content-type': 'application/json' }, body: JSON.stringify(payload) }))

    expect(reqFastCreate.statusCode).toBe(201)
    expect(reqHonoCreate.status).toBe(201)

    const creadoFast = JSON.parse(reqFastCreate.body).creado
    const creadoHono = JSON.parse(await reqHonoCreate.text()).creado
    expect(creadoFast.numero).toBe(payload.numero)
    expect(creadoHono.numero).toBe(payload.numero)

    // Listar
    const listFast = await fastifyApp.inject({ method: 'GET', url: '/api/v1/adrs', headers })
    const listHono = await honoApp.fetch(new Request('http://localhost/api/v1/adrs', { headers }))
    expect(listFast.statusCode).toBe(200)
    expect(listHono.status).toBe(200)

    // Obtener
    const getFast = await fastifyApp.inject({ method: 'GET', url: `/api/v1/adrs/${creadoFast.id}`, headers })
    const getHono = await honoApp.fetch(new Request(`http://localhost/api/v1/adrs/${creadoHono.id}`, { headers }))
    expect(getFast.statusCode).toBe(200)
    expect(getHono.status).toBe(200)

    // Actualizar
    const patchPayload = { estado: 'APROBADO' }
    const patchFast = await fastifyApp.inject({ method: 'PATCH', url: `/api/v1/adrs/${creadoFast.id}`, headers, payload: patchPayload })
    const patchHono = await honoApp.fetch(new Request(`http://localhost/api/v1/adrs/${creadoHono.id}`, { method: 'PATCH', headers: { ...headers, 'content-type': 'application/json' }, body: JSON.stringify(patchPayload) }))
    expect(patchFast.statusCode).toBe(200)
    expect(patchHono.status).toBe(200)
    expect(JSON.parse(patchFast.body).estado).toBe('APROBADO')
    expect(JSON.parse(await patchHono.text()).estado).toBe('APROBADO')

    // Eliminar
    const delFast = await fastifyApp.inject({ method: 'DELETE', url: `/api/v1/adrs/${creadoFast.id}`, headers })
    const delHono = await honoApp.fetch(new Request(`http://localhost/api/v1/adrs/${creadoHono.id}`, { method: 'DELETE', headers }))
    expect(delFast.statusCode).toBe(204)
    expect(delHono.status).toBe(204)
  })
})
