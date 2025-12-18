import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { execSync } from 'child_process'
import { ejecutarRenombrados } from '../../../src/nucleo/servicios/servicio-automatizacion-renombrados'

describe('servicio-automatizacion-renombrados', () => {
  it('crea rama y renombra archivos en repo git temporal', async () => {
    const dir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'titan-test-'))
    // init git repo
    execSync('git init -q', { cwd: dir })
    // crear archivo
    const desde = path.join(dir, 'old.txt')
    await fs.promises.writeFile(desde, 'contenido', 'utf8')
    execSync('git add -A && git commit -m "init" -q', { cwd: dir })

    const ops = [{ desde: 'old.txt', hacia: 'nuevo/renombrado.txt' }]
    const res = await ejecutarRenombrados(dir, ops)
    expect(res).toHaveProperty('rama')
    expect(res.aplicados).toContain('old.txt -> nuevo/renombrado.txt')
    // comprobar que file fue renombrado
    expect(await fs.promises.stat(path.join(dir, 'nuevo/renombrado.txt'))).toBeTruthy()

    // cleanup
    await fs.promises.rm(dir, { recursive: true, force: true })
  })
})
