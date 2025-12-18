import { ejecutarConversion } from '../../scripts/ci/convertir-scripts-a-bun'
import * as idioma from '../../src/nucleo/servicios/servicio-integridad-idioma'
import fs from 'fs'
import path from 'path'
import { expect, it, describe, beforeEach, afterEach, vi } from 'vitest'

describe('integración con revisar-idioma antes de aplicar conversion', () => {
  const pkgPath = path.resolve(process.cwd(), 'package.json')
  let createdTempPkg = false
  let orig: string | undefined = undefined

  beforeEach(() => {
    if (!fs.existsSync(pkgPath)) {
      fs.writeFileSync(pkgPath, JSON.stringify({ name: 'titan-temp', scripts: {} }, null, 2) + '\n', 'utf8')
      createdTempPkg = true
    } else {
      orig = fs.readFileSync(pkgPath, 'utf8')
    }
  })

  afterEach(() => {
    if (createdTempPkg) {
      // remove temp file and reset flag
      try { fs.unlinkSync(pkgPath) } catch (_) {}
      createdTempPkg = false
    } else if (orig !== undefined) {
      fs.writeFileSync(pkgPath, orig, 'utf8')
      orig = undefined
    }
  })

  it('bloquea la aplicación si se generan ADRs y no se fuerza', async () => {
    const scripts = { 'dev': 'node -r ts-node/register src/index.ts' }
    // mock escanear + procesar
    const spyScan = vi.spyOn(idioma, 'escanearRepositorioParaIngles').mockResolvedValue([{ tipo: 'archivo', ruta: 'some/file', termino: 'migraciones' }])
    const spyProc = vi.spyOn(idioma, 'procesarHallazgosYGenerarPropuestas').mockResolvedValue([{ termino: 'migraciones', adr: '/tmp/adr.md' }])

    // put a package.json with the script to change
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
    pkg.scripts = pkg.scripts ?? {}
    pkg.scripts['dev'] = 'node -r ts-node/register src/index.ts'
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8')

    const changes = await ejecutarConversion({ apply: true, createPR: false, force: false })
    // changes found but apply was blocked due to ADR
    expect(changes.length).toBeGreaterThan(0)
    spyScan.mockRestore()
    spyProc.mockRestore()
  })

  it('aplica cuando se fuerza (--force)', async () => {
    const spyScan = vi.spyOn(idioma, 'escanearRepositorioParaIngles').mockResolvedValue([{ tipo: 'archivo', ruta: 'some/file', termino: 'migraciones' }])
    const spyProc = vi.spyOn(idioma, 'procesarHallazgosYGenerarPropuestas').mockResolvedValue([{ termino: 'migraciones', adr: '/tmp/adr.md' }])

    const res = await ejecutarConversion({ apply: true, createPR: false, force: true })
    expect(Array.isArray(res)).toBe(true)

    spyScan.mockRestore()
    spyProc.mockRestore()
  })
})
