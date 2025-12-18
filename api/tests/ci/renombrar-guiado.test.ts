import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import os from 'os'

// Mocks
vi.mock('../../src/nucleo/servicios/servicio-integridad-idioma', () => {
  return {
    escanearRepositorioParaIngles: async (_r: string) => [{ termino: 'migraciones' }],
    procesarHallazgosYGenerarPropuestas: async (_r: string, _h: any[]) => [{ termino: 'migraciones', propuestaGlosario: true, sugerenciaTraduccion: 'migraciones' }]
  }
})

vi.mock('../../scripts/ci/abrir-pr-migracion', () => ({ crearPR: (_b: string, _t: string, _body: string) => ({ success: true, url: 'https://github.com/org/repo/pull/1' }) }))

import { planRenombrados, aplicarRenombrados } from '../../scripts/servicios/renombrar'

describe('renombrar guiado', () => {
  let tmpdir: string
  beforeEach(() => {
    tmpdir = fs.mkdtempSync(path.join(os.tmpdir(), 'titan-'))
    // crear archivo con termino 'migraciones'
    const f = path.join(tmpdir, 'archivo.txt')
    fs.writeFileSync(f, 'Este repo usa migraciones en su flujo.', 'utf8')
    // init git correctamente
    const exec = require('child_process').execSync
    exec('git init --initial-branch=main', { cwd: tmpdir })
    exec('git config user.email "tester@example.com"', { cwd: tmpdir })
    exec('git config user.name "tester"', { cwd: tmpdir })
    exec('git add . && git commit -m "init"', { cwd: tmpdir })
  })

  afterEach(() => {
    try { fs.rmSync(tmpdir, { recursive: true, force: true }) } catch (_e) {}
  })

  it('planRenombrados detecta propuesta', async () => {
    const planes = await planRenombrados(tmpdir)
    expect(planes.length).toBeGreaterThan(0)
    expect(planes[0].origen).toBe('migraciones')
    expect(planes[0].destino).toBe('migraciones')
    expect(planes[0].archivos.length).toBeGreaterThan(0)
  })

  it('aplicarRenombrados bloquea cuando no se fuerza', async () => {
    const res = await aplicarRenombrados(tmpdir, { fuerza: false })
    expect(res.applied).toBe(false)
    expect(res.message).toMatch(/ADRs creadas/)
  })

  it('aplicarRenombrados aplica cuando se fuerza (simulado)', async () => {
    // Simular git commands: override spawnSync to succeed
    const orig = (require('child_process').spawnSync)
    vi.spyOn(require('child_process'), 'spawnSync').mockImplementation(() => ({ status: 0 }))
    const res = await aplicarRenombrados(tmpdir, { fuerza: true })
    expect(res.applied).toBe(true)
    expect(res.prUrl).toBeDefined()
    if (typeof res.prUrl === 'string') expect(res.prUrl).toContain('github.com')
  })
})
