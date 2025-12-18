#!/usr/bin/env bun
import { spawnSync } from 'child_process'
import path from 'path'
import fs from 'fs'

const argv = process.argv.slice(2)
const dryRun = argv.includes('--dry-run') || !argv.includes('--apply')
const apply = argv.includes('--apply')
const testGuard = argv.includes('--apply-when-tests-pass')
const applyTestCmdEnv = process.env.APPLY_TEST_CMD || 'bun test'

function runCommand(cmd: string, args: string[] = [], opts: any = {}) {
  console.log(`> Ejecutando: ${cmd} ${args.join(' ')}`)
  const res = spawnSync(cmd, args, { stdio: 'inherit', ...opts })
  if (res.error) throw res.error
  return res.status ?? 0
}

async function main() {
  console.log('[auto-apply-flow] Iniciando orquestación E2E (detectar -> dedup -> proponer -> aplicar)')

  // 1) Detectar (revisar-idioma en modo dry-run)
  console.log('[auto-apply-flow] Paso 1: detectar (revisar-idioma - dry-run)')
  runCommand('bun', ['./scripts/revisar-idioma.ts', '--dry-run'])

  // 2) Deduplicar propuestas
  console.log('[auto-apply-flow] Paso 2: deduplicar propuestas')
  runCommand('bun', ['./scripts/ci/deduplicar-propuestas.ts'])

  // 3) Generar propuestas de aprobación (servicio)
  console.log('[auto-apply-flow] Paso 3: generar propuestas de aprobacion')
  runCommand('bun', ['./scripts/ci/proponer-aprobacion-adrs.ts', '--report-only'])

  // 4) Revisar propuestas y opcionalmente aplicar
  console.log('[auto-apply-flow] Paso 4: revisar propuestas y (opcional) aplicar')

  if (dryRun) {
    // solo informe: leer reports/propuestas-aprobacion-posible.json si existe
    const reportPath = path.resolve(process.cwd(), 'reports', 'propuestas-aprobacion-posible.json')
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
    const testStatus = runCommand('sh', ['-c', applyTestCmdEnv], { env: { ...process.env } })
    if (testStatus !== 0) {
      console.error('[auto-apply-flow] Las pruebas fallaron. No se aplicarán cambios.')
      process.exit(2)
    }
  }

  // Llamar al CLI seguro de aplicación de aprobaciones
  console.log('[auto-apply-flow] Ejecutando aplicador de aprobaciones (modo apply)')
  const status = runCommand('bun', ['./scripts/ci/aplicar-aprobaciones-automatico.ts', '--apply'])
  process.exit(status)
}

main().catch((err) => {
  console.error('[auto-apply-flow] Error:', err)
  process.exit(1)
})
