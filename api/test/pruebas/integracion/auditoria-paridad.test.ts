import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import os from 'os'
import path from 'path'

describe('Auditoría Hono', () => {
  let app: any
  let tmpFile: string

  beforeEach(async () => {
    tmpFile = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'titan-audit-')), 'prevalidacion.log')
    process.env.TITAN_AUDIT_PREVALIDACION_PATH = tmpFile

    const servidor = await import('@infraestructura/servidor/servidor-hono')
    app = servidor.default
    const { _resetRateLimitForTests } = await import('@nucleo/middleware/hono/middleware-rate-limit-inquilino')
    _resetRateLimitForTests()
  })

  afterEach(async () => {
    delete process.env.TITAN_AUDIT_PREVALIDACION_PATH
    try { fs.rmSync(path.dirname(tmpFile), { recursive: true }) } catch (_) {}
  })

  it('listado de prevalidacion y métricas expuestas', async () => {
    const svc = await import('@nucleo/servicios/servicio-auditoria-prevalidacion')
    await svc.registrarEvento({ nombre: 'prueba', tipo: 'glosario', valido: false, hayIngles: true, propuesta: 'sugerencia' })
    await svc.registrarEvento({ nombre: 'prueba2', tipo: 'glosario', valido: true, hayIngles: false })

    const headers = { authorization: 'Bearer token-usuario-prueba', 'x-identificador-inquilino': 'TNT-TEST-0001' }

    const listHono = await app.request('/api/v1/auditoria/prevalidacion', { headers })
    const listBody = await listHono.json()
    expect(listHono.status).toBe(200)
    expect(listBody.count).toBeGreaterThanOrEqual(2)

    const metricsHono = await app.request('/metrics', { headers })
    const txtHono = await metricsHono.text()
    expect(metricsHono.status).toBe(200)
    expect(txtHono).toContain('titan_prevalidacion_propuestas_total')
  })
})
