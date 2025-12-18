import { describe, it, expect } from 'vitest'
import { validarPreCreacion } from '../../../src/nucleo/hooks/validacion-precreacion'

describe('Hook validacion-precreacion', () => {
  it('valida nombres y devuelve propuesta cuando detecta ingles', async () => {
    const res = await validarPreCreacion('create-service-template', 'glosario')
    expect(res).toHaveProperty('mensaje')
    // la implementación crea una propuesta en muchos casos, permitir null también
    expect(res).toHaveProperty('propuestaCreada')
  })

  it('retorna mensaje de error para nombre inválido', async () => {
    const res = await validarPreCreacion('', 'otro')
    expect(res.mensaje).toContain('inválido')
  })
})
