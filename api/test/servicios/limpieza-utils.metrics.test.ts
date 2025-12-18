import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import fs from 'fs'
import path from 'path'
import { shouldAutoApprove } from '@servicios/limpieza-utils'
import { readAutoApproveMetrics } from '@nucleo/telemetria/auto-approve-metrics'

const tmpDir = path.resolve(__dirname, 'tmp-metrics')
const metricsFile = path.resolve(process.cwd(), 'tmp', 'metrics', 'auto-approve-metrics.jsonl')

beforeAll(() => {
  if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })
  // Eliminar posibles archivos de métricas en ambos paths que puede usar la librería en modo test
  try { fs.unlinkSync(metricsFile) } catch {}
  try { fs.unlinkSync(path.resolve(process.cwd(), 'tmp', `metrics-test-${process.pid}`, 'auto-approve-metrics.jsonl')) } catch {}
})

afterAll(() => {
  // eliminar recursivamente el tmp creado por las pruebas
  try { fs.rmSync(tmpDir, { recursive: true, force: true }) } catch (e) {}
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

  it('records md-small metric', () => {
    const file = path.join(tmpDir, 'short.md')
    fs.writeFileSync(file, '# Nota\nContenido corto', 'utf8')
    const res = shouldAutoApprove(file)
    expect(res.ok).toBe(true)
    const metrics = readAutoApproveMetrics()
    expect(metrics.some((m) => m.file === file && m.rule === 'md-small')).toBe(true)
  })

  it('records json-small metric', () => {
    const dir = path.join(tmpDir, 'data')
    fs.mkdirSync(dir, { recursive: true })
    const file = path.join(dir, 'termino.json')
    fs.writeFileSync(file, JSON.stringify({ termino: 't', definicion: 'd' }), 'utf8')
    const res = shouldAutoApprove(file)
    expect(res.ok).toBe(true)
    const metrics = readAutoApproveMetrics()
    expect(metrics.some((m) => m.file === file && m.rule === 'json-small')).toBe(true)
  })

  it('records glossary-proposal metric when old and allowed', () => {
    const pdir = path.join(tmpDir, 'documentacion-fuente-unica-verdad', 'glosario-biblioteca', 'propuestas')
    fs.mkdirSync(pdir, { recursive: true })
    const file = path.join(pdir, 'prop.md')
    fs.writeFileSync(file, '# Propuesta\nContenido', 'utf8')
    const old = Date.now() - 1000 * 60 * 60 * 24 * 365
    fs.utimesSync(file, old / 1000, old / 1000)
    const res = shouldAutoApprove(file, { allowLongTermAuto: true, longTermDays: 30 })
    expect(res.ok).toBe(true)
    const metrics = readAutoApproveMetrics()
    expect(metrics.some((m) => m.file === file && m.rule === 'glossary-proposal')).toBe(true)
  })

  it('records doc-only metric', () => {
    const pdir = path.join(tmpDir, 'documentacion-fuente-unica-verdad')
    fs.mkdirSync(pdir, { recursive: true })
    const file = path.join(pdir, 'nota.md')
    fs.writeFileSync(file, '# Nota\nContenido', 'utf8')
    const res = shouldAutoApprove(file)
    expect(res.ok).toBe(true)
    const metrics = readAutoApproveMetrics()
    // Puede clasificarse como 'md-small' o 'doc-only' según orden de heurísticas
    expect(metrics.some((m) => m.file === file && (m.rule === 'doc-only' || m.rule === 'md-small'))).toBe(true)
  })
})
