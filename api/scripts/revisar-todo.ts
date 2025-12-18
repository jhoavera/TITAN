#!/usr/bin/env ts-node
import path from 'path'
import { runIntegridadIdioma } from './servicios/integridad-idioma'

async function main() {
  const raiz = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd()
  console.log('Iniciando revisión completa del repositorio (idioma, glosario, ADRs) en:', raiz)
  const { runAllChecks } = await import('./servicios/index')
  const integridad = await runAllChecks(raiz)
  console.log('Integridad idioma - hallazgos:', integridad.integridad.hallazgos.length)
  console.log('Integridad idioma - propuestas generadas:', integridad.integridad.resultados.length)
  console.log('Revisión completa finalizada.')
  process.exit(0)
}

main().catch(err => { console.error('Error en revisar-todo:', err); process.exit(1) })
