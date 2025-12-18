import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import { shouldAutoApprove } from '@servicios/limpieza-utils'
import { readAutoApproveMetrics } from '@nucleo/telemetria/auto-approve-metrics'

const FIX = path.resolve(__dirname, 'fixtures', 'metrics')
fs.mkdirSync(FIX, { recursive: true })

describe('auto-approve metrics', () => {
  it('records a metric when rejecting due to code block', () => {
    const f = path.join(FIX, 'doc.md')
    fs.writeFileSync(f, "Resumen\n\n```js\nconst x = 1\n```\n")
    const r = shouldAutoApprove(f)
    expect(r.ok).toBe(false)
    const metrics = readAutoApproveMetrics()
    const last = metrics[metrics.length - 1]
    expect(last).toBeDefined()
    expect(last.file).toContain('metrics/doc.md')
    expect(last.ok).toBe(false)
    expect(last.rule).toBe('code-block')
  })
})