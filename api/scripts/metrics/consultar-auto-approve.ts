#!/usr/bin/env bun
import { readAutoApproveMetrics } from '@nucleo/telemetria/auto-approve-metrics'

function main() {
  const metrics = readAutoApproveMetrics()
  if (metrics.length === 0) {
    console.log('No hay métricas de auto-approve registradas')
    return
  }
  const summary: Record<string, {count:number, last?:string}> = {}
  for (const m of metrics) {
    const k = m.rule || 'unknown'
    summary[k] = summary[k] || { count: 0 }
    summary[k].count++
    summary[k].last = m.ts
  }
  console.log('Resumen métricas auto-approve:')
  for (const [k, v] of Object.entries(summary)) {
    console.log(`  • ${k}: ${v.count} (últ: ${v.last})`)
  }
}

if (require.main === module) {
  main()
}