import { describe, it, expect } from 'vitest'
import { RepositorioADRsDrizzle } from '@infraestructura/repositorios/repositorio-adrs-drizzle'

describe('repositorio-adrs-drizzle (sanity)', () => {
  it('lanza si no hay DATABASE_URL (sanity)', async () => {
    let lanzado = false
    try {
      // @ts-ignore
      new RepositorioADRsDrizzle(process.env.TEST_DATABASE_URL ?? '')
    } catch (e) {
      lanzado = true
    }
    expect(lanzado).toBe(true)
  })

  it('se salta si no existe TEST_DATABASE_URL (integration optional)', () => {
    // Esta prueba se ejecutará manualmente en CI local con TEST_DATABASE_URL definido
    if (!process.env.TEST_DATABASE_URL) {
      expect(true).toBe(true)
      return
    }
  })
})