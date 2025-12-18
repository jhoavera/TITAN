import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { withTempAudit } from '@test/helpers/auditoria'

describe('servicio-auditoria-prevalidacion', () => {
  it('registra y lee eventos', async () => {
    await withTempAudit(async (tmpfile) => {
      const mod = await import('@nucleo/servicios/servicio-auditoria-prevalidacion')
      const { registrarEvento, leerEventos, contarPropuestas } = mod

      const nombre = `test-${Date.now()}`
      const ev = await registrarEvento({ nombre, tipo: 'prueba', valido: false, hayIngles: true, propuesta: 'ruta' })
      expect(ev).toHaveProperty('timestamp')
      const evs = await leerEventos(5)
      expect(evs.length).toBeGreaterThan(0)
      const total = await contarPropuestas()
      expect(total).toBeGreaterThanOrEqual(1)
    })
  })
})
