import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import { shouldAutoApprove } from '../../src/servicios/limpieza-utils'

const FIX = path.resolve(__dirname, 'fixtures', 'limpieza-utils')
fs.mkdirSync(FIX, { recursive: true })

describe('shouldAutoApprove', () => {
  it('auto-aprueba indice.ts con solo re-exports', () => {
    const f = path.join(FIX, 'indice.ts')
    fs.writeFileSync(f, "export * from './a'\nexport { b } from './b'\n")
    const r = shouldAutoApprove(f)
    expect(r.ok).toBe(true)
    expect(r.reason).toContain('índice')
  })

  it('no auto-aprueba md con bloque de código', () => {
    const f = path.join(FIX, 'doc.md')
    fs.writeFileSync(f, "Resumen\n\n```js\nconst x = 1\n```\n")
    const r = shouldAutoApprove(f)
    expect(r.ok).toBe(false)
    expect(r.reason).toContain('bloques de código')
  })

  it('no auto-aprueba package.json', () => {
    const f = path.join(FIX, 'package.json')
    fs.writeFileSync(f, JSON.stringify({ name: 'titan-test' }))
    const r = shouldAutoApprove(f)
    expect(r.ok).toBe(false)
    expect(r.reason).toContain('package.json')
  })
})