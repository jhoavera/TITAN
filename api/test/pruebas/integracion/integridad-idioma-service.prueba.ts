import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { withTempAudit } from '@test/helpers/auditoria'

describe('servicio integridad idioma (integracion minimal)', () => {
  it('detecta término en inglés y registra eventos', async () => {
    const dir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'titan-int-'))
    // crear archivo con nombre que contiene 'migraciones'
    await fs.promises.writeFile(path.join(dir, 'migrations_dummy.txt'), 'contenido', 'utf8')

    await withTempAudit(async (tmpLog) => {
      const mod = await import('@scripts/servicios/integridad-idioma')
      const res = await mod.runIntegridadIdioma(dir)
      expect(res.hallazgos.length).toBeGreaterThanOrEqual(1)

      // comprobar que auditoria tiene registros
      const exists = await fs.promises.stat(tmpLog).then(() => true).catch(() => false)
      expect(exists).toBe(true)
    })

    // cleanup
    await fs.promises.rm(dir, { recursive: true, force: true })
  })
})
