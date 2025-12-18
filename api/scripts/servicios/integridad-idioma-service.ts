#!/usr/bin/env node
import path from 'path'
import process from 'process'
import { escanearRepositorioParaIngles, procesarHallazgosYGenerarPropuestas } from '../../src/nucleo/servicios/servicio-integridad-idioma'

async function main() {
  const raiz = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd()
  console.log('Servicio Integridad Idioma - raiz:', raiz)

  try {
    const hallazgos = await escanearRepositorioParaIngles(raiz)
    console.log(`Hallazgos detectados: ${hallazgos.length}`)
    if (hallazgos.length === 0) return console.log('No hay hallazgos.')
    const resultados = await procesarHallazgosYGenerarPropuestas(raiz, hallazgos)
    console.log('Resultados:', JSON.stringify(resultados, null, 2))
  } catch (e:any) {
    console.error('Error ejecutando servicio de integridad idioma:', e?.message ?? e)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}

export default { main }
