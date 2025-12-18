#!/usr/bin/env bun
import path from 'path'
import process from 'process'
import { runIntegridadIdioma } from './integridad-idioma'
import { ensureRunningOnBunOrExit } from '../../src/comun/utilidades/verificar-stack'

async function main() {
  const raiz = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd()
  console.log('Integridad Idioma (Bun CLI) - raiz:', raiz)
  try {
    const res = await runIntegridadIdioma(raiz)
    console.log(`Hallazgos: ${res.hallazgos.length}`)
    console.log(JSON.stringify(res.resultados, null, 2))
  } catch (err:any) {
    console.error('Error:', err?.message ?? err)
    process.exit(1)
  }
}

if (import.meta.main) {
  ensureRunningOnBunOrExit()
  main()
}

export { main }
