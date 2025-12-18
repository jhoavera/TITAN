#!/usr/bin/env bun
import path from 'path'
import fs from 'fs'
import { generateIndexForType, scanForRelativeImports } from '../src/nucleo/indexacion/generador-indices-mcp'
import { proposeRefactorImports } from '../src/servicios/proponer-refactor-imports'

async function main() {
  const baseDir = path.resolve(process.cwd(), 'src')
  console.log('Generando índices automáticos en subdirectorios de', baseDir)

  function walk(dir: string) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, e.name)
      if (e.isDirectory()) {
        if (['node_modules', '.git', 'dist', 'build'].includes(e.name)) continue
        const tsFiles = fs.readdirSync(full).filter((f) => /\.(ts|tsx)$/.test(f))
        if (tsFiles.length > 0) {
          try {
            generateIndexForType(full)
            console.log('Indice generado en', full)
          } catch (e) {}
        }
        walk(full)
      }
    }
  }

  walk(baseDir)

  // Run relative import scanner and propose ADRs
  console.log('Escaneando importaciones relativas para proponer refactor a alias...')
  const outDir = path.resolve(process.cwd(), '..', '..', 'tmp', 'adrs-propuestas')
  const res = await proposeRefactorImports({ baseDir, outDir, dryRun: true })
  console.log(`Propuestas generadas: ${res.proposals.length}. Report: ${res.reportPath}`)
}

if (require.main === module) { main().catch((e) => { console.error(e); process.exit(1) }) }
