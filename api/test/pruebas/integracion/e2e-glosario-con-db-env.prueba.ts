import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { obtenerDb } from '@infraestructura/base-de-datos/cliente'

describe('E2E - Glosario (ruta con DATABASE_URL presente) - Hono', () => {
  let app: any
  const OLD = process.env.DATABASE_URL

  beforeEach(async () => {
    process.env.DATABASE_URL = process.env.DATABASE_URL ?? 'postgres://test'
    const db: any = obtenerDb()
    db.store = {}
    db.lastId = 0

    const servidor = await import('@infraestructura/servidor/servidor-hono')
    app = servidor.default
    const { _resetRateLimitForTests } = await import('@nucleo/middleware/hono/middleware-rate-limit-inquilino')
    _resetRateLimitForTests()
  })

  afterEach(async () => {
    if (OLD) process.env.DATABASE_URL = OLD
    else delete process.env.DATABASE_URL
  })

  it('usa el camino del repositorio cuando se detecta DATABASE_URL (inserta y devuelve 201)', async () => {
    const crearRes = await app.request('/api/v1/glosario', {
      method: 'POST',
      headers: {
        authorization: 'Bearer token-usuario-prueba',
        'content-type': 'application/json',
        'x-identificador-inquilino': 'TNT-TEST-0001'
      },
      body: JSON.stringify({ termino: 'termino-db', definicion: 'Definición para DB con detalle suficiente para pruebas E2E', categoria: 'TERMINO_TECNICO' })
    })
    const body = await crearRes.json()
    expect(crearRes.status).toBe(201)
    expect(body.creado).toBeTruthy()
    expect(body.creado.id).toBeTruthy()
  })
})