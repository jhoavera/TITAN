import { describe, it, beforeEach, afterEach, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import { crearADRFromPayload } from '@scripts/cli/crear-adr'
import { obtenerDb, inicializarDb } from '@infraestructura/base-de-datos/cliente'

const TMP = path.resolve(__dirname, 'tmp-adrs')
const ADRS_DIR_ENV = TMP

beforeEach(() => {
  fs.rmSync(TMP, { recursive: true, force: true })
  fs.mkdirSync(TMP, { recursive: true })
  const db = obtenerDb() as any
  inicializarDb(db)
})

afterEach(() => {
  fs.rmSync(TMP, { recursive: true, force: true })
})

describe('CLI crear-adr', () => {
  it('crea entrada en BD en dry-run sin escribir archivo', async () => {
    const payload = { numero: 2, titulo: 'Decidir esquema de autenticación', objetivo: 'Definir esquema OAuth2 o JWT', decision: 'Se propone JWT por simplicidad' }
    process.env.ADRS_DIR_OVERRIDE = ADRS_DIR_ENV
    const res = await crearADRFromPayload(payload, { apply: false, autorId: 'test' })
    expect(res.creado).toBeDefined()
    expect(res.archivo).toBeNull()
  })

  it('crea entrada y archivo cuando apply=true', async () => {
    const payload = { numero: 3, titulo: 'Decidir motor de búsqueda', objetivo: 'Seleccionar DB vectorial para embebidos', decision: 'Se propone Qdrant por aceleración GPU y compatibilidad' }
    process.env.ADRS_DIR_OVERRIDE = ADRS_DIR_ENV
    const res = await crearADRFromPayload(payload, { apply: true, autorId: 'test' })
    expect(res.creado).toBeDefined()
    expect(res.archivo).toBeTruthy()
    expect(fs.existsSync(res.archivo!)).toBe(true)
    const txt = fs.readFileSync(res.archivo!, 'utf8')
    expect(txt).toContain('Decidir motor de búsqueda')
  })
})
