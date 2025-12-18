import { describe, it, expect, beforeAll } from 'vitest'
import { spawnSync } from 'child_process'
import path from 'path'
import fs from 'fs'
import ServicioADRIntegrado from '../../src/servicios/adr/servicio-adr-integrado'

const TMP = path.join(process.cwd(), 'tmp', 'test-adr-migration')

describe('E2E: migración ADR FS → DB', () => {
  beforeAll(() => {
    if (!process.env.TEST_DATABASE_URL) throw new Error('TEST_DATABASE_URL no definido para E2E')
    // aplicar migraciones (script idempotente)
    const res = spawnSync('bun', ['run', 'test:db:migrate'], { stdio: 'inherit', cwd: path.join(process.cwd()) })
    if (res.status !== 0) throw new Error('No se pudo aplicar migraciones de prueba')

    // preparar carpeta de ADRs temporal
    fs.rmSync(TMP, { recursive: true, force: true })
    fs.mkdirSync(TMP, { recursive: true })
  })

  it('migra los ADRs de filesystem a la DB y los archiva', async () => {
    // crear 2 archivos ADR de ejemplo
    const contenido1 = `# ADR adr-1 - Título de prueba 1\n\n**Autor:** prueba\n**Fecha:** 2025-01-01\n**Estado:** pendiente\n\n## Contexto\n\nContexto\n\n## Objetivo\n\nObjetivo 1\n\n## Decisión\n\nDecisión 1\n\n## Consecuencias\n\n- \n`
    const contenido2 = `# ADR adr-2 - Título de prueba 2\n\n**Autor:** prueba\n**Fecha:** 2025-01-02\n**Estado:** pendiente\n\n## Contexto\n\nContexto\n\n## Objetivo\n\nObjetivo 2\n\n## Decisión\n\nDecisión 2\n\n## Consecuencias\n\n- \n`
    const ruta1 = path.join(TMP, '2025-01-01-titulo-prueba-1-adr-1.md')
    const ruta2 = path.join(TMP, '2025-01-02-titulo-prueba-2-adr-2.md')
    fs.writeFileSync(ruta1, contenido1, 'utf8')
    fs.writeFileSync(ruta2, contenido2, 'utf8')

    // instanciar servicio apuntando a TMP
    const svc = new ServicioADRIntegrado(TMP, process.env.TEST_DATABASE_URL)
    const migrados = await svc.migrarFSaDB('default')

    expect(migrados.length).toBe(2)

    // comprobar que archivos movidos a archivado
    const archivado = path.join(TMP, 'archivado')
    const listArchivado = fs.readdirSync(archivado).filter((f) => f.endsWith('.md'))
    expect(listArchivado.length).toBe(2)

    // comprobar que la DB contiene las entradas
    const filas = await svc.listarADR({ identificadorInquilino: 'default' })
    expect(filas.length).toBeGreaterThanOrEqual(2)
  })
})
