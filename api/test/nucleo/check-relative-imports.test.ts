import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import fs from 'fs'
import path from 'path'
import { scanForRelativeImports } from '@nucleo/indexacion/generador-indices-mcp'

const tmpDir = path.resolve(__dirname, 'tmp-scan')
beforeAll(() => {
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })
  const file = path.join(tmpDir, 'ejemplo.ts')
  fs.writeFileSync(file, `import { x } from '../otro'
const a = 1
`)
})

afterAll(() => {
  for (const f of fs.readdirSync(tmpDir)) fs.unlinkSync(path.join(tmpDir, f))
  fs.rmdirSync(tmpDir)
})

describe('scanForRelativeImports', () => {
  it('detecta importaciones relativas', async () => {
    const res = await scanForRelativeImports(tmpDir)
    expect(Array.isArray(res)).toBe(true)
    expect(res.length).toBeGreaterThan(0)
    expect(res[0]).toHaveProperty('file')
    expect(res[0]).toHaveProperty('line')
    expect(res[0]).toHaveProperty('text')
  })
})