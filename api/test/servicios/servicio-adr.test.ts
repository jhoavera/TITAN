import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import { ServicioADR } from '@servicios/servicio-adr'

const tmpRoot = path.resolve(__dirname, 'tmp-adr-service')
if (!fs.existsSync(tmpRoot)) fs.mkdirSync(tmpRoot, { recursive: true })

beforeEach(() => {
  for (const f of fs.readdirSync(tmpRoot)) fs.unlinkSync(path.join(tmpRoot, f))
})

afterEach(() => {
  for (const f of fs.readdirSync(tmpRoot)) fs.unlinkSync(path.join(tmpRoot, f))
})

describe('ServicioADR (integración básica)', () => {
  it('crea un ADR y escribe el archivo en el directorio por defecto', () => {
    // usar ServicioADRCRUD directamente para apuntar al tmp
    const ServicioADRCRUD = require('@servicios/adr-crud').default.ServicioADRCRUD
    const crud = new ServicioADRCRUD(tmpRoot)
    const servicio = new ServicioADR(crud)
    const meta = servicio.crearYCommit('Prueba ADR', 'dev-titan', 'Contenido de prueba', { commitMsg: 'test: crear ADR' })
    const esperado = meta.ruta
    expect(fs.existsSync(esperado)).toBe(true)
    const contenido = fs.readFileSync(esperado, 'utf8')
    expect(contenido).toContain('# ADR')
    expect(contenido).toContain('Prueba ADR')
  })
})
