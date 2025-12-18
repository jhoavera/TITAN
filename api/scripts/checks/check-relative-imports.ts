#!/usr/bin/env bun
import fs from 'fs'
import path from 'path'
import { scanForRelativeImports } from '@nucleo/indexacion/generador-indices-mcp'

async function main() {
  const bases = [path.resolve(process.cwd(), 'src'), path.resolve(process.cwd(), 'test'), path.resolve(process.cwd(), 'tests')]
  let total: Awaited<ReturnType<typeof scanForRelativeImports>> = []

  for (const base of bases) {
    if (!base.includes(path.sep)) continue
    if (!fs.existsSync(base)) continue
    const res = await scanForRelativeImports(base)
    total = total.concat(res)
  }

  if (total.length === 0) {
    console.log('No se detectaron importaciones relativas en api/src ni en api/test(s)')
    process.exitCode = 0
    return
  }

  console.log(`Importaciones relativas detectadas: ${total.length}`)
  for (const r of total) {
    console.log(`${r.file}:${r.line} => ${r.text}`)
  }
  process.exitCode = 2
}

main().catch((e) => {
  console.error('Error al escanear importaciones relativas:', e)
  process.exit(1)
})