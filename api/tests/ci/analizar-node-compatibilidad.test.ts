import { describe, it, expect } from 'vitest'
import { analizarScripts } from '@scripts/ci/analizar-node-compatibilidad'

describe('analizar-node-compatibilidad', () => {
  it('detecta node -r ts-node/register y sugiere bun', () => {
    const scripts = { 'dev': "node -r ts-node/register ./scripts/dev.ts" }
    const res = analizarScripts(scripts)
    expect(res.length).toBe(1)
    expect(res[0].issues).toContain('Uso de node con ts-node/register')
    expect(res[0].suggestion).toContain('bun')
  })

  it('detecta ts-node y npx', () => {
    const scripts = { 'revisar': 'ts-node ./scripts/revisar-idioma.ts', 'run-tool': 'npx some-tool' }
    const res = analizarScripts(scripts)
    expect(res.length).toBe(2)
    const issues = res.flatMap(r => r.issues)
    expect(issues).toContain('Uso de ts-node')
    expect(issues).toContain('Uso de npx (puede requerir conversión)')
  })
})
