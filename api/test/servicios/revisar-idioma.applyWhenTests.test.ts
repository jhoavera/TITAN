import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import { main } from '../../scripts/revisar-idioma'

const tmpGlosario = path.resolve(__dirname, '..', '..', 'tmp-glosario.json')

function readTmp() {
  try { return JSON.parse(fs.readFileSync(tmpGlosario, 'utf-8')) } catch (e) { return [] }
}

function resetTmp() { fs.writeFileSync(tmpGlosario, JSON.stringify([], null, 2), 'utf-8') }

describe('revisar-idioma --apply-when-tests-pass', () => {
  beforeEach(() => { resetTmp() })
  afterEach(() => { resetTmp() })

  it('no aplica cuando las pruebas fallan (APPLY_TEST_CMD=false)', async () => {
    const raiz = path.resolve(__dirname, 'fixtures', 'metrics')
    process.env.APPLY_TEST_CMD = 'false'
    process.env.TITAN_TMP_GLOSARIO = tmpGlosario
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    await main(raiz)
    const tmp = readTmp()
    expect(tmp.length).toBe(0)
  })

  it('aplica cuando las pruebas pasan (APPLY_TEST_CMD=true)', async () => {
    // Crear pequeño directorio de prueba con contenido que contenga el término 'migrations'
    const pruebaDir = path.resolve(__dirname, 'tmp-revisar-idioma')
    if (!fs.existsSync(pruebaDir)) fs.mkdirSync(pruebaDir, { recursive: true })
    const pruebaFile = path.join(pruebaDir, 'doc.md')
    fs.writeFileSync(pruebaFile, 'This file mentions migrations in context.', 'utf8')

    const raiz = pruebaDir
    process.env.APPLY_TEST_CMD = 'true'
    process.env.TITAN_TMP_GLOSARIO = tmpGlosario

    // Asegurar que el flag se detecta cuando se llama por la API
    const origArgv = process.argv.slice()
    process.argv = [...process.argv.slice(0, 1), '--apply-when-tests-pass']
    try {
      await main(raiz)
    } finally {
      process.argv = origArgv
    }

    const tmp = readTmp()
    // Limpiar prueba
    try { fs.unlinkSync(pruebaFile); fs.rmdirSync(pruebaDir) } catch (e) {}

    expect(tmp.length).toBeGreaterThan(0)
  })
})
