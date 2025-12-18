import fs from 'fs'
import path from 'path'

export type AutoApproveMetric = {
  ts: string
  file: string
  ok: boolean
  reason?: string
  rule?: string
  branch?: string
  commit?: string
  extra?: Record<string, unknown>
}

function getMetricsPaths() {
  const envDir = process.env.AUTO_APPROVE_METRICS_DIR
  if (envDir && envDir.trim() !== '') {
    const out = path.resolve(envDir)
    const file = path.join(out, 'auto-approve-metrics.jsonl')
    return { out, file }
  }

  const testMode = process.env.BUN_TEST === '1' || process.env.BUN_TEST === 'true' || process.env.VITEST === 'true' || process.env.VITEST_WORKER_ID !== undefined || process.env.NODE_ENV === 'test'
  const out = testMode
    ? path.resolve(process.cwd(), 'tmp', `metrics-test-${process.pid}`)
    : path.resolve(process.cwd(), 'tmp', 'metrics')
  const file = path.join(out, 'auto-approve-metrics.jsonl')
  return { out, file }
}

export function recordAutoApproveMetric(event: AutoApproveMetric) {
  try {
    const { out, file } = getMetricsPaths()
    fs.mkdirSync(out, { recursive: true })
    const line = JSON.stringify(event) + '\n'
    fs.appendFileSync(file, line, 'utf8')
  } catch (e) {
    // non-fatal: ensure we don't throw from metrics
    console.error('[metrics] failed to write metric', e instanceof Error ? e.message : String(e))
  }
}

export function readAutoApproveMetrics(): AutoApproveMetric[] {
  try {
    const { file } = getMetricsPaths()
    if (!fs.existsSync(file)) return []
    const buf = fs.readFileSync(file, 'utf8')
    return buf
      .split('\n')
      .filter(Boolean)
      .map((l) => JSON.parse(l) as AutoApproveMetric)
  } catch (e) {
    console.error('[metrics] failed to read metrics', e instanceof Error ? e.message : String(e))
    return []
  }
}

export type MetricsSummary = {
  total: number
  ok: number
  nok: number
  byRule: Record<string, { count: number; ok: number; nok: number }>
  byReason: Record<string, number>
}

export function summarizeAutoApproveMetrics(opts?: { since?: string; until?: string }): MetricsSummary {
  const metrics = readAutoApproveMetrics()
  const since = opts?.since ? new Date(opts.since) : undefined
  const until = opts?.until ? new Date(opts.until) : undefined

  const filtered = metrics.filter((m) => {
    const t = new Date(m.ts)
    if (since && t < since) return false
    if (until && t > until) return false
    return true
  })

  const summary: MetricsSummary = {
    total: filtered.length,
    ok: 0,
    nok: 0,
    byRule: {},
    byReason: {},
  }

  for (const m of filtered) {
    if (m.ok) summary.ok++
    else summary.nok++
    const rule = m.rule || 'unknown'
    const reason = m.reason || 'unspecified'
    if (!summary.byRule[rule]) summary.byRule[rule] = { count: 0, ok: 0, nok: 0 }
    summary.byRule[rule].count++
    if (m.ok) summary.byRule[rule].ok++
    else summary.byRule[rule].nok++
    summary.byReason[reason] = (summary.byReason[reason] || 0) + 1
  }

  return summary
}

/**
 * Rotate metrics older than maxAgeDays: moves old entries into an archive file and keeps recent ones
 */
export function rotateAutoApproveMetrics(maxAgeDays = 30): { rotated: number; archivePath?: string } {
  try {
    const { out, file } = getMetricsPaths()
    if (!fs.existsSync(file)) return { rotated: 0 }
    const lines = fs.readFileSync(file, 'utf8').split('\n').filter(Boolean)
    if (lines.length === 0) return { rotated: 0 }

    const cutoff = Date.now() - maxAgeDays * 24 * 60 * 60 * 1000
    const keep: string[] = []
    const rot: string[] = []

    for (const l of lines) {
      try {
        const obj = JSON.parse(l) as AutoApproveMetric
        const t = new Date(obj.ts).getTime()
        if (t < cutoff) rot.push(l)
        else keep.push(l)
      } catch {
        // If parse fails, keep the line to avoid data loss
        keep.push(l)
      }
    }

    if (rot.length === 0) return { rotated: 0 }

    const archiveName = path.join(out, `auto-approve-archive-${new Date().toISOString().slice(0,10)}.jsonl`)
    fs.appendFileSync(archiveName, rot.join('\n') + '\n', 'utf8')
    fs.writeFileSync(file, keep.join('\n') + (keep.length ? '\n' : ''), 'utf8')
    return { rotated: rot.length, archivePath: archiveName }
  } catch (e) {
    console.error('[metrics] rotate failed', e instanceof Error ? e.message : String(e))
    return { rotated: 0 }
  }
}
