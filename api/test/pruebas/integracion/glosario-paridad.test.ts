import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import path from 'path' 

describe('Migración Glosario: paridad Fastify <-> Hono', () => {
  const tmpFile = path.join(process.cwd(), `tmp-glosario-${Date.now()}-${Math.random().toString(36).slice(2,6)}.json`)
  // ensure ServicioGlosario uses an isolated tmp per test
  process.env.TITAN_TMP_GLOSARIO = tmpFile
  let honoApp: any
  let fastifyApp: any

  beforeEach(async () => {
    delete process.env.DATABASE_URL
    try { await fs.promises.rm(tmpFile, { force: true }) } catch (_) {}

    // importar servidor Hono ya preparado
    const servidor = await import('../../../src/infraestructura/servidor/servidor-hono')
    honoApp = servidor.default

    // levantar instancia Fastify y registrar rutas legacy
    const { crearFastifyCompat } = await import('../../helpers/fastify-compat')
    fastifyApp = crearFastifyCompat()
    const rutaGlosario = await import('../../../src/infraestructura/servidor/rutas/glosario')
    await rutaGlosario.default(fastifyApp)
  })

  afterEach(async () => {
    try { await fs.promises.rm(tmpFile, { force: true }) } catch (_) {}
    if (honoApp && typeof honoApp.close === 'function') await honoApp.close()
    if (fastifyApp && typeof fastifyApp.close === 'function') await fastifyApp.close()
  })

  it('Parity: CRUD responses should match between Fastify and Hono', async () => {
    // Crear
    const payload = { termino: 'paridad-test', definicion: 'Definición para prueba de paridad que excede 20 caracteres', categoria: 'TERMINO_TECNICO' }

    const reqFastifyCreate = await fastifyApp.inject({ method: 'POST', url: '/api/v1/glosario', headers: { authorization: 'Bearer t' }, payload })
    const reqHonoCreate = await honoApp.fetch(new Request('http://localhost/api/v1/glosario', { method: 'POST', headers: { authorization: 'Bearer t', 'content-type': 'application/json' }, body: JSON.stringify(payload) }))

    expect(reqFastifyCreate.statusCode).toBe(201)
    expect(reqHonoCreate.status).toBe(201)

    const creadoFast = JSON.parse(reqFastifyCreate.body).creado
    const creadoHono = JSON.parse(await reqHonoCreate.text()).creado
    expect(creadoFast.id).toBeTruthy()
    expect(creadoHono.id).toBeTruthy()

    // Listar
    const listFast = await fastifyApp.inject({ method: 'GET', url: '/api/v1/glosario' })
    const listHono = await honoApp.fetch(new Request('http://localhost/api/v1/glosario'))
    expect(listFast.statusCode).toBe(200)
    expect(listHono.status).toBe(200)
    const listFastJson = JSON.parse(listFast.body)
    const listHonoJson = JSON.parse(await listHono.text())
    // ambos deben contener el id creado
    expect(listFastJson.find((t: any) => t.id === creadoFast.id)).toBeTruthy()
    expect(listHonoJson.find((t: any) => t.id === creadoHono.id)).toBeTruthy()

    // Obtener por id (usar id de Hono)
    const getFast = await fastifyApp.inject({ method: 'GET', url: `/api/v1/glosario/${creadoFast.id}` })
    const getHono = await honoApp.fetch(new Request(`http://localhost/api/v1/glosario/${creadoHono.id}`))
    expect(getFast.statusCode).toBe(200)
    expect(getHono.status).toBe(200)
    expect(JSON.parse(getFast.body).id).toBe(creadoFast.id)
    expect(JSON.parse(await getHono.text()).id).toBe(creadoHono.id)

    // Actualizar
    const patchPayload = { estado: 'APROBADO' }
    const patchFast = await fastifyApp.inject({ method: 'PATCH', url: `/api/v1/glosario/${creadoFast.id}`, headers: { authorization: 'Bearer t' }, payload: patchPayload })
    const patchHono = await honoApp.fetch(new Request(`http://localhost/api/v1/glosario/${creadoHono.id}`, { method: 'PATCH', headers: { authorization: 'Bearer t', 'content-type': 'application/json' }, body: JSON.stringify(patchPayload) }))
    expect(patchFast.statusCode).toBe(200)
    expect(patchHono.status).toBe(200)
    expect(JSON.parse(patchFast.body).estado).toBe('APROBADO')
    expect(JSON.parse(await patchHono.text()).estado).toBe('APROBADO')

    // Eliminar
    const delFast = await fastifyApp.inject({ method: 'DELETE', url: `/api/v1/glosario/${creadoFast.id}`, headers: { authorization: 'Bearer t' } })
    const delHono = await honoApp.fetch(new Request(`http://localhost/api/v1/glosario/${creadoHono.id}`, { method: 'DELETE', headers: { authorization: 'Bearer t' } }))
    expect(delFast.statusCode).toBe(204)
    expect(delHono.status).toBe(204)

    // Verificar 404
    const getAfterFast = await fastifyApp.inject({ method: 'GET', url: `/api/v1/glosario/${creadoFast.id}` })
    const getAfterHono = await honoApp.fetch(new Request(`http://localhost/api/v1/glosario/${creadoHono.id}`))
    expect(getAfterFast.statusCode).toBe(404)
    expect(getAfterHono.status).toBe(404)
  })
})
