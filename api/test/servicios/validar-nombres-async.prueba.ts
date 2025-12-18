import { describe, it, expect } from 'vitest'
import { validarNombreConGlosario } from '../../src/servicios/validar-nombres'

describe('validar-nombres con glosario (async)', () => {
  it('marca como válido si hay entrada aprobada en glosario', async () => {
    const fakeServicio = {
      async buscar(_termino: string) {
        return [{ id: '1', termino: 'migraciones', definicion: '...', estado: 'aprobado' }]
      },
    }
    const r = await validarNombreConGlosario('migration', fakeServicio as any)
    expect(r.valido).toBe(true)
    expect(r.razones.length).toBe(0)
  })

  it('sigue rechazando si no hay entrada aprobada', async () => {
    const fakeServicio = {
      async buscar(_termino: string) {
        return [{ id: '1', termino: 'migraciones', definicion: '...', estado: 'pendiente' }]
      },
    }
    const r = await validarNombreConGlosario('migration', fakeServicio as any)
    expect(r.valido).toBe(false)
  })
})
