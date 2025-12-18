import { describe, it, expect } from 'vitest'
import { esquemaCrearGlosario } from '@nucleo/validadores/validador-glosario'

describe('validadores - Glosario (unit)', () => {
  it('rechaza término demasiado corto', () => {
    expect(() => esquemaCrearGlosario.parse({ termino: 'a', definicion: 'Este es un texto suficientemente largo para pasar la validación', categoria: 'TERMINO_TECNICO' })).toThrow()
  })

  it('rechaza definición demasiado corta', () => {
    expect(() => esquemaCrearGlosario.parse({ termino: 'termino-valido', definicion: 'corta', categoria: 'TERMINO_TECNICO' })).toThrow()
  })

  it('acepta entrada válida', () => {
    const parsed = esquemaCrearGlosario.parse({ termino: 'termino-valido', definicion: 'Esta definición tiene más de veinte caracteres y es válida', categoria: 'TERMINO_TECNICO' })
    expect(parsed.termino).toBe('termino-valido')
    expect(parsed.definicion).toContain('definición') // comprobación simple
  })
})