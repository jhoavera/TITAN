import { describe, it, expect, vi } from 'vitest'
import fs from 'fs'
import path from 'path'
import { ejecutarConversion } from '../../scripts/ci/convertir-scripts-a-bun'

describe('convertir-scripts-a-bun (integración PR)', () => {
  it('invoca crearPR con cuerpo que contiene lista de cambios y ADRs', async () => {
    // Preparar package.json temporal (crear si no existe)
    const pkgPath = path.resolve(process.cwd(), 'package.json')
    let createdTempPkg = false
    let orig: string | undefined = undefined
    if (!fs.existsSync(pkgPath)) {
      fs.writeFileSync(pkgPath, JSON.stringify({ name: 'titan-temp', scripts: {} }, null, 2) + '\n', 'utf8')
      createdTempPkg = true
    } else {
      orig = fs.readFileSync(pkgPath, 'utf8')
    }
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'))
    pkg.scripts = pkg.scripts ?? {}
    pkg.scripts['dev'] = 'node -r ts-node/register src/index.ts'
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8')

    // mockar servicio de idioma para crear ADRs
    const idioma = await import('../../src/nucleo/servicios/servicio-integridad-idioma')
    const spyProcesar = vi.spyOn(idioma, 'procesarHallazgosYGenerarPropuestas').mockResolvedValue([{ termino: 'migraciones', adr: '/ruta/adr.md' }])
    const spyEscanear = vi.spyOn(idioma, 'escanearRepositorioParaIngles').mockResolvedValue([{ tipo: 'archivo', ruta: 'some/file', termino: 'migraciones' }])

    // mock crearPR
    const pr = await import('../../scripts/ci/abrir-pr-migracion')
    const spyPr = vi.spyOn(pr, 'crearPR').mockImplementation(() => ({ success: true, url: 'https://github.com/org/repo/pull/999' }))

    // ejecutar con apply y crear PR
    const res = await ejecutarConversion({ apply: true, createPR: true, force: true })
    expect(Array.isArray(res)).toBe(true)
    expect(spyPr).toHaveBeenCalled()
    const callArgs = spyPr.mock.calls[0]
    const bodyArg = callArgs[2] as string
    expect(bodyArg).toMatch(/Cambios detectados/)
    expect(bodyArg).toMatch(/ADRs \/ propuestas de glosario generadas/)

    // restaurar
    spyPr.mockRestore()
    spyProcesar.mockRestore()
    spyEscanear.mockRestore()
    if (createdTempPkg) {
      fs.unlinkSync(pkgPath)
    } else if (orig !== undefined) {
      fs.writeFileSync(pkgPath, orig, 'utf8')
    }
  })
})