import { describe, it, expect, beforeEach } from 'vitest'
import { withTempAudit } from '@test/helpers/auditoria'

describe('API Auditoria PreValidacion (Hono)', () => {
  const headers = { authorization: 'Bearer token-usuario-prueba', 'x-identificador-inquilino': 'TNT-TEST-0001' }
  let app: any

  beforeEach(async () => {
    const servidor = await import('@infraestructura/servidor/servidor-hono')
    app = servidor.default
    const { _resetRateLimitForTests } = await import('@nucleo/middleware/hono/middleware-rate-limit-inquilino')
    _resetRateLimitForTests()
  })

  it('devuelve eventos después de validar nombre', async () => {
    await withTempAudit(async () => {
      const { validarYRegistrarNombre } = await import('@nucleo/servicios/servicio-validacion-creacion')

      const nombre = `test-api-${Date.now()}`
      await validarYRegistrarNombre(nombre, 'glosario')

      const res = await app.request('/api/v1/auditoria/prevalidacion?limit=5', { headers })
      const body = await res.json()
      expect(res.status).toBe(200)
      expect(body).toHaveProperty('count')
      expect(body).toHaveProperty('eventos')
      expect(Array.isArray(body.eventos)).toBe(true)
    })
  })
})
