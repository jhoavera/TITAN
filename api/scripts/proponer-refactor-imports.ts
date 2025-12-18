#!/usr/bin/env bun
import path from 'path'
import fs from 'fs'
import { proposeRefactorImports } from '../src/servicios/proponer-refactor-imports'

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--apply') ? false : true
  const outDirArgIndex = args.findIndex((a) => a === '--out-dir')
  const outDir = outDirArgIndex >= 0 && args[outDirArgIndex + 1] ? path.resolve(process.cwd(), args[outDirArgIndex + 1]) : path.resolve(process.cwd(), '..', 'tmp', 'adrs-propuestas')

  console.log('Ejecutando generador de propuestas (dryRun=%s). Salida: %s', dryRun, outDir)

  const res = await proposeRefactorImports({ baseDir: path.resolve(process.cwd(), 'src'), outDir, dryRun })

  console.log(`Propuestas generadas: ${res.proposals.length}`)
  console.log(`Reporte: ${res.reportPath}`)
  for (const a of res.adrs) console.log('ADR (borrador):', a)

  const apply = args.includes('--apply')
  const applyChanges = args.includes('--apply-changes')
  const maxFilesArgIndex = args.findIndex((a) => a === '--max-files')
  const maxFiles = maxFilesArgIndex >= 0 ? Number(args[maxFilesArgIndex + 1]) : 5
  const force = args.includes('--force')
  const branchPrefixArgIndex = args.findIndex((a) => a === '--branch-prefix')
  const branchPrefix = branchPrefixArgIndex >= 0 && args[branchPrefixArgIndex + 1] ? args[branchPrefixArgIndex + 1] : 'proponer/imports'

  if (apply) {
    // copiar a documentacion-fuente-unica-verdad/ad-rs/propuestas pero SIN commitear
    const destDir = path.resolve(process.cwd(), '..', 'documentacion-fuente-unica-verdad', 'ad-rs', 'propuestas')
    console.log('Aplicando: copiando borradores a', destDir)
    for (const a of res.adrs) {
      const dest = path.join(destDir, path.basename(a) + '.propuesta')
      fs.copyFileSync(a, dest)
      console.log('Copiado:', dest)
    }
    console.log('Aplicación completada (archivos copiados, sin commit). Revise y comitee manualmente.')
  }

  if (applyChanges) {
    console.log('Aplicando cambios de código según propuestas (modo seguro)')
    const { isSafeToAutoApply, applyProposalChanges } = await import('../src/servicios/proponer-refactor-imports')

    for (const p of res.proposals) {
      const safe = isSafeToAutoApply(p, { maxFiles })
      if (!safe.ok && !force) {
        console.log(`Se omite ${p.id}: no cumple guard-rails: ${safe.reason}`)
        continue
      }

      const branchName = `${branchPrefix}/${p.id}`
      console.log(`Intentando aplicar propuesta ${p.id} en rama ${branchName} (force=${force}, dryRun=${dryRun})`)
      try {
        const result = applyProposalChanges(p, { baseDir: path.resolve(process.cwd(), 'src'), branchName, dryRun })
        console.log(`Resultado aplicar: applied=${result.applied}, testsOk=${result.testsOk}, rama=${result.branch}`)
      } catch (e) {
        console.error('Error al aplicar propuesta:', e)
      }
    }

    console.log('Proceso de aplicación de cambios finalizado. Revise ramas locales y PR drafts en .github/pr-drafts/')
  }
}



main().catch((e) => {
  console.error('Error al generar propuestas:', e)
  process.exit(1)
})
