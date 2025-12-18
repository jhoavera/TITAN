import { describe, it, expect, beforeEach } from 'vitest'
import { spawnSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const script = path.resolve(__dirname, '..', '..', 'scripts', 'ci', 'auto-apply-flow.ts')
const reportsDir = path.resolve(__dirname, '..', '..', 'reports')
const aplicadasDir = path.resolve(__dirname, '..', '..', 'documentacion-fuente-unica-verdad', 'ad-rs', 'aplicadas')
const dedupPath = path.join(reportsDir, 'dedup-propuestas.json')

function ensureReportsDir() { if (!fs.existsSync(reportsDir)) fs.mkdirSync(reportsDir, { recursive: true }) }
function resetAplicadas() { if (fs.existsSync(aplicadasDir)) { for (const f of fs.readdirSync(aplicadasDir)) fs.unlinkSync(path.join(aplicadasDir, f)) } else { fs.mkdirSync(aplicadasDir, { recursive: true }) } }

beforeEach(() => {
  ensureReportsDir()
  resetAplicadas()
  // create a minimal dedup report so proposals exist
  const dedup = { grupos: [ { clave: 'migraciones', archivos: ['falso'] } ] }
  fs.writeFileSync(dedupPath, JSON.stringify(dedup, null, 2), 'utf-8')
})

describe('auto-apply-flow E2E', () => {
  it('dry-run no aplica cambios', () => {
    const res = spawnSync('bun', [script, '--dry-run'], { encoding: 'utf-8' })
    expect(res.status).toBe(0)
    const files = fs.readdirSync(aplicadasDir)
    expect(files.length).toBe(0)
  }, 20000)

  it('apply bloquea cuando las pruebas fallan con --apply-when-tests-pass', () => {
    const res = spawnSync('bun', [script, '--apply', '--apply-when-tests-pass'], { env: { ...process.env, APPLY_TEST_CMD: 'false' }, encoding: 'utf-8' })
    expect(res.status).toBe(2)
    const files = fs.readdirSync(aplicadasDir)
    expect(files.length).toBe(0)
  }, 20000)

  it('apply funciona cuando pruebas pasan con --apply-when-tests-pass', () => {
    const res = spawnSync('bun', [script, '--apply', '--apply-when-tests-pass'], { env: { ...process.env, APPLY_TEST_CMD: 'true' }, encoding: 'utf-8' })
    // status 0 or 0+ (aplica o no hay propuestas aptas). Confirm no error code
    expect(res.status).toBe(0)
  }, 20000)
})
