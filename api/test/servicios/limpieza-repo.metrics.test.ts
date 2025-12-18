import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import fs from 'fs'
import path from 'path'
import { run } from '../../scripts/servicios/limpieza-repo'
import { readAutoApproveMetrics } from '../../src/nucleo/telemetria/auto-approve-metrics'

const dirPropuestas = path.resolve(__dirname, '../../../documentacion-fuente-unica-verdad/glosario-biblioteca/propuestas')
const tmpMetrics = path.resolve(process.cwd(), 'tmp', 'metrics', 'auto-approve-metrics.jsonl')

const backupDir = path.join(dirPropuestas, '.backup-for-test')

beforeAll(() => {
  // ensure proposals dir exists
  if (!fs.existsSync(dirPropuestas)) fs.mkdirSync(dirPropuestas, { recursive: true })
  // backup existing proposals to avoid noise from unrelated files
  if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true })
  for (const f of fs.readdirSync(dirPropuestas)) {
    if (f === '.backup-for-test') continue
    fs.renameSync(path.join(dirPropuestas, f), path.join(backupDir, f))
  }
  // clean metrics
  try { fs.unlinkSync(tmpMetrics) } catch {}
})

afterAll(() => {
  // restore backup
  if (fs.existsSync(backupDir)) {
    for (const f of fs.readdirSync(backupDir)) {
      fs.renameSync(path.join(backupDir, f), path.join(dirPropuestas, f))
    }
    fs.rmdirSync(backupDir)
  }
  // cleanup proposals created by test
  for (const f of fs.readdirSync(dirPropuestas || '') || []) {
    if (f.startsWith('test-metric-')) fs.unlinkSync(path.join(dirPropuestas, f))
  }
})

describe('limpieza-repo métricas', () => {
  it('registra métricas de decisión al evaluar propuestas', async () => {
    const okFile = path.join(dirPropuestas, `test-metric-ok.md`)
    const badFile = path.join(dirPropuestas, `test-metric-bad.md`)
    fs.writeFileSync(okFile, `---\ntitulo: ok\nconfianza: alta\n---\ncontenido`)
    const badContent = '---\ntitulo: bad\n---\n```js\nconsole.log(\'hola\')\n```\n'
    fs.writeFileSync(badFile, badContent)

    const res = await run({ dryRun: true, olderThanDays: 0, apply: true, autoApprove: true })
    expect(res).toHaveProperty('found')

    const metrics = readAutoApproveMetrics()
    const reasons = metrics.map((m) => m.reason)
    expect(reasons.some((r) => r && r.toString().includes('confianza alta'))).toBe(true)
    expect(reasons.some((r) => r && r.toString().includes('contiene bloques de código'))).toBe(true)
  })
})