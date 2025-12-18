import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import path from 'path'

describe('E2E - Glosario (fallback sin DB): CRUD completo', () => {
  const tmpFile = path.join(process.cwd(), 'tmp-glosario.json')
  let app: any

  async function requestApp(method: string, url: string, headers?: Record<string,string>, payload?: unknown) {
    const body = payload ? JSON.stringify(payload) : undefined;
    const req = new Request(`http://localhost${url}`, { method, headers: headers ?? {}, body });
    if (typeof app.fetch === 'function') return app.fetch(req);
    if (typeof app.request === 'function') return app.request(req);
    if (typeof (app as any).handle === 'function') return (app as any).handle(req);
    throw new Error('El servidor de pruebas no expone fetch/request/handle');
  }

  beforeEach(async () => {
    // Asegurar que no hay DATABASE_URL para forzar fallback
    delete process.env.DATABASE_URL
    // limpiar fichero temporal
    try { await fs.promises.rm(tmpFile, { force: true }) } catch (_) {}

    const servidor = await import('../../../src/infraestructura/servidor/servidor-hono')
    app = servidor.default
  })

  afterEach(async () => {
    try { await fs.promises.rm(tmpFile, { force: true }) } catch (_) {}
    if (typeof app.close === 'function') await app.close()
  })

  it('CRUD flujo: crear -> listar -> obtener -> actualizar -> eliminar', async () => {
    // Crear
    const crearRes = await requestApp('POST', '/api/v1/glosario', { authorization: 'Bearer token-usuario-prueba' }, { termino: 'termino-prueba', definicion: 'Definición de prueba con detalle suficiente para pruebas automatizadas', categoria: 'TERMINO_TECNICO' })
    expect(crearRes.status).toBe(201)
    const creado = JSON.parse(await crearRes.text()).creado
    expect(creado.id).toBeTruthy()

    // Listar
    const listRes = await requestApp('GET', '/api/v1/glosario')
    expect(listRes.status).toBe(200)
    const lista = JSON.parse(await listRes.text())
    expect(Array.isArray(lista)).toBe(true)
    expect(lista.find((t: any) => t.id === creado.id)).toBeTruthy()

    // Obtener por id
    const getRes = await requestApp('GET', `/api/v1/glosario/${creado.id}`)
    expect(getRes.status).toBe(200)
    const obtenido = JSON.parse(await getRes.text())
    expect(obtenido.id).toBe(creado.id)

    // Actualizar
    const patchRes = await requestApp('PATCH', `/api/v1/glosario/${creado.id}`, { authorization: 'Bearer token-usuario-prueba' }, { estado: 'APROBADO' })
    expect(patchRes.status).toBe(200)
    const actualizado = JSON.parse(await patchRes.text())
    expect(actualizado.estado).toBe('APROBADO')

    // Eliminar
    const delRes = await requestApp('DELETE', `/api/v1/glosario/${creado.id}`, { authorization: 'Bearer token-usuario-prueba' })
    expect(delRes.status).toBe(204)

    // Verificar eliminado
    const getAfter = await requestApp('GET', `/api/v1/glosario/${creado.id}`)
    expect(getAfter.status).toBe(404)
  })
})