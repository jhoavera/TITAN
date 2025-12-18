import { describe, it, expect, beforeEach } from 'vitest'
import * as repo from '@infraestructura/repositorios/repositorio-glosario'
import { obtenerDb } from '@infraestructura/base-de-datos/cliente'

describe('repositorio-glosario - concurrencia y duplicados (unit)', () => {
  beforeEach(() => {
    const db = obtenerDb() as any
    db.store = {}
    db.lastId = 0
  })

  it('gestiona intentos concurrentes de creación de términos idénticos', async () => {
    const db = obtenerDb() as any
    const datos = { termino: 'concurrente', definicion: 'def concurrente', categoria: 'TERMINO_TECNICO' }

    // Lanzar dos creaciones en paralelo
    const p1 = repo.crearGlosario(db, datos as any, 'TNT-TEST', 'autor-1')
    const p2 = repo.crearGlosario(db, datos as any, 'TNT-TEST', 'autor-2')

    const results = await Promise.allSettled([p1, p2])
    const fulfilled = results.filter(r => r.status === 'fulfilled')
    const rejected = results.filter(r => r.status === 'rejected')

    // Debe haber exactamente 1 éxito y 1 fallo por unique constraint
    expect(fulfilled.length).toBe(1)
    expect(rejected.length).toBe(1)
    // Verificar que la excepción simula violation única
    const rejReason = (rejected[0] as PromiseRejectedResult).reason as Error
    expect(rejReason.message).toContain('unique_violation')
  })
})