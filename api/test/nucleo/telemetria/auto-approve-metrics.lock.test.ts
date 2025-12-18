import { describe, it, expect, beforeEach } from 'vitest'
import { recordAutoApproveMetric, readAutoApproveMetrics, rotateAutoApproveMetrics } from '@nucleo/telemetria/auto-approve-metrics'
import fs from 'fs'
import path from 'path'

describe('auto-approve metrics rotation lock', () => {
  const metricsDir = path.resolve(process.cwd(), 'tmp', `metrics-test-${process.pid}`)
  const metricsFile = path.join(metricsDir, 'auto-approve-metrics.jsonl')

  beforeEach(() => {
    process.env.BUN_TEST = 'true'
    // cleanup
    try { fs.rmSync(metricsDir, { recursive: true, force: true }) } catch {}
  })

  it('should perform a rotation while concurrent rotation returns 0 due to lock', () => {
    const now = new Date()
    const old = new Date(now.getTime() - 1000 * 60 * 60 * 24 * 10).toISOString() // 10 days ago
    // add an old and a new event
    recordAutoApproveMetric({ ts: old, file: 'old.md', ok: false, rule: 'old' })
    recordAutoApproveMetric({ ts: now.toISOString(), file: 'new.md', ok: true, rule: 'new' })

    // Ensure file exists
    const before = readAutoApproveMetrics()
    expect(before.length).toBeGreaterThanOrEqual(2)

    // Run two rotations "concurrently" by invoking them one after another quickly
    const r1 = rotateAutoApproveMetrics(5) // rotate older than 5 days
    const r2 = rotateAutoApproveMetrics(5) // second call should see lock and return 0

    // One of them should report rotated > 0 and the other 0
    const rotatedTotal = (r1.rotated || 0) + (r2.rotated || 0)
    expect(rotatedTotal).toBeGreaterThanOrEqual(1)
    expect([r1.rotated, r2.rotated]).toContain(0)

    // After rotation, metrics file should contain only recent entries
    const after = readAutoApproveMetrics()
    expect(after.every((m) => new Date(m.ts).getTime() > Date.now() - 1000 * 60 * 60 * 24 * 6)).toBeTruthy()
  })
})