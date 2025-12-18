import { describe, it, expect } from 'vitest'
const { crearFastifyCompat } = await import('../../helpers/fastify-compat')
import fs from 'fs'
import path from 'path'
import os from 'os'
import { withTempAudit } from '../../helpers/auditoria'

describe('API Auditoria PreValidacion', () => {
  it('devuelve eventos después de validar nombre', async () => {
    await withTempAudit(async (tmpfile) => {
      const rutaAuditoria = (await import('../../../src/infraestructura/servidor/rutas/auditoria')).default
      const { validarYRegistrarNombre } = await import('../../../src/nucleo/servicios/servicio-validacion-creacion')

      const app = crearFastifyCompat()
      await app.register(rutaAuditoria as any)

      // registrar un nombre
      const nombre = `test-api-${Date.now()}`
      await validarYRegistrarNombre(nombre, 'glosario')

      const res = await app.inject({ method: 'GET', url: '/api/v1/auditoria/prevalidacion?limit=5' })
      if (res.statusCode !== 200) console.error('AUDIT ERROR BODY:', res.body)
      expect(res.statusCode).toBe(200)
      const body = JSON.parse(res.body)
      expect(body).toHaveProperty('count')
      expect(body).toHaveProperty('eventos')
      expect(Array.isArray(body.eventos)).toBe(true)
    })
  })
})
