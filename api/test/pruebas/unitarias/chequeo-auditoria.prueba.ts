import { describe, it, expect, beforeEach } from 'vitest'
import { hayTriggersAuditoria, limpiarCacheChequeoAuditoria } from '@infraestructura/base-de-datos/utilidades/chequeo-auditoria'

describe('Chequeo de triggers de auditoría', () => {
  beforeEach(() => limpiarCacheChequeoAuditoria())

  it('devuelve true cuando la consulta indica presencia de funciones/triggers', async () => {
    const db = {
      query: async () => [{ funciones: '1', triggers: '2' }]
    } as any
    const res = await hayTriggersAuditoria(db)
    expect(res).toBe(true)
  })

  it('devuelve false cuando no hay funciones ni triggers', async () => {
    const db = { query: async () => [{ funciones: '0', triggers: '0' }] } as any
    const res = await hayTriggersAuditoria(db)
    expect(res).toBe(false)
  })

  it('cachea el resultado entre llamadas', async () => {
    let contador = 0
    const db = {
      query: async () => { contador++; return [{ funciones: '0', triggers: '0' }] }
    } as any
    const r1 = await hayTriggersAuditoria(db)
    const r2 = await hayTriggersAuditoria(db)
    expect(r1).toBe(false)
    expect(r2).toBe(false)
    expect(contador).toBe(1) // solo una llamada al DB
  })
})
