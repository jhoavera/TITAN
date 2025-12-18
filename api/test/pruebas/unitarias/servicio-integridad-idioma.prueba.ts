import { describe, it, expect, beforeEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import { escanearRepositorioParaIngles, procesarHallazgosYGenerarPropuestas } from '../../../src/nucleo/servicios/servicio-integridad-idioma'

describe('Servicio integridad idioma', () => {
  const tmp = path.join(process.cwd(), 'test-temp-idioma')
  beforeEach(async () => {
    await fs.promises.rm(tmp, { recursive: true, force: true }).catch(() => {})
    await fs.promises.mkdir(tmp, { recursive: true })
    // crear estructura con nombres y contenidos en inglés
    await fs.promises.mkdir(path.join(tmp, 'migraciones'))
    await fs.promises.writeFile(path.join(tmp, 'migraciones', '0001_create_table.sql'), '-- migracion: create table test')
    // El servicio debe recomendar renombrar a 'migraciones' en español
    await fs.promises.writeFile(path.join(tmp, 'docker-compose.yml'), 'volumes:\n  - ./src:/migraciones')
  })

  it('detecta palabras inglesas en nombres y contenido y genera propuestas', async () => {
    const hallazgos = await escanearRepositorioParaIngles(tmp)
    expect(hallazgos.length).toBeGreaterThan(0)
    const res = await procesarHallazgosYGenerarPropuestas(process.cwd(), hallazgos)
    expect(res.length).toBeGreaterThan(0)
    // verificar que se creó ADR para al menos un término
    const existeAdr = res.some(r => !!r.adr)
    expect(existeAdr).toBe(true)
  })
})
