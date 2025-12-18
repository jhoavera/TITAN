import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import path from 'path'
import fs from 'fs'
import { obtenerDb } from '../../../src/infraestructura/base-de-datos/cliente'

describe('Migración Auditoría DB: paridad Fastify <-> Hono', () => {
  let honoApp: any
  let fastifyApp: any

  beforeEach(async () => {
    // Resetear stub DB para pruebas aisladas
    const db: any = obtenerDb()
    db.store = {}
    db.lastId = 0

    const servidor = await import('../../../src/infraestructura/servidor/servidor-hono')
    honoApp = servidor.default

    const { crearFastifyCompat } = await import('../../helpers/fastify-compat')
    fastifyApp = crearFastifyCompat()
    const rutaADRs = await import('../../../src/infraestructura/servidor/rutas/adrs')
    await fastifyApp.register(rutaADRs.default as any)
  })

  afterEach(async () => {
    if (honoApp && typeof honoApp.close === 'function') await honoApp.close()
    if (fastifyApp && typeof fastifyApp.close === 'function') await fastifyApp.close()
  })

  it('Parity: crear ADR via Fastify y Hono genera entradas en auditoria_cambios', async () => {
    const payload = {
      numero: 8888,
      titulo: 'Prueba auditoria DB crear ADR',
      objetivo: 'Verificar inserción auditoría',
      decision: 'Se prueba logging de auditoría'
    }

    const headers = { authorization: 'Bearer t', 'x-identificador-inquilino': 'TNT-TEST-0001' }

    // Crear via Fastify
    const reqFast = await fastifyApp.inject({ method: 'POST', url: '/api/v1/adrs', headers, payload })
    expect(reqFast.statusCode).toBe(201)

    // Crear via Hono
    const reqHono = await honoApp.fetch(new Request('http://localhost/api/v1/adrs', { method: 'POST', headers: { ...headers, 'content-type': 'application/json' }, body: JSON.stringify(payload) }))
    expect(reqHono.status).toBe(201)

    const db: any = obtenerDb()
    const rows = Object.values(db.store)
    // Buscar filas de auditoría (tienen campo 'entidad')
    const auditorias = rows.filter((r: any) => typeof r.entidad === 'string')
    expect(auditorias.length).toBeGreaterThanOrEqual(2)
    // Asegurarse que alguno tenga operacion 'CREAR'
    expect(auditorias.some((a: any) => a.operacion === 'CREAR')).toBe(true)
  })

  it('Parity: eliminar ADR genera entrada de auditoría ELIMINAR', async () => {
    const payload = {
      numero: 7777,
      titulo: 'Prueba auditoria DB eliminar ADR',
      objetivo: 'Verificar inserción auditoría eliminar',
      decision: 'Se prueba logging de auditoría en eliminación'
    }

    const headers = { authorization: 'Bearer t', 'x-identificador-inquilino': 'TNT-TEST-0001' }

    // Crear via Fastify
    const reqFast = await fastifyApp.inject({ method: 'POST', url: '/api/v1/adrs', headers, payload })
    expect(reqFast.statusCode).toBe(201)
    const creadoFast = JSON.parse(reqFast.body).creado

    // Eliminar via Hono
    const delHono = await honoApp.fetch(new Request(`http://localhost/api/v1/adrs/${creadoFast.id}`, { method: 'DELETE', headers }))
    expect(delHono.status).toBe(204)

    const db: any = obtenerDb()
    const rows = Object.values(db.store)
    const auditoriasEliminar = rows.filter((r: any) => r.operacion === 'ELIMINAR')
    expect(auditoriasEliminar.length).toBeGreaterThanOrEqual(1)
    expect(auditoriasEliminar.some((a: any) => a.entidad === 'adrs')).toBe(true)
  })
})
