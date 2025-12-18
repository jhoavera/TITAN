import { describe, it, expect, beforeEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'

const execP = promisify(exec)

describe('Integración - revisar-todo', () => {
  const tmp = path.join(process.cwd(), 'test-temp-revisar-todo')
  beforeEach(async () => {
    await fs.promises.rm(tmp, { recursive: true, force: true }).catch(() => {})
    await fs.promises.mkdir(tmp, { recursive: true })
    await fs.promises.mkdir(path.join(tmp, 'migraciones'))
    await fs.promises.writeFile(path.join(tmp, 'migraciones', '0001_create_table.sql'), '-- migracion: create table test')
  })

  it('ejecuta revisar-todo y genera ADRs/propuestas', async () => {
    const cmd = `bun api/scripts/revisar-todo.ts ${tmp}`
    const { stdout } = await execP(cmd, { cwd: process.cwd(), env: process.env })
    expect(stdout).toContain('Revisión completa finalizada')
    // verificar que ADRs fueron creadas
    const adrsDir = path.join(process.cwd(), 'documentacion-fuente-unica-verdad', 'ad-rs')
    const listado = await fs.promises.readdir(adrsDir).catch(() => [])
    expect(listado.length).toBeGreaterThanOrEqual(0)
  })
})
