import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import { recordAutoApproveMetric, readAutoApproveMetrics, summarizeAutoApproveMetrics, rotateAutoApproveMetrics } from '@nucleo/telemetria/auto-approve-metrics'

const tmpDir = path.resolve(__dirname, 'tmp-metrics')
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })

beforeEach(() => {
  for (const f of fs.readdirSync(tmpDir)) fs.unlinkSync(path.join(tmpDir, f))
  process.env.AUTO_APPROVE_METRICS_DIR = tmpDir
})

afterEach(() => {
  delete process.env.AUTO_APPROVE_METRICS_DIR
  for (const f of fs.readdirSync(tmpDir)) fs.unlinkSync(path.join(tmpDir, f))
})

describe('auto-approve metrics', () => {
  it('records and reads metrics', () => {
    const m = { ts: new Date().toISOString(), file: 'a.md', ok: true, reason: 'explicit', rule: 'explicit-mark' }
    recordAutoApproveMetric(m)
    const all = readAutoApproveMetrics()
    expect(all.length).toBe(1)
    expect(all[0].file).toBe('a.md')
  })

  it('summarizes metrics correctly', () => {
    const now = new Date()
    const old = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 40) // 40 days ago
    recordAutoApproveMetric({ ts: now.toISOString(), file: 'new.md', ok: true, reason: 'r1', rule: 'r1' })
    recordAutoApproveMetric({ ts: old.toISOString(), file: 'old.md', ok: false, reason: 'r2', rule: 'r2' })

    const sumAll = summarizeAutoApproveMetrics()
    expect(sumAll.total).toBe(2)
    expect(sumAll.ok).toBe(1)
    expect(sumAll.nok).toBe(1)

    const sumSince = summarizeAutoApproveMetrics({ since: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString() })
    expect(sumSince.total).toBe(1)
    expect(sumSince.ok).toBe(1)
  })

  it('rotates old metrics into archive file', () => {
    const now = new Date()
    const old = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 40) // 40 days
    recordAutoApproveMetric({ ts: now.toISOString(), file: 'new.md', ok: true })
    recordAutoApproveMetric({ ts: old.toISOString(), file: 'old.md', ok: false })

    const res = rotateAutoApproveMetrics(30)
    expect(res.rotated).toBe(1)
    expect(res.archivePath).toBeTruthy()
    const archiveContent = fs.readFileSync(res.archivePath!, 'utf8')
    expect(archiveContent.includes('old.md')).toBe(true)
  })
})
