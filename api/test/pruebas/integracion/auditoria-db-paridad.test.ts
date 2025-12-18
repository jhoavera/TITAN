import { describe, it, expect, beforeEach } from 'vitest'
import { obtenerDb } from '@infraestructura/base-de-datos/cliente'

describe('Auditoría DB en Hono', () => {
  let app: any

  beforeEach(async () => {
    const db: any = obtenerDb()
    db.store = {}
    db.lastId = 0
    const servidor = await import('@infraestructura/servidor/servidor-hono')
    app = servidor.default
    const { _resetRateLimitForTests } = await import('@nucleo/middleware/hono/middleware-rate-limit-inquilino')
    _resetRateLimitForTests()
  })

  it('registrar creación genera auditoría', async () => {
    const headers = { authorization: 'Bearer token-usuario-prueba', 'x-identificador-inquilino': 'TNT-TEST-0001', 'content-type': 'application/json' }
    const payload = { numero: 8888, titulo: 'Prueba auditoria DB crear ADR', objetivo: 'Verificar inserción auditoría', decision: 'Se prueba logging de auditoría' }

    const crearUno = await app.request('/api/v1/adrs', { method: 'POST', headers, body: JSON.stringify(payload) })
    expect(crearUno.status).toBe(201)
    const crearDos = await app.request('/api/v1/adrs', { method: 'POST', headers, body: JSON.stringify({ ...payload, numero: 8889, titulo: 'Segundo ADR para auditoria' }) })
    expect(crearDos.status).toBe(201)

    const db: any = obtenerDb()
    const rows = Object.values(db.store)
    const auditorias = rows.filter((r: any) => typeof r.entidad === 'string')
    expect(auditorias.length).toBeGreaterThanOrEqual(2)
    expect(auditorias.some((a: any) => a.operacion === 'CREAR')).toBe(true)
  })

  it('eliminar ADR genera entrada ELIMINAR', async () => {
    const headers = { authorization: 'Bearer token-usuario-prueba', 'x-identificador-inquilino': 'TNT-TEST-0001', 'content-type': 'application/json' }
    const payload = { numero: 7777, titulo: 'Prueba auditoria DB eliminar ADR', objetivo: 'Verificar inserción auditoría eliminar', decision: 'Se prueba logging de auditoría en eliminación' }

    const crear = await app.request('/api/v1/adrs', { method: 'POST', headers, body: JSON.stringify(payload) })
    const crearBody = await crear.json()
    expect(crear.status).toBe(201)

    const del = await app.request(`/api/v1/adrs/${crearBody.creado.id}`, { method: 'DELETE', headers })
    expect(del.status).toBe(204)

    const db: any = obtenerDb()
    const rows = Object.values(db.store)
    const auditoriasEliminar = rows.filter((r: any) => r.operacion === 'ELIMINAR')
    expect(auditoriasEliminar.length).toBeGreaterThanOrEqual(1)
    expect(auditoriasEliminar.some((a: any) => a.entidad === 'adrs')).toBe(true)
  })
})
