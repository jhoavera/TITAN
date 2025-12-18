import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import os from 'os'
import path from 'path'

describe('Migración Auditoría: paridad Fastify <-> Hono', () => {
  let honoApp: any
  let fastifyApp: any
  let tmpFile: string

  beforeEach(async () => {
    tmpFile = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'titan-audit-')), 'prevalidacion.log')
    process.env.TITAN_AUDIT_PREVALIDACION_PATH = tmpFile

    const servidor = await import('../../../src/infraestructura/servidor/servidor-hono')
    honoApp = servidor.default

    const { crearFastifyCompat } = await import('../../helpers/fastify-compat')
    fastifyApp = crearFastifyCompat()
    const rutaAud = await import('../../../src/infraestructura/servidor/rutas/auditoria')
    await rutaAud.default(fastifyApp)
  })

  afterEach(async () => {
    try { fs.rmSync(path.dirname(tmpFile), { recursive: true }) } catch (_) {}
    if (honoApp && typeof honoApp.close === 'function') await honoApp.close()
    if (fastifyApp && typeof fastifyApp.close === 'function') await fastifyApp.close()
  })

  it('Parity: listar prevalidacion y metrics deben coincidir entre Fastify y Hono', async () => {
    const svc = await import('../../../src/nucleo/servicios/servicio-auditoria-prevalidacion')
    await svc.registrarEvento({ nombre: 'prueba', tipo: 'glosario', valido: false, hayIngles: true, propuesta: 'sugerencia' })
    await svc.registrarEvento({ nombre: 'prueba2', tipo: 'glosario', valido: true, hayIngles: false })

    const headers = { authorization: 'Bearer t', 'x-identificador-inquilino': 'TNT-TEST-0001' }

    const listFast = await fastifyApp.inject({ method: 'GET', url: '/api/v1/auditoria/prevalidacion', headers })
    const listHono = await honoApp.fetch(new Request('http://localhost/api/v1/auditoria/prevalidacion', { headers }))

    expect(listFast.statusCode).toBe(200)
    expect(listHono.status).toBe(200)
    const fastBody = JSON.parse(listFast.body)
    const honoBody = JSON.parse(await listHono.text())
    expect(fastBody.count).toBeGreaterThanOrEqual(2)
    expect(honoBody.count).toBeGreaterThanOrEqual(2)

    const metricsFast = await fastifyApp.inject({ method: 'GET', url: '/metrics', headers })
    const metricsHono = await honoApp.fetch(new Request('http://localhost/metrics', { headers }))
    expect(metricsFast.statusCode).toBe(200)
    expect(metricsHono.status).toBe(200)
    const txtFast = metricsFast.body
    const txtHono = await metricsHono.text()
    expect(txtFast).toContain('titan_prevalidacion_propuestas_total')
    expect(txtHono).toContain('titan_prevalidacion_propuestas_total')
  })
})
