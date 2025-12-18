#!/usr/bin/env bun
import { summarizeAutoApproveMetrics, rotateAutoApproveMetrics } from '../../src/nucleo/telemetria/auto-approve-metrics'
import fs from 'fs'
import path from 'path'

function parseArgs(): Record<string, string | boolean> {
  const args = process.argv.slice(2)
  const out: Record<string, string | boolean> = {}
  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (a === '--rotate-days' && args[i + 1]) { out['rotateDays'] = args[++i]; continue }
    if (a === '--since' && args[i + 1]) { out['since'] = args[++i]; continue }
    if (a === '--until' && args[i + 1]) { out['until'] = args[++i]; continue }
    if (a === '--json') { out['json'] = true; continue }
    if (a === '--write-summary') { out['write'] = true; continue }
  }
  return out
}

function main() {
  const args = parseArgs()
  const since = typeof args['since'] === 'string' ? args['since'] as string : undefined
  const until = typeof args['until'] === 'string' ? args['until'] as string : undefined
  const summary = summarizeAutoApproveMetrics({ since, until })

  if (args['json']) {
    const outStr = JSON.stringify(summary, null, 2)
    console.log(outStr)
    if (args['write']) {
      const outDir = path.resolve(process.cwd(), 'tmp', 'metrics')
      fs.mkdirSync(outDir, { recursive: true })
      const outPath = path.join(outDir, `auto-approve-summary-${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.json`)
      fs.writeFileSync(outPath, outStr, 'utf8')
      console.log('Resumen escrito en', outPath)
    }
  } else {
    console.log('Resumen métricas auto-approve:')
    console.log(`  • total: ${summary.total}  ok: ${summary.ok}  nok: ${summary.nok}`)
    console.log('  • por regla:')
    for (const [k, v] of Object.entries(summary.byRule)) {
      console.log(`    - ${k}: ${v.count} (ok: ${v.ok}, nok: ${v.nok})`)
    }
    console.log('  • por razón (top 10):')
    const reasons = Object.entries(summary.byReason).sort((a,b)=>b[1]-a[1]).slice(0,10)
    for (const [r, c] of reasons) console.log(`    - ${r}: ${c}`)
  }

  if (args['rotateDays']) {
    const n = Number(args['rotateDays']) || 30
    const res = rotateAutoApproveMetrics(n)
    console.log(`Rotación: ${res.rotated} líneas movidas`, res.archivePath ? `→ ${res.archivePath}` : '')
  }
}

if (require.main === module) main()
