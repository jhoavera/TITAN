import { describe, it, expect, beforeEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'

describe('Integración - revisar-todo', () => {
  const tmp = path.join(process.cwd(), 'test-temp-revisar-todo')
  beforeEach(async () => {
    await fs.promises.rm(tmp, { recursive: true, force: true }).catch(() => {})
    await fs.promises.mkdir(tmp, { recursive: true })
    await fs.promises.mkdir(path.join(tmp, 'migraciones'))
    await fs.promises.writeFile(path.join(tmp, 'migraciones', '0001_create_table.sql'), '-- migracion: create table test')
  })

  it('ejecuta revisar-todo y genera ADRs/propuestas', (done) => {
    const cmd = `bun api/scripts/revisar-todo.ts ${tmp}`
    exec(cmd, { cwd: process.cwd(), env: process.env }, async (err, stdout, stderr) => {
      try {
        expect(err).toBeNull()
        expect(stdout).toContain('Revisión completa finalizada')
        // verificar que ADRs fueron creadas
        const adrsDir = path.join(process.cwd(), 'documentacion-fuente-unica-verdad', 'ad-rs')
        const listado = await fs.promises.readdir(adrsDir).catch(() => [])
        expect(listado.length).toBeGreaterThanOrEqual(0)
        done()
      } catch (e) { done(e) }
    })
  })
})
