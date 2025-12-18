import { describe, it, expect, beforeEach, afterEach } from 'vitest'

describe('E2E - Glosario (ruta con DATABASE_URL presente)', () => {
  let app: any
  const OLD = process.env.DATABASE_URL

  beforeEach(async () => {
    process.env.DATABASE_URL = process.env.DATABASE_URL ?? 'postgres://test' // valor falso pero presente

    const { crearFastifyCompat } = await import('../../helpers/fastify-compat')
    app = crearFastifyCompat()
    app.addHook('preHandler', async (request: any) => {
      const auth = request.headers['authorization'] as string
      if (!auth) { request.usuario = null; return }
      const parts = auth.split(' ')
      if (parts[1] === 'token-usuario-prueba') request.usuario = { id: 'USR-PRUEBA-0001' }
    })
    app.addHook('preHandler', async (request: any) => {
      const header = request.headers['x-identificador-inquilino'] as string
      request.identificadorInquilino = header || 'TNT-LOCAL'
    })
    const rutaGlosario = (await import('../../../src/infraestructura/servidor/rutas/glosario')).default
    await app.register(rutaGlosario)
    await app.ready()
  })

  afterEach(async () => {
    if (OLD) process.env.DATABASE_URL = OLD
    else delete process.env.DATABASE_URL
    await app.close()
  })

  it('usa el camino del repositorio cuando se detecta DATABASE_URL (inserta y devuelve 201)', async () => {
    const crearRes = await app.inject({ method: 'POST', url: '/api/v1/glosario', headers: { authorization: 'Bearer token-usuario-prueba' }, payload: { termino: 'termino-db', definicion: 'Definición para DB con detalle suficiente para pruebas E2E', categoria: 'TERMINO_TECNICO' } })
    expect(crearRes.statusCode).toBe(201)
    const creado = JSON.parse(crearRes.payload).creado
    expect(creado).toBeTruthy()
    expect(creado.id).toBeTruthy()
  })
})