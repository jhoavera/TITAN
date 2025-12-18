import { describe, it, expect, afterEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import { shouldAutoApprove } from '@servicios/limpieza-utils'

const tmpDir = path.resolve(__dirname, 'tmp-auto-approve-extended')
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })

afterEach(() => {
  for (const f of fs.readdirSync(tmpDir)) fs.unlinkSync(path.join(tmpDir, f))
})

describe('shouldAutoApprove - extended rules', () => {
  it('rejects package.json modifications', () => {
    const file = path.join(tmpDir, 'package.json')
    const content = `{"name":"mal","version":"1.0.0"}`
    fs.writeFileSync(file, content, 'utf8')
    const res = shouldAutoApprove(file)
    expect(res.ok).toBe(false)
    expect(res.reason).toContain('package.json')
    expect(res.rule).toBe('package-json')
  })

  it('approves index re-export files', () => {
    const file = path.join(tmpDir, 'index.ts')
    const content = `export * from './mod'
export * from './otro'`
    fs.writeFileSync(file, content, 'utf8')
    const res = shouldAutoApprove(file)
    expect(res.ok).toBe(true)
    expect(res.rule).toBe('index-reexport')
  })

  it('rejects files containing imports/exports in proposal content', () => {
    const file = path.join(tmpDir, 'prop.md')
    const content = `import fs from 'fs'\nexport const q = 1`
    fs.writeFileSync(file, content, 'utf8')
    const res = shouldAutoApprove(file)
    expect(res.ok).toBe(false)
    expect(res.rule).toBe('code-imports')
  })

  it('respects max size for maintainers', () => {
    const file = path.join(tmpDir, 'small.md')
    const content = `---\ntitulo: prueba\nautor: titan-admin\n---\n` + 'a'.repeat(50)
    fs.writeFileSync(file, content, 'utf8')
    const res = shouldAutoApprove(file, { maintainers: ['titan-admin'], maxSizeForMaintainer: 200 })
    expect(res.ok).toBe(true)
  })
})
