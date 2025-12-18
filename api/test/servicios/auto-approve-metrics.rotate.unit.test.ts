import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { recordAutoApproveMetric, readAutoApproveMetrics, rotateAutoApproveMetrics } from '../../src/nucleo/telemetria/auto-approve-metrics'

const OUT = path.join(process.cwd(), 'tmp', 'metrics')
const FILE = path.join(OUT, 'auto-approve-metrics.jsonl')

describe('telemetría - rotación de métricas', () => {
  let tmpDir: string

  beforeEach(() => {
    tmpDir = OUT
    // cleanup
    try { fs.rmSync(tmpDir, { recursive: true, force: true }) } catch (_e) {}
  })

  afterEach(() => {
    try { fs.rmSync(tmpDir, { recursive: true, force: true }) } catch (_e) {}
  })

  it('rotaciona entradas antiguas y mantiene recientes', () => {
    const oldTs = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() // 10 days ago
    const newTs = new Date().toISOString()

    recordAutoApproveMetric({ ts: oldTs, file: 'a.md', ok: false, reason: 'old' })
    recordAutoApproveMetric({ ts: newTs, file: 'b.md', ok: true, reason: 'new' })

    let metrics = readAutoApproveMetrics()
    expect(metrics.length).toBe(2)

    const res = rotateAutoApproveMetrics(5) // rotate older than 5 days
    expect(res.rotated).toBeGreaterThanOrEqual(1)
    expect(res.archivePath).toBeTruthy()

    // After rotation, file should contain only the recent entry
    const after = readAutoApproveMetrics()
    expect(after.every(m => m.reason !== 'old')).toBe(true)
    expect(after.some(m => m.reason === 'new')).toBe(true)

    // Archive file exists
    expect(fs.existsSync(res.archivePath as string)).toBe(true)
  })
})