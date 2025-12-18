#!/usr/bin/env ts-node
import process from 'process'
import { validarYRegistrarNombre } from '../src/nucleo/servicios/servicio-validacion-creacion'

async function main() {
  const name = process.argv[2]
  const tipo = process.argv[3] ?? 'glosario'
  if (!name) {
    console.error('Uso: validar-crear <nombre> [tipo]')
    process.exit(2)
  }
  const res = await validarYRegistrarNombre(name, tipo)
  console.log('Resultado validación:', res)
}

main().catch(e => { console.error(e); process.exit(1) })
