import { describe, it, expect, beforeEach } from 'vitest'
import { obtenerDb, inicializarDb } from '../../../src/infraestructura/base-de-datos/cliente'
import * as repo from '../../../src/infraestructura/repositorios/repositorio-glosario'

describe('repositorio-glosario - duplicados (unit)', () => {
  beforeEach(() => {
    const db = obtenerDb() as any
    inicializarDb(db)
  })

  it('no permite insertar término duplicado por inquilino (error esperado)', async () => {
    const db = obtenerDb() as any
    const datos = { termino: 'duplicado', definicion: 'Definición suficientemente larga para prueba', categoria: 'TERMINO_TECNICO' } as any
    const creado = await repo.crearGlosario(db, datos, 'TNT-TEST', 'autor-test')
    expect(creado).toBeTruthy()

    let thrown = false
    try {
      await repo.crearGlosario(db, datos, 'TNT-TEST', 'autor-test')
    } catch (err: any) {
      thrown = true
      // Debe indicar conflicto por constraint única o similar
      expect(err).toBeDefined()
    }
    expect(thrown).toBe(true)
  })
})