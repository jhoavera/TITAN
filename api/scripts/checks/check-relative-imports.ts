#!/usr/bin/env bun
import { scanForRelativeImports } from '../../src/nucleo/indexacion/generador-indices-mcp'
import path from 'path'

async function main() {
  const base = path.resolve(process.cwd(), 'src')
  const res = await scanForRelativeImports(base)
  if (res.length === 0) {
    console.log('No se detectaron importaciones relativas en api/src')
    process.exitCode = 0
    return
  }
  console.log(`Importaciones relativas detectadas: ${res.length}`)
  for (const r of res) {
    console.log(`${r.file}:${r.line} => ${r.text}`)
  }
  process.exitCode = 2
}

main().catch((e) => {
  console.error('Error al escanear importaciones relativas:', e)
  process.exit(1)
})