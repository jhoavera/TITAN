#!/usr/bin/env bun
import ServicioADRIntegrado from '../../src/servicios/adr/servicio-adr-integrado'

async function main() {
  const svc = new ServicioADRIntegrado(undefined, process.env.TEST_DATABASE_URL ?? process.env.DATABASE_URL)
  try {
    const migrados = await svc.migrarFSaDB(process.env.TEST_INQUILINO ?? 'default')
    console.log(`Migrados ${migrados.length} ADRs:`, migrados)
    process.exit(0)
  } catch (err) {
    console.error('Error al migrar ADRs:', (err as Error).message)
    process.exit(2)
  }
}

if (import.meta.main) main()
