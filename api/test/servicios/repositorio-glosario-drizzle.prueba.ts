import { describe, it, expect } from 'vitest'
import { RepositorioGlosarioDrizzle } from '@infraestructura/repositorios/repositorio-glosario-drizzle'

describe('repositorio-glosario-drizzle (sanity)', () => {
  it('salta si no hay DATABASE_URL (sanity)', async () => {
    // Si no hay DATABASE_URL, construir la instancia debe lanzar
    let lanzado = false
    try {
      // @ts-ignore
      new RepositorioGlosarioDrizzle(process.env.TEST_DATABASE_URL ?? '')
    } catch (e) {
      lanzado = true
    }
    expect(lanzado).toBe(true)
  })
})
