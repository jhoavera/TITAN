import fs from 'fs'
import path from 'path'
import { describe, it, beforeEach, afterEach, expect } from 'vitest'
import { updateBunAliases } from '../../src/nucleo/indexacion/generador-indices-mcp'

const tmp = path.resolve(__dirname, 'tmp-aliases')
const bunfig = path.join(tmp, 'bunfig.toml')
const srcDir = path.join(tmp, 'src')

beforeEach(() => {
  fs.rmSync(tmp, { recursive: true, force: true })
  fs.mkdirSync(srcDir, { recursive: true })
  // create two dirs with ts files
  fs.mkdirSync(path.join(srcDir, 'servicios'))
  fs.writeFileSync(path.join(srcDir, 'servicios', 'a.ts'), 'export const a=1')
  fs.mkdirSync(path.join(srcDir, 'componentes'))
  fs.writeFileSync(path.join(srcDir, 'componentes', 'b.ts'), 'export const b=2')

  // initial bunfig with one existing alias
  fs.writeFileSync(bunfig, '[alias]\n"@existente/*" = "./src/existente/*"\n', 'utf8')
})

afterEach(() => {
  fs.rmSync(tmp, { recursive: true, force: true })
})

describe('updateBunAliases', () => {
  it('añade aliases detectados sin duplicar y preserva existentes', () => {
    updateBunAliases(bunfig, srcDir)
    const content = fs.readFileSync(bunfig, 'utf8')
    expect(content).toContain('"@servicios/*" = "./src/servicios/*"')
    expect(content).toContain('"@componentes/*" = "./src/componentes/*"')
    expect(content).toContain('"@existente/*" = "./src/existente/*"')
  })
})
