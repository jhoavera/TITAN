#!/usr/bin/env bun
import fs from 'fs'
import path from 'path'
import { shouldAutoApprove as sharedShouldAutoApprove } from '@servicios/limpieza-utils'

function listPropuestasDir(): string {
  return path.resolve(__dirname, '../../../documentacion-fuente-unica-verdad/glosario-biblioteca/propuestas')
}

const argv = process.argv.slice(2)
const patternArg = argv.find(a => a.startsWith('--pattern='))
if (!patternArg) {
  console.error('Uso: chequea-batch.ts --pattern=<substring or regex>')
  process.exit(1)
}
const pattern = patternArg.split('=')[1]
const dir = listPropuestasDir()
if (!fs.existsSync(dir)) {
  console.error('No existe dir propuestas:', dir)
  process.exit(1)
}

const files = fs.readdirSync(dir).filter(f => f.endsWith('.md') && f.includes(pattern))
console.log(`Archivos coincidentes con patrón "${pattern}": ${files.length}`)
let ok=0, no=0
for (const f of files) {
  try {
    const full = path.join(dir, f)
    const res = sharedShouldAutoApprove(full, { maintainers: ['titan-admin','mantenedor','maintainer'], maxSizeForMaintainer: 800, allowLongTermAuto: true, longTermDays: 180 })
    if (res.ok) { ok++ } else { no++ }
    console.log(`${f} -> ${res.ok ? 'auto-apply OK' : 'requires manual'} (${res.reason || 'no-reason'})`)
  } catch (e) {
    console.error('error con', f, e)
  }
}
console.log(`Resumen: auto-apply OK: ${ok}, requires manual: ${no}`)
