import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { obtenerDb, inicializarDb } from '../../../src/infraestructura/base-de-datos/cliente'
import fs from 'fs'
import path from 'path'
import os from 'os'

describe('E2E - Glosario: búsqueda, paginación y caracteres Unicode', () => {
  let app: any
  let tempDocsRoot: string

  beforeEach(async () => {
    tempDocsRoot = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'titan-docs-'))
    process.env.TITAN_DOCS_ROOT = tempDocsRoot
    process.env.TITAN_TMP_GLOSARIO = path.join(tempDocsRoot, 'tmp-glosario.json')

    const db = obtenerDb() as any
    // reset stub store
    db.store = {}
    db.lastId = 0
    inicializarDb(db)

    const servidor = await import('../../../src/infraestructura/servidor/servidor-hono')
    app = servidor.default
  })

  afterEach(async () => {
    try { delete process.env.TITAN_TMP_GLOSARIO } catch (_e) {}
    try { await fs.promises.rm(tempDocsRoot, { recursive: true, force: true }); } catch (_e) {}
  })

  it('permite buscar por texto y filtrar por estado', async () => {
    // crear varios términos
    const crear = async (termino: string, estado?: string) => {
      const res = await app.fetch(new Request('http://localhost/api/v1/glosario', { method: 'POST', headers: { authorization: 'Bearer token-usuario-prueba', 'x-identificador-inquilino': 'TNT-TEST-0001', 'content-type': 'application/json' }, body: JSON.stringify({ termino, definicion: 'Definición suficientemente larga para pruebas automatizadas', categoria: 'TERMINO_TECNICO' }) }))
      expect(res.status).toBe(201)
      const payload = JSON.parse(await res.text())
      const creado = payload.creado ?? payload
      if (estado) {
        const p = await app.fetch(new Request(`http://localhost/api/v1/glosario/${creado.id}`, { method: 'PATCH', headers: { authorization: 'Bearer token-usuario-prueba', 'x-identificador-inquilino': 'TNT-TEST-0001', 'content-type': 'application/json' }, body: JSON.stringify({ estado }) }))
        expect(p.status).toBe(200)
      }
      return creado
    }

    await crear('buscar-uno', 'APROBADO')
    await crear('buscar-dos')
    await crear('otro')

    // búsqueda simple
    const listRes = await app.fetch(new Request('http://localhost/api/v1/glosario?query=buscar'))
    expect(listRes.status).toBe(200)
    const list = JSON.parse(await listRes.text())
    expect(Array.isArray(list)).toBe(true)
    expect(list.length).toBeGreaterThanOrEqual(2)

    // filtrar por estado APROBADO
    const filRes = await app.fetch(new Request('http://localhost/api/v1/glosario?estado=APROBADO'))
    expect(filRes.status).toBe(200)
    const filtered = JSON.parse(await filRes.text())
    expect(filtered.every((t: any) => t.estado === 'APROBADO')).toBe(true)
  })

  it('soporta paginación con limit/offset', async () => {
    // crear 4 términos
    await app.fetch(new Request('http://localhost/api/v1/glosario', { method: 'POST', headers: { authorization: 'Bearer token-usuario-prueba', 'x-identificador-inquilino': 'TNT-TEST-0001', 'content-type': 'application/json' }, body: JSON.stringify({ termino: 'p1', definicion: 'Definición suficientemente larga para pruebas automatizadas', categoria: 'TERMINO_TECNICO' }) }))
    await app.fetch(new Request('http://localhost/api/v1/glosario', { method: 'POST', headers: { authorization: 'Bearer token-usuario-prueba', 'x-identificador-inquilino': 'TNT-TEST-0001', 'content-type': 'application/json' }, body: JSON.stringify({ termino: 'p2', definicion: 'Definición suficientemente larga para pruebas automatizadas', categoria: 'TERMINO_TECNICO' }) }))
    await app.fetch(new Request('http://localhost/api/v1/glosario', { method: 'POST', headers: { authorization: 'Bearer token-usuario-prueba', 'x-identificador-inquilino': 'TNT-TEST-0001', 'content-type': 'application/json' }, body: JSON.stringify({ termino: 'p3', definicion: 'Definición suficientemente larga para pruebas automatizadas', categoria: 'TERMINO_TECNICO' }) }))
    await app.fetch(new Request('http://localhost/api/v1/glosario', { method: 'POST', headers: { authorization: 'Bearer token-usuario-prueba', 'x-identificador-inquilino': 'TNT-TEST-0001', 'content-type': 'application/json' }, body: JSON.stringify({ termino: 'p4', definicion: 'Definición suficientemente larga para pruebas automatizadas', categoria: 'TERMINO_TECNICO' }) }))

    const res1 = await app.fetch(new Request('http://localhost/api/v1/glosario?limit=2&offset=0'))
    expect(res1.status).toBe(200)
    const page1 = JSON.parse(await res1.text())
    expect(page1.length).toBe(2)

    const res2 = await app.fetch(new Request('http://localhost/api/v1/glosario?limit=2&offset=2'))
    expect(res2.status).toBe(200)
    const page2 = JSON.parse(await res2.text())
    expect(page2.length).toBe(2)

    // Asegurar que no hay duplicados entre páginas
    const ids = new Set([...page1.map((x: any) => x.id), ...page2.map((x: any) => x.id)])
    expect(ids.size).toBe(4)
  })

  it('normaliza y busca términos con caracteres no ASCII', async () => {
    const crearRes = await app.fetch(new Request('http://localhost/api/v1/glosario', { method: 'POST', headers: { authorization: 'Bearer token-usuario-prueba', 'x-identificador-inquilino': 'TNT-TEST-0001', 'content-type': 'application/json' }, body: JSON.stringify({ termino: 'niño', definicion: 'Definición suficientemente larga para pruebas automatizadas', categoria: 'TERMINO_TECNICO' }) }))
    expect(crearRes.status).toBe(201)

    // Buscar con exacto
    const r1 = await app.fetch(new Request('http://localhost/api/v1/glosario?query=niño'))
    expect(r1.status).toBe(200)
    const l1 = JSON.parse(await r1.text())
    expect(l1.length).toBeGreaterThanOrEqual(1)

    // Buscar sin tilde (normalizado)
    const r2 = await app.fetch(new Request('http://localhost/api/v1/glosario?query=nino'))
    expect(r2.status).toBe(200)
    const l2 = JSON.parse(await r2.text())
    expect(l2.length).toBeGreaterThanOrEqual(1)
  })
})
