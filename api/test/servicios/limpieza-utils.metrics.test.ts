import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import fs from 'fs'
import path from 'path'
import { shouldAutoApprove } from '@servicios/limpieza-utils'
import { readAutoApproveMetrics } from '@nucleo/telemetria/auto-approve-metrics'

const tmpDir = path.resolve(__dirname, 'tmp-metrics')
const metricsFile = path.resolve(process.cwd(), 'tmp', 'metrics', 'auto-approve-metrics.jsonl')

beforeAll(() => {
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })
  try { fs.unlinkSync(metricsFile) } catch {}
})

afterAll(() => {
  for (const f of fs.readdirSync(tmpDir)) fs.unlinkSync(path.join(tmpDir, f))
})

describe('limpieza-utils metrics', () => {
  it('should record a metric when frontmatter confianza: alta', () => {
    const file = path.join(tmpDir, 'confianza.md')
    fs.writeFileSync(file, `---\ntitulo: prueba\nconfianza: alta\n---\nContenido`, 'utf8')
    const res = shouldAutoApprove(file)
    expect(res.ok).toBe(true)
    const metrics = readAutoApproveMetrics()
    const found = metrics.some((m) => m.file === file && m.reason && m.reason.includes('confianza alta'))
    expect(found).toBe(true)
  })
})
