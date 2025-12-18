import { describe, it, beforeEach, afterEach, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const SCRIPT = path.resolve(__dirname, '../../scripts/cli/gestionar-glosario.ts')
const TMP = path.resolve(__dirname, 'tmp-gestionar-glosario')
const GLOSARIO_DIR = path.join(TMP, 'documentacion-fuente-unica-verdad', 'glosario-biblioteca', 'terminos')
const INDICE = path.join(TMP, 'documentacion-fuente-unica-verdad', 'glosario-biblioteca', 'glosario-indice.md')

beforeEach(() => {
  fs.rmSync(TMP, { recursive: true, force: true })
  fs.mkdirSync(GLOSARIO_DIR, { recursive: true })
})

afterEach(() => {
  fs.rmSync(TMP, { recursive: true, force: true })
})

describe('CLI gestionar-glosario', () => {
  it('crear y lista término (archivo e índice)', async () => {
    const mod = await import('../../scripts/cli/gestionar-glosario')
    const res = await mod.runCli(['crear','TerminoPrueba','Definición de prueba para terminos'], { raiz: TMP })
    expect(res.created).toBeTruthy()
    const files = fs.readdirSync(GLOSARIO_DIR)
    expect(files.length).toBeGreaterThanOrEqual(1)
    const index = fs.readFileSync(INDICE, 'utf8')
    expect(index).toContain('TerminoPrueba')
  })
})
