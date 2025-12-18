import { describe, it, expect } from 'vitest'
import ServicioADRIntegrado from '../../../src/servicios/adr/servicio-adr-integrado'
import path from 'path'
import fs from 'fs'

const TMP = path.join(process.cwd(), 'tmp', 'test-adr-integrado')

describe('ServicioADR (integración básica)', () => {
  it('crea un ADR y escribe el archivo en el directorio por defecto', async () => {
    fs.rmSync(TMP, { recursive: true, force: true })
    const svc = new ServicioADRIntegrado(TMP)
    const res = await svc.crearADR({ titulo: 'Prueba integrada', autor: 'tester', objetivo: 'probar', decision: 'aceptar' }, { commit: false })
    // En modo FS la respuesta debe contener id y titulo
    expect(res).toBeDefined()
    // listar en FS devuelve archivo
    const list = await svc.listarADR()
    expect(list.length).toBeGreaterThanOrEqual(1)
  })
})
