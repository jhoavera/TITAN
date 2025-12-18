#!/usr/bin/env ts-node
import process from 'process'
import path from 'path'
import { planRenombrados, aplicarRenombrados } from '../servicios/renombrar'

async function main() {
  const cmd = process.argv[2]
  const raiz = process.argv[3] ? path.resolve(process.argv[3]) : process.cwd()
  if (!cmd || (cmd !== 'plan' && cmd !== 'apply')) {
    console.error('Uso: renombrar-guiado <plan|apply> [ruta] [--force]')
    process.exit(1)
  }

  if (cmd === 'plan') {
    const planes = await planRenombrados(raiz)
    console.log('Planes detectados:')
    for (const p of planes) console.log(`- ${p.origen} → ${p.destino} (archivos: ${p.archivos.length})`)
    process.exit(0)
  }

  const force = process.argv.includes('--force')
  const res = await aplicarRenombrados(raiz, { fuerza: force })
  if (!res.applied) {
    console.log('No aplicado:', res.message)
    process.exit(2)
  }
  console.log('Renombrados aplicados en branch:', res.branch)
  if (res.prUrl) console.log('PR creada:', res.prUrl)
}

if (require.main === module) main().catch((e) => { console.error('Error:', e); process.exit(1) })
