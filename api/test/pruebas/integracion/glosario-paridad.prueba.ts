import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('Glosario Hono CRUD', () => {
  const tmpFile = path.join(process.cwd(), `tmp-glosario-${Date.now()}-${Math.random().toString(36).slice(2, 6)}.json`)
  let app: any

  beforeEach(async () => {
    delete process.env.DATABASE_URL
    process.env.TITAN_TMP_GLOSARIO = tmpFile
    try { await fs.promises.rm(tmpFile, { force: true }) } catch (_) {}
    const servidor = await import('@infraestructura/servidor/servidor-hono')
    app = servidor.default
    const { _resetRateLimitForTests } = await import('@nucleo/middleware/hono/middleware-rate-limit-inquilino')
    _resetRateLimitForTests()
  })

  afterEach(async () => {
    try { await fs.promises.rm(tmpFile, { force: true }) } catch (_) {}
    delete process.env.TITAN_TMP_GLOSARIO
  })

  it('ejecuta CRUD completo en almacenamiento local', async () => {
    const headers = {
      authorization: 'Bearer token-usuario-prueba',
      'x-identificador-inquilino': 'TNT-TEST-0001',
      'content-type': 'application/json'
    }

    const crearRes = await app.request('/api/v1/glosario', {
      method: 'POST',
      headers,
      body: JSON.stringify({ termino: 'paridad-test', definicion: 'Definición suficientemente larga para pasar validación en entorno de pruebas', categoria: 'TERMINO_TECNICO' })
    })
    const crearBody = await crearRes.json()
    expect(crearRes.status).toBe(201)
    expect(crearBody.creado.id).toBeTruthy()

    const listRes = await app.request('/api/v1/glosario', { headers })
    const lista = await listRes.json()
    expect(listRes.status).toBe(200)
    expect(lista.find((t: any) => t.id === crearBody.creado.id)).toBeTruthy()

    const getRes = await app.request(`/api/v1/glosario/${crearBody.creado.id}`, { headers })
    const getBody = await getRes.json()
    expect(getRes.status).toBe(200)
    expect(getBody.id).toBe(crearBody.creado.id)

    const patchRes = await app.request(`/api/v1/glosario/${crearBody.creado.id}`, {
      method: 'PATCH',
      headers,
      body: JSON.stringify({ estado: 'APROBADO' })
    })
    const patchBody = await patchRes.json()
    expect(patchRes.status).toBe(200)
    expect(patchBody.estado).toBe('APROBADO')

    const delRes = await app.request(`/api/v1/glosario/${crearBody.creado.id}`, { method: 'DELETE', headers })
    expect(delRes.status).toBe(204)

    const getAfter = await app.request(`/api/v1/glosario/${crearBody.creado.id}`, { headers })
    expect(getAfter.status).toBe(404)
  })
})
