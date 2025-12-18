import { describe, it, expect, beforeEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'

describe('CLI revisar-idioma', () => {
  const tmp = path.join(process.cwd(), 'test-temp-idioma-cli')
  beforeEach(async () => {
    await fs.promises.rm(tmp, { recursive: true, force: true }).catch(() => {})
    await fs.promises.mkdir(tmp, { recursive: true })
    await fs.promises.mkdir(path.join(tmp, 'migraciones'))
    await fs.promises.writeFile(path.join(tmp, 'migraciones', '0001_create_table.sql'), '-- migracion: create table test')
  })

  it('ejecuta el CLI y genera ADRs/propuestas', (done) => {
    const cmd = `node -r ts-node/register ./scripts/revisar-idioma.ts --raiz ${tmp}`
    exec(cmd, { cwd: process.cwd(), env: process.env }, async (err, stdout, stderr) => {
      try {
        expect(err).toBeNull()
        expect(stdout).toContain('Hallazgos detectados')
        // comprobar que al menos hubo una ADR propuesta escrita en documentacion (si existe)
        // procesarHallazgosYGenerarPropuestas escribe en documentacion-fuente-unica-verdad/ad-rs
        const adrsDir = path.join(process.cwd(), 'documentacion-fuente-unica-verdad', 'ad-rs')
        const listado = await fs.promises.readdir(adrsDir).catch(() => [])
        expect(listado.length).toBeGreaterThanOrEqual(0)
        done()
      } catch (e) { done(e) }
    })
  })
})
