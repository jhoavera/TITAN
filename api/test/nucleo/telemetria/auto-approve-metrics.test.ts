import fs from 'fs'
import path from 'path'
import { summarizeAutoApproveMetrics, recordAutoApproveMetric, rotateAutoApproveMetrics, readAutoApproveMetrics } from '@nucleo/telemetria/auto-approve-metrics'
import { describe, it, beforeEach, afterEach, expect } from 'vitest'

let METRICS_DIR = path.resolve(process.cwd(), 'tmp', `metrics-${process.pid}-${Date.now()}-${Math.random().toString(36).slice(2,8)}`)
let METRICS_FILE = ''

beforeEach(() => {
  METRICS_FILE = path.join(METRICS_DIR, 'auto-approve-metrics.jsonl')
})

describe('auto-approve metrics', () => {
  beforeEach(() => {
    process.env.AUTO_APPROVE_METRICS_DIR = METRICS_DIR
    fs.rmSync(METRICS_DIR, { recursive: true, force: true })
    fs.mkdirSync(METRICS_DIR, { recursive: true })
  })

  afterEach(() => {
    delete process.env.AUTO_APPROVE_METRICS_DIR
    fs.rmSync(METRICS_DIR, { recursive: true, force: true })
  })

  it('records and summarizes metrics', () => {
    const now = new Date()
    recordAutoApproveMetric({ ts: now.toISOString(), file: 'a.md', ok: true, rule: 'explicit-mark', reason: 'marca automática' })
    recordAutoApproveMetric({ ts: now.toISOString(), file: 'b.md', ok: false, rule: 'code-block', reason: 'contiene bloques de código' })
    recordAutoApproveMetric({ ts: now.toISOString(), file: 'c.ts', ok: false, rule: 'extensión', reason: 'extensión no segura' })

    const s = summarizeAutoApproveMetrics()
    expect(s.total).toBe(3)
    expect(s.ok).toBe(1)
    expect(s.nok).toBe(2)
    expect(s.byRule['explicit-mark'].count).toBe(1)
    expect(s.byRule['code-block'].nok).toBe(1)
    expect(s.byReason['contiene bloques de código']).toBe(1)
  })

  it('rotates old metrics', () => {
    const old = new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString()
    const now = new Date().toISOString()
    recordAutoApproveMetric({ ts: old, file: 'old.md', ok: false, rule: 'old-rule', reason: 'old' })
    recordAutoApproveMetric({ ts: now, file: 'new.md', ok: true, rule: 'new-rule', reason: 'new' })

    const before = readAutoApproveMetrics()
    expect(before.length).toBe(2)

    const res = rotateAutoApproveMetrics(30)
    expect(res.rotated).toBeGreaterThanOrEqual(1)

    // archive file should be reported and exist
    expect(res.archivePath).toBeDefined()
    if (res.archivePath) {
      expect(fs.existsSync(res.archivePath)).toBe(true)
      const archived = fs.readFileSync(res.archivePath, 'utf8')
      expect(archived.includes('old.md')).toBe(true)
    }

    const after = readAutoApproveMetrics()
    expect(after.some(m => (m.file === 'old.md'))).toBe(false)
    expect(after.some(m => (m.file === 'new.md'))).toBe(true)
  })

  it('includes newly added rules in summary (changelog/report/translation)', () => {
    const now = new Date().toISOString()
    recordAutoApproveMetric({ ts: now, file: 'CHANGELOG.md', ok: true, rule: 'changelog', reason: 'cambios' })
    recordAutoApproveMetric({ ts: now, file: 'reports/reporte.md', ok: true, rule: 'report-small', reason: 'reporte' })
    recordAutoApproveMetric({ ts: now, file: 'ad-rs/propuestas/traduccion.md', ok: true, rule: 'translation-suggestion', reason: 'traducción' })

    const s = summarizeAutoApproveMetrics()
    expect(s.byRule['changelog']).toBeDefined()
    expect(s.byRule['report-small']).toBeDefined()
    expect(s.byRule['translation-suggestion']).toBeDefined()
  })
})
