import { describe, it, expect, beforeEach } from 'vitest'
import { evaluarParaAutoApprove } from '../../src/servicios/auto-approve/heuristicas'
import { readAutoApproveMetrics } from '@nucleo/telemetria/auto-approve-metrics'
import fs from 'fs'
import path from 'path'

process.env.BUN_TEST = 'true'

const metricsDir = path.resolve(process.cwd(), 'tmp', `metrics-test-${process.pid}`)
const metricsFile = path.join(metricsDir, 'auto-approve-metrics.jsonl')

beforeEach(() => {
  try { fs.rmSync(metricsDir, { recursive: true, force: true }) } catch {}
})

describe('Evaluar auto-approve (enhanced)', () => {
  it('aprueba cuando frontmatter contiene auto-approve: yes', () => {
    const content = `---\ntitle: prueba\nauto-approve: yes\n---\nContenido simple y largo suficiente para pasar la heurística con más de 120 palabras. `.repeat(5)
    const res = evaluarParaAutoApprove('test.md', content)
    expect(res.ok).toBe(true)
  })

  it('rechaza archivos muy cortos', () => {
    const content = 'corto contenido'
    const res = evaluarParaAutoApprove('short.md', content)
    expect(res.ok).toBe(false)
  })

  it('rechaza si contiene bloque de código', () => {
    const content = 'Esto es un documento largo '.repeat(30) + '\n```js\nconsole.log(1)\n```'
    const res = evaluarParaAutoApprove('code.md', content)
    expect(res.ok).toBe(false)
  })

  it('rechaza si contiene import/export', () => {
    const content = 'export function x() {}\n' + 'Contenido largo '.repeat(30)
    const res = evaluarParaAutoApprove('code2.md', content)
    expect(res.ok).toBe(false)
  })

  it('registra métricas por cada evaluación', () => {
    const content = 'Contenido largo '.repeat(60)
    const res = evaluarParaAutoApprove('metrics.md', content)
    const metrics = readAutoApproveMetrics()
    expect(metrics.length).toBeGreaterThan(0)
    // last metric should be aggregate result
    const last = metrics[metrics.length - 1]
    expect(last.rule).toBe('aggregate')
    expect(typeof last.ok).toBe('boolean')
  })
})
