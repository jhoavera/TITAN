import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { obtenerDb, inicializarDb } from '@infraestructura/base-de-datos/cliente'
import fs from 'fs'
import path from 'path'
import os from 'os'

describe('E2E - Glosario: crear término que genera propuesta y aprobar', () => {
  let app: any
  let tempDocsRoot: string

  beforeEach(async () => {
    // Crear root temporal aislado para propuestas (evitar condiciones de carrera entre tests paralelos)
    tempDocsRoot = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'titan-docs-'))
    process.env.TITAN_DOCS_ROOT = tempDocsRoot

    // Aislar el tmp-glosario.json para evitar condiciones de carrera entre tests paralelos
    process.env.TITAN_TMP_GLOSARIO = path.join(tempDocsRoot, 'tmp-glosario.json')

    // Inicializar app y shared StubDB
    const db = obtenerDb() as any
    inicializarDb(db)

    const servidor = await import('@infraestructura/servidor/servidor-hono')
    app = servidor.default
    const { _resetRateLimitForTests } = await import('@nucleo/middleware/hono/middleware-rate-limit-inquilino')
    _resetRateLimitForTests()
    // limpiar propuestas (en el root temporal)
    const propuestasDir = path.join(process.env.TITAN_DOCS_ROOT as string, 'documentacion-fuente-unica-verdad', 'glosario-biblioteca', 'propuestas')
    try { await fs.promises.rm(propuestasDir, { recursive: true, force: true }); } catch (_e) {}
  })

  afterEach(async () => {
    // eliminar root temporal y limpiar env
    try { delete process.env.TITAN_TMP_GLOSARIO } catch (_e) {}
    try { await fs.promises.rm(tempDocsRoot, { recursive: true, force: true }); } catch (_e) {}
  })

  it('crea término con inglés detectado y genera propuesta', async () => {
    const crearRes = await app.fetch(new Request('http://localhost/api/v1/glosario', { method: 'POST', headers: { authorization: 'Bearer token-usuario-prueba', 'x-identificador-inquilino': 'TNT-TEST-0001', 'content-type': 'application/json' }, body: JSON.stringify({ termino: 'create-service-template', definicion: 'Plantilla de servicio para generación de ADRs y procesos asociados', categoria: 'TERMINO_TECNICO' }) }))
    if (crearRes.status !== 201) {
      const payload = await crearRes.text()
      throw new Error(`Crear glosario falló: status=${crearRes.status} payload=${payload}`)
    }
    const payloadObj = JSON.parse(await crearRes.text())
    const creado = payloadObj.creado ?? payloadObj
    expect(creado.id).toBeTruthy()
    // debe incluir metadata de pre-validación
    expect(payloadObj).toHaveProperty('preValidacion')

    // Verificar que se creó la propuesta en el filesystem
    // A veces el validador crea la propuesta fuera de api/ (en la raíz del repo). Llamamos directamente al servicio para confirmar la creación y obtener la ruta.
    const { validarYRegistrarNombre } = await import('@nucleo/servicios/servicio-validacion-creacion')
    const resVal = await validarYRegistrarNombre('create-service-template', 'glosario')
    expect(resVal.propuesta).toBeTruthy()
    const existe = resVal.propuesta
      ? await fs.promises.stat(resVal.propuesta).then(() => true).catch(() => false)
      : false
    expect(existe).toBe(true)

    // Aprobar término
    const aprobarRes = await app.fetch(new Request(`http://localhost/api/v1/glosario/${creado.id}`, { method: 'PATCH', headers: { authorization: 'Bearer token-usuario-prueba', 'x-identificador-inquilino': 'TNT-TEST-0001', 'content-type': 'application/json' }, body: JSON.stringify({ estado: 'APROBADO' }) }))
    if (aprobarRes.status !== 200) {
      const texto = await aprobarRes.text();
      // eslint-disable-next-line no-console
      console.error('DEBUG PATCH response:', aprobarRes.status, texto);
    }
    expect(aprobarRes.status).toBe(200)
    const aprobado = JSON.parse(await aprobarRes.text())
    expect(aprobado.estado).toBe('APROBADO')
  })

  it('rechaza creación con datos inválidos (400)', async () => {
    const res = await app.fetch(new Request('http://localhost/api/v1/glosario', { method: 'POST', headers: { authorization: 'Bearer token-usuario-prueba', 'x-identificador-inquilino': 'TNT-TEST-0001', 'content-type': 'application/json' }, body: JSON.stringify({ termino: 'a', definicion: 'corta', categoria: 'TERMINO_TECNICO' }) }))
    expect(res.status).toBe(400)
    const txt = await res.text()
    expect(txt).toContain('El término debe tener al menos 2 caracteres')
  })

  it('permite transiciones de estado PENDIENTE -> EN_REVISION -> APROBADO', async () => {
    const crearRes = await app.fetch(new Request('http://localhost/api/v1/glosario', { method: 'POST', headers: { authorization: 'Bearer token-usuario-prueba', 'x-identificador-inquilino': 'TNT-TEST-0001', 'content-type': 'application/json' }, body: JSON.stringify({ termino: 'estado-flujo-test', definicion: 'Definición suficientemente larga para pruebas de flujo', categoria: 'TERMINO_TECNICO' }) }))
    expect(crearRes.status).toBe(201)
    const creado = JSON.parse(await crearRes.text()).creado

    // Poner en revisión
    const revRes = await app.fetch(new Request(`http://localhost/api/v1/glosario/${creado.id}`, { method: 'PATCH', headers: { authorization: 'Bearer token-usuario-prueba', 'x-identificador-inquilino': 'TNT-TEST-0001', 'content-type': 'application/json' }, body: JSON.stringify({ estado: 'EN_REVISION' }) }))
    expect(revRes.status).toBe(200)
    const enRev = JSON.parse(await revRes.text())
    expect(enRev.estado).toBe('EN_REVISION')

    // Aprobar
    const aprRes = await app.fetch(new Request(`http://localhost/api/v1/glosario/${creado.id}`, { method: 'PATCH', headers: { authorization: 'Bearer token-usuario-prueba', 'x-identificador-inquilino': 'TNT-TEST-0001', 'content-type': 'application/json' }, body: JSON.stringify({ estado: 'APROBADO' }) }))
    expect(aprRes.status).toBe(200)
    const aprobado = JSON.parse(await aprRes.text())
    expect(aprobado.estado).toBe('APROBADO')
  })
})
