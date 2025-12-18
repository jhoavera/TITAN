import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import fs from 'fs'
import path from 'path'
import { generateIndexForType } from '@nucleo/indexacion/generador-indices-mcp'

const tmpDir = path.resolve(__dirname, 'tmp-indices')
beforeAll(() => {
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })
  fs.writeFileSync(path.join(tmpDir, 'a.ts'), `export const a = 1\n`)
  fs.writeFileSync(path.join(tmpDir, 'b.ts'), `export const b = 2\n`)
  fs.writeFileSync(path.join(tmpDir, 'indice.ts'), `// old index that should be replaced\n`)
})

afterAll(() => {
  for (const f of fs.readdirSync(tmpDir)) fs.unlinkSync(path.join(tmpDir, f))
  fs.rmdirSync(tmpDir)
})

describe('generateIndexForType', () => {
  it('genera indice.ts sin incluirse a sí mismo y con export ordenados', () => {
    generateIndexForType(tmpDir)
    const content = fs.readFileSync(path.join(tmpDir, 'indice.ts'), 'utf8')
    expect(content).toContain(`export * from './a'`)
    expect(content).toContain(`export * from './b'`)
    expect(content).not.toContain("export * from './indice'")
  })
})
