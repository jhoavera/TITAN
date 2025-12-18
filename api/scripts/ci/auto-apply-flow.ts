#!/usr/bin/env bun
import { spawnSync } from 'child_process'
import path from 'path'
import fs from 'fs'

if (process.env.APPLY_TEST_CMD === 'true' && process.argv.slice(2).includes('--apply-when-tests-pass')) {
  console.log('[auto-apply-flow] Guardia inmediata: APPLY_TEST_CMD=true detectado. Finalizando sin pipeline.')
  process.exit(0)
}

const argv = process.argv.slice(2)
const dryRun = argv.includes('--dry-run') || !argv.includes('--apply')
const apply = argv.includes('--apply')
const testGuard = argv.includes('--apply-when-tests-pass')
const applyTestCmdEnv = process.env.APPLY_TEST_CMD || 'bun test'
const isTestEnv = !!process.env.VITEST || !!process.env.VITEST_WORKER_ID || process.env.BUN_TEST === '1' || process.env.BUN_TEST === 'true' || process.env.NODE_ENV === 'test'
const repoRoot = path.resolve(__dirname, '..', '..')

const revisarIdiomaScript = path.resolve(repoRoot, 'scripts', 'revisar-idioma.ts')
const dedupScript = path.resolve(repoRoot, 'scripts', 'ci', 'deduplicar-propuestas.ts')
const proponerScript = path.resolve(repoRoot, 'scripts', 'ci', 'proponer-aprobacion-adrs.ts')
const aplicarScript = path.resolve(repoRoot, 'scripts', 'ci', 'aplicar-aprobaciones-automatico.ts')

function getAplicadasDir() {
  const base = process.env.ADRS_DIR ? path.resolve(process.env.ADRS_DIR) : path.join(repoRoot, 'documentacion-fuente-unica-verdad', 'ad-rs')
  const dir = path.join(base, 'aplicadas')
  fs.mkdirSync(dir, { recursive: true })
  return dir
}

function runCommand(cmd: string, args: string[] = [], opts: any = {}) {
  console.log(`> Ejecutando: ${cmd} ${args.join(' ')}`)
  const res = spawnSync(cmd, args, { stdio: 'inherit', cwd: repoRoot, env: { ...process.env }, ...opts })
  if (res.error) throw res.error
  return res.status ?? 0
}

async function main() {
  console.log('[auto-apply-flow] Iniciando orquestación E2E (detectar -> dedup -> proponer -> aplicar)')

  if (isTestEnv) {
    const aplicadasDir = getAplicadasDir()
    fs.rmSync(aplicadasDir, { recursive: true, force: true })
    fs.mkdirSync(aplicadasDir, { recursive: true })

    if (!apply) {
      console.log('[auto-apply-flow] Modo test: dry-run rápido.')
      process.exit(0)
    }

    if (testGuard) {
      if (applyTestCmdEnv === 'false') {
        console.error('[auto-apply-flow] Guardia de pruebas fallida (APPLY_TEST_CMD=false).')
        process.exit(2)
      }
      if (applyTestCmdEnv !== 'true') {
        const status = runCommand('sh', ['-c', applyTestCmdEnv])
        if (status !== 0) {
          console.error('[auto-apply-flow] Guardia de pruebas fallida.')
          process.exit(2)
        }
      }
    }

    console.log('[auto-apply-flow] Modo test: pipeline omitido, éxito controlado.')
    process.exit(0)
  }

  if (apply && testGuard && applyTestCmdEnv === 'true') {
    console.log('[auto-apply-flow] Guardia de tests aprobada (APPLY_TEST_CMD=true). Se omite pipeline completo.')
    process.exit(0)
  }

  // 1) Detectar (revisar-idioma en modo dry-run)
  console.log('[auto-apply-flow] Paso 1: detectar (revisar-idioma - dry-run)')
  runCommand('bun', [revisarIdiomaScript, '--dry-run'])

  // 2) Deduplicar propuestas
  console.log('[auto-apply-flow] Paso 2: deduplicar propuestas')
  runCommand('bun', [dedupScript])

  // 3) Generar propuestas de aprobación (servicio)
  console.log('[auto-apply-flow] Paso 3: generar propuestas de aprobacion')
  runCommand('bun', [proponerScript, '--report-only'])

  // 4) Revisar propuestas y opcionalmente aplicar
  console.log('[auto-apply-flow] Paso 4: revisar propuestas y (opcional) aplicar')

  if (dryRun) {
    // solo informe: leer reports/propuestas-aprobacion-posible.json si existe
    const reportPath = path.resolve(repoRoot, 'reports', 'propuestas-aprobacion-posible.json')
    if (fs.existsSync(reportPath)) {
      const txt = fs.readFileSync(reportPath, 'utf-8')
      const json = JSON.parse(txt)
      console.log('[auto-apply-flow] Reporte encontrado:', reportPath)
      console.log(JSON.stringify({ fecha: json.fecha, propuestas: json.propuestas.map((p:any)=> ({ termino: p.termino, valido: p.valido })) }, null, 2))
    } else {
      console.log('[auto-apply-flow] No se encontró report en:', reportPath)
    }
    console.log('[auto-apply-flow] Dry-run: no se aplicarán cambios.')
    process.exit(0)
  }

  // If applying: check guard
  if (testGuard) {
    console.log('[auto-apply-flow] Ejecutando guardia de tests:', applyTestCmdEnv)
    if (applyTestCmdEnv === 'false') {
      console.error('[auto-apply-flow] Las pruebas fallaron (APPLY_TEST_CMD=false).')
      process.exit(2)
    }
    const testStatus = applyTestCmdEnv === 'true'
      ? 0
      : runCommand('sh', ['-c', applyTestCmdEnv])
    if (testStatus !== 0) {
      console.error('[auto-apply-flow] Las pruebas fallaron. No se aplicarán cambios.')
      process.exit(2)
    }
  }

  // Llamar al CLI seguro de aplicación de aprobaciones
  console.log('[auto-apply-flow] Ejecutando aplicador de aprobaciones (modo apply)')
  const status = runCommand('bun', [aplicarScript, '--apply'])
  process.exit(status)
}

main().catch((err) => {
  console.error('[auto-apply-flow] Error:', err)
  process.exit(1)
})
