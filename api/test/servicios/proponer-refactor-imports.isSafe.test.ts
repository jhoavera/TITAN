import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import { isSafeToAutoApply } from '../../src/servicios/proponer-refactor-imports'

const FIXTURE_DIR = path.resolve(__dirname, 'fixtures', 'isSafe-fixtures')
fs.mkdirSync(FIXTURE_DIR, { recursive: true })

describe('isSafeToAutoApply heuristics', () => {
  it('returns false for barrel re-exports (export *)', async () => {
    const f = path.join(FIXTURE_DIR, 'barrel.ts')
    fs.writeFileSync(f, "export * from './lib'\n")
    const proposal: any = { id: 'P1', title: 't', files: [f], examples: [], rationale: '', proposed_changes: [] }
    const res = await isSafeToAutoApply(proposal, { maxFiles: 5, baseDir: path.resolve(__dirname, '..', 'fixtures', 'isSafe-fixtures') })
    expect(res.ok).toBe(false)
    expect(res.reason).toContain('re-export')
  })

  it('returns false for named re-exports (export { x } from)', async () => {
    const f = path.join(FIXTURE_DIR, 'reexport.ts')
    fs.writeFileSync(f, "export { a, b } from './lib'\n")
    const proposal: any = { id: 'P2', title: 't', files: [f], examples: [], rationale: '', proposed_changes: [] }
    const res = await isSafeToAutoApply(proposal, { maxFiles: 5, baseDir: path.resolve(__dirname, '..', 'fixtures', 'isSafe-fixtures') })
    expect(res.ok).toBe(false)
    expect(res.reason).toContain('re-export')
  })

  it('returns false for dynamic requires', async () => {
    const f = path.join(FIXTURE_DIR, 'dynamic.ts')
    fs.writeFileSync(f, "const p = './' + name; const m = require(p)\n")
    const proposal: any = { id: 'P3', title: 't', files: [f], examples: [], rationale: '', proposed_changes: [] }
    const res = await isSafeToAutoApply(proposal, { maxFiles: 5, baseDir: path.resolve(__dirname, '..', 'fixtures', 'isSafe-fixtures') })
    expect(res.ok).toBe(false)
    expect(res.reason).toContain('dinámicos')
  })

  it('returns false when importer uses default import but module has only named exports', async () => {
    const modDir = path.join(FIXTURE_DIR, 'mod2')
    fs.mkdirSync(modDir, { recursive: true })
    const f = path.join(modDir, 'b.ts')
    fs.writeFileSync(f, "export const b = 2\n")
    const importer = path.join(FIXTURE_DIR, 'imp-default.ts')
    fs.writeFileSync(importer, "import def from './mod2/b'\n")
    const proposal: any = { id: 'P4', title: 't', files: [f], examples: [], rationale: '', proposed_changes: [] }
    const res = await isSafeToAutoApply(proposal, { maxFiles: 5, baseDir: path.resolve(__dirname, '..', 'fixtures', 'isSafe-fixtures') })
    expect(res.ok).toBe(false)
    expect(res.reason).toContain('default export')
  })

  it('returns false when importer imports named that is not exported', async () => {
    const modDir = path.join(FIXTURE_DIR, 'mod3')
    fs.mkdirSync(modDir, { recursive: true })
    const f = path.join(modDir, 'b.ts')
    fs.writeFileSync(f, "export const b = 2\n")
    const importer = path.join(FIXTURE_DIR, 'imp-named.ts')
    fs.writeFileSync(importer, "import { c } from './mod3/b'\n")
    const proposal: any = { id: 'P5', title: 't', files: [f], examples: [], rationale: '', proposed_changes: [] }
    const res = await isSafeToAutoApply(proposal, { maxFiles: 5, baseDir: path.resolve(__dirname, '..', 'fixtures', 'isSafe-fixtures') })
    expect(res.ok).toBe(false)
    expect(res.reason).toContain('no está exportado')
  })

  it('permite auto-apply cuando solo son archivos índice de re-export (indice.ts / index.ts)', async () => {
    // create many index files that only re-export to simulate large batch
    const files: string[] = []
    for (let i = 0; i < 20; i++) {
      const dir = path.join(FIXTURE_DIR, `idx${i}`)
      fs.mkdirSync(dir, { recursive: true })
      const f = path.join(dir, 'indice.ts')
      fs.writeFileSync(f, "export * from './a'\nexport { b } from './b'\n")
      files.push(f)
    }
    const proposal: any = { id: 'P-INDEX', title: 'index batch', files, examples: [], rationale: '', proposed_changes: [] }
    const res = await isSafeToAutoApply(proposal, { maxFiles: 5, baseDir: path.resolve(__dirname, '..', 'fixtures', 'isSafe-fixtures') })
    expect(res.ok).toBe(true)
  })
})
