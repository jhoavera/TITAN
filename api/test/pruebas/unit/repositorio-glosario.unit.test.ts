import { describe, it, expect, beforeEach } from 'vitest'
import { obtenerDb, inicializarDb } from '@infraestructura/base-de-datos/cliente'
import * as repo from '@infraestructura/repositorios/repositorio-glosario'

describe('repositorio-glosario (unit)', () => {
  beforeEach(() => {
    const db = obtenerDb() as any
    inicializarDb(db)
  })

  it('crea, obtiene, actualiza y elimina término de glosario', async () => {
    const db = obtenerDb() as any
    // Crear
    const creado = await repo.crearGlosario(db, { termino: 'pruebaRepo', definicion: 'def prueba', categoria: 'TERM' } as any, 'TNT-TEST', 'autor-test')
    expect(creado).toBeTruthy()
    expect(creado.termino).toBe('pruebaRepo')

    // Listar
    const lista = await repo.obtenerListaGlosario(db, { query: 'prueba' }, 'TNT-TEST')
    const found = lista.find((r: any) => r.termino === 'pruebaRepo')
    expect(found).toBeTruthy()

    // Obtener por id
    const obtenido = await repo.obtenerTerminoPorId(db, creado.id, 'TNT-TEST')
    expect(obtenido).toBeTruthy()
    expect(obtenido.termino).toBe('pruebaRepo')

    // Actualizar
    const actualizado = await repo.actualizarGlosario(db, creado.id, { definicion: 'def actual' } as any, 'TNT-TEST')
    expect(actualizado).toBeTruthy()
    expect(actualizado.definicion).toBe('def actual')

    // Eliminar
    const eliminado = await repo.eliminarGlosario(db, creado.id, 'TNT-TEST')
    expect(eliminado).toBeTruthy()
    const after = await repo.obtenerTerminoPorId(db, creado.id, 'TNT-TEST')
    expect(after).toBeNull()
  })
})