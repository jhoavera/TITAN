import { describe, it, expect, beforeEach } from 'vitest'
import { obtenerDb } from '@infraestructura/base-de-datos/cliente'

describe('ADRs Hono CRUD', () => {
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

  it('realiza CRUD completo con stub DB', async () => {
    const headers = { authorization: 'Bearer token-usuario-prueba', 'x-identificador-inquilino': 'TNT-TEST-0001', 'content-type': 'application/json' }
    const payload = {
      numero: 9999,
      titulo: 'Decidir formato de ejemplo para migración',
      objetivo: 'Asegurar que la migración preserve comportamiento y validaciones',
      decision: 'Se decide usar Hono y mantener compatibilidad con adaptador'
    }

    const crear = await app.request('/api/v1/adrs', { method: 'POST', headers, body: JSON.stringify(payload) })
    const crearBody = await crear.json()
    expect(crear.status).toBe(201)
    expect(crearBody.creado.numero).toBe(payload.numero)

    const list = await app.request('/api/v1/adrs', { headers })
    const lista = await list.json()
    expect(list.status).toBe(200)
    expect(lista.length).toBeGreaterThanOrEqual(1)

    const get = await app.request(`/api/v1/adrs/${crearBody.creado.id}`, { headers })
    const getBody = await get.json()
    expect(get.status).toBe(200)
    expect(getBody.id).toBe(crearBody.creado.id)

    const patch = await app.request(`/api/v1/adrs/${crearBody.creado.id}`, { method: 'PATCH', headers, body: JSON.stringify({ estado: 'APROBADO' }) })
    const patchBody = await patch.json()
    expect(patch.status).toBe(200)
    expect(patchBody.estado).toBe('APROBADO')

    const del = await app.request(`/api/v1/adrs/${crearBody.creado.id}`, { method: 'DELETE', headers })
    expect(del.status).toBe(204)

    const getAfter = await app.request(`/api/v1/adrs/${crearBody.creado.id}`, { headers })
    expect(getAfter.status).toBe(404)
  })
})
