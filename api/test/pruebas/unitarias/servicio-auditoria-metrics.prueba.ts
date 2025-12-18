import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { withTempAudit } from '../../helpers/auditoria'

describe('metrics agregadas de pre-validacion', () => {
  it('produce contadores por tipo y hayIngles', async () => {
    await withTempAudit(async (logfile) => {
      const mod = await import('../../../src/nucleo/servicios/servicio-auditoria-prevalidacion')
      const { registrarEvento, metricsText, leerEventos } = mod

      // limpiar archivo si existe
      try { await fs.promises.unlink(logfile) } catch (_e) {}

      await registrarEvento({ nombre: 'a', tipo: 'glosario', valido: false, hayIngles: true, propuesta: 'p' })
      await registrarEvento({ nombre: 'b', tipo: 'glosario', valido: false, hayIngles: false, propuesta: 'p' })
      await registrarEvento({ nombre: 'c', tipo: 'adr', valido: false, hayIngles: true, propuesta: 'p' })

      const txt = await metricsText()()
      expect(txt).toContain('titan_prevalidacion_propuestas_total{tipo="glosario",hayIngles="true"} 1')
      expect(txt).toContain('titan_prevalidacion_propuestas_total{tipo="glosario",hayIngles="false"} 1')
      expect(txt).toContain('titan_prevalidacion_propuestas_total{tipo="adr",hayIngles="true"} 1')
    })
  })
})
