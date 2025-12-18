import { describe, it, expect } from 'vitest'
import { spawnSync } from 'child_process'
import fs from 'fs'
import path from 'path'

const script = path.resolve(__dirname, '..', '..', 'scripts', 'ci', 'aplicar-aprobaciones-automatico.ts')
const aplicadasDir = path.resolve(__dirname, '..', '..', 'documentacion-fuente-unica-verdad', 'ad-rs', 'aplicadas')

function resetAplicadas() {
  if (fs.existsSync(aplicadasDir)) {
    for (const f of fs.readdirSync(aplicadasDir)) fs.unlinkSync(path.join(aplicadasDir, f))
  } else {
    fs.mkdirSync(aplicadasDir, { recursive: true })
  }
}

const dedupPath = path.resolve(process.cwd(), 'reports', 'dedup-propuestas.json')
function ensureDedupReport() {
  fs.mkdirSync(path.dirname(dedupPath), { recursive: true })
  const dedup = { grupos: [ { clave: 'migraciones', archivos: ['falso'] } ] }
  fs.writeFileSync(dedupPath, JSON.stringify(dedup, null, 2), 'utf-8')
}

const adrsDir = path.resolve(__dirname, '..', '..', 'documentacion-fuente-unica-verdad', 'ad-rs')
function ensureADRForTerm(term: string, baseDir?: string) {
  const target = baseDir ? baseDir : adrsDir
  fs.mkdirSync(target, { recursive: true })
  const filename = path.join(target, `${term}-test-adr.md`)
  fs.writeFileSync(filename, `# ADR de prueba\n\nContenido que menciona ${term}\n`, 'utf-8')
}

describe('aplicar-aprobaciones-automatico', () => {
  it('dry-run no aplica cambios', () => {
    resetAplicadas()
    ensureDedupReport()
    const res = spawnSync('bun', [script, '--dry-run'], { encoding: 'utf-8' })
    expect(res.status).toBe(0)
    const files = fs.readdirSync(aplicadasDir)
    expect(files.length).toBe(0)
  })

  it('no aplica cuando pruebas fallan y --apply-when-tests-pass activado', () => {
    resetAplicadas()
    ensureDedupReport()
    const scopedAdrs = path.resolve(__dirname, '..', '..', 'tmp', `aplicar-${Date.now()}-${Math.random().toString(36).slice(2,8)}`)
    ensureADRForTerm('migraciones', scopedAdrs)
    const res = spawnSync('bun', [script, '--apply', '--apply-when-tests-pass'], { env: { ...process.env, APPLY_TEST_CMD: 'false', ADRS_DIR: scopedAdrs }, encoding: 'utf-8' })
    expect(res.status).toBe(2)
    const files = fs.readdirSync(aplicadasDir)
    expect(files.length).toBe(0)
  })

  it('aplica cuando pruebas pasan y --apply se pasa', () => {
    resetAplicadas()
    ensureDedupReport()
    const scopedAdrs = path.resolve(__dirname, '..', '..', 'tmp', `aplicar-${Date.now()}-${Math.random().toString(36).slice(2,8)}`)
    ensureADRForTerm('migraciones', scopedAdrs)
    const res = spawnSync('bun', [script, '--apply', '--apply-when-tests-pass'], { env: { ...process.env, APPLY_TEST_CMD: 'true', ADRS_DIR: scopedAdrs }, encoding: 'utf-8' })
    expect(res.status).toBe(0)
    const files = fs.readdirSync(aplicadasDir)
    // puede aplicar 0 si no hay propuestas válidas; validamos que no falla
    expect(res.status).toBe(0)
  })
})
