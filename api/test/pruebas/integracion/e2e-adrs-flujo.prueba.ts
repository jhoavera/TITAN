import { describe, it, expect, beforeEach } from 'vitest'
import { crearApp } from '../../../src/infraestructura/servidor/app'
import { obtenerDb, inicializarDb } from '../../../src/infraestructura/base-de-datos/cliente'
import fs from 'fs'

describe('E2E - ADRs: flujo crear → revisar → aprobar (incluye git_ref y auditoría)', () => {
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
    // Inicializar app y shared StubDB
    const db = obtenerDb() as any
    inicializarDb(db)
    const servidor = await import('../../../src/infraestructura/servidor/servidor-hono')
    app = servidor.default
  })

  it('crea, pone en revisión y aprueba (git_ref) y registra auditoría', async () => {
    // Crear ADR
    const crearRes = await requestApp('POST', '/api/v1/adrs', { authorization: 'Bearer token-usuario-prueba', 'x-identificador-inquilino': 'TNT-TEST-0001' }, { numero: 1, titulo: 'Decidir ORM para proyecto', objetivo: 'Elegir ORM que cumpla requisitos multi-inquilino', decision: 'Se propone Drizzle por type-safety y bajo consumo' })
    if (crearRes.status !== 201) {
      const payloadText = await crearRes.text()
      throw new Error(`Crear ADR fallo: status=${crearRes.status} payload=${payloadText}`)
    }
    const payloadObj = JSON.parse(await crearRes.text())
    const creado = payloadObj.creado ?? payloadObj
    expect(creado.id).toBeTruthy()
    expect(payloadObj).toHaveProperty('preValidacion')

    // Poner en revisión
    const revisarRes = await requestApp('PATCH', `/api/v1/adrs/${creado.id}`, { authorization: 'Bearer token-usuario-prueba', 'x-identificador-inquilino': 'TNT-TEST-0001' }, { estado: 'EN_REVISION' })
    expect(revisarRes.status).toBe(200)
    const revisado = JSON.parse(await revisarRes.text())
    expect(revisado.estado).toBe('EN_REVISION')

    // Aprobar con git_ref
    const gitRef = 'refs/heads/main@{2025-12-15}'
    const aprobarRes = await requestApp('PATCH', `/api/v1/adrs/${creado.id}`, { authorization: 'Bearer token-usuario-prueba', 'x-identificador-inquilino': 'TNT-TEST-0001' }, { estado: 'APROBADO', git_ref: gitRef, notas_revision: 'Aprobado por comité' })
    expect(aprobarRes.status).toBe(200)
    const aprobado = JSON.parse(await aprobarRes.text())
    expect(aprobado.estado).toBe('APROBADO')
    expect(aprobado.git_ref).toBeTruthy()

    // Verificar auditoría creada en StubDB compartido
    const db: any = obtenerDb()
    const entries = Object.values(db.store) as any[]
    const auditorias = entries.filter(e => e.entidad === 'adrs' || e.entidad === 'auditoria_cambios' || e.operacion)
    // Debe existir al menos un registro que incluya git_ref en diff o campo git_ref
    const tieneGitRef = auditorias.some(a => (a.git_ref && a.git_ref === gitRef) || (a.diff && JSON.stringify(a.diff).includes(gitRef)))
    expect(tieneGitRef).toBe(true)
  })
})
