import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { Client } from 'pg'
import fs from 'fs'
import path from 'path'
import { hayTriggersAuditoria } from '../../../src/infraestructura/base-de-datos/utilidades/chequeo-auditoria'

const DOCKER_COMPOSE_FILE = path.resolve(__dirname, '../../..', 'docker-compose.local.yml')

async function startDockerCompose() {
  // start container
  const { exec } = await import('child_process')
  return new Promise<void>((resolve, reject) => {
    exec(`docker compose -f "${DOCKER_COMPOSE_FILE}" up -d`, { cwd: path.resolve(__dirname, '../../..') }, (err, stdout, stderr) => {
      if (err) return reject(err)
      resolve()
    })
  })
}

async function stopDockerCompose() {
  const { exec } = await import('child_process')
  return new Promise<void>((resolve, reject) => {
    exec(`docker compose -f "${DOCKER_COMPOSE_FILE}" down -v --remove-orphans`, { cwd: path.resolve(__dirname, '../../..') }, (err, stdout, stderr) => {
      if (err) return reject(err)
      resolve()
    })
  })
}

describe('DB integration: aplicar migraciones 0001 + 0002 y verificar triggers de auditoría', () => {
  let client: Client
  beforeAll(async () => {
    await startDockerCompose()
    // wait for pg to be ready
    const max = 30
    for (let i = 0; i < max; i++) {
      try {
        client = new Client({ host: '127.0.0.1', port: 5433, user: 'postgres', password: 'postgres' })
        await client.connect()
        break
      } catch (err) {
        await new Promise(r => setTimeout(r, 1000))
      }
    }
    if (!client) throw new Error('No se pudo conectar a Postgres')

    // Ejecutar migraciones 0001 y 0002 en orden
    const migracionesDir = path.resolve(__dirname, '../../../src/infraestructura/base-de-datos/migraciones')
    const files = ['0001_crear_tablas_glosario_adrs.sql', '0002_triggers_auditoria.sql']
    for (const f of files) {
      const sql = fs.readFileSync(path.join(migracionesDir, f), 'utf8')
      await client.query(sql)
    }
  }, 60_000)

  afterAll(async () => {
    if (client) await client.end()
    await stopDockerCompose()
  })

  it('debe haber creado la función y triggers de auditoría (migración 0002)', async () => {
    const res = await client.query(`SELECT proname FROM pg_proc WHERE proname = 'fn_registrar_auditoria'`)
    expect(res.rows.length).toBeGreaterThan(0)
    const trg = await client.query(`SELECT tgname FROM pg_trigger WHERE tgname IN ('tg_auditar_glosario','tg_auditar_adrs')`)
    expect(trg.rows.length).toBeGreaterThan(0)
  })

  it('al insertar ADR la auditoría se registra vía trigger', async () => {
    const tenant = '00000000-0000-0000-0000-000000000001'
    await client.query(`SET app.identificador_inquilino_actual = '${tenant}'`)
    const insertRes = await client.query(`INSERT INTO public.adrs (identificador_inquilino, numero, slug, titulo, autor_id, objetivo, decision) VALUES ('${tenant}', 9999, 'slug-9999', 'titulo prueba', gen_random_uuid(), 'objetivo prueba', 'decision prueba') RETURNING id`)
    const id = insertRes.rows[0].id
    const audits = await client.query(`SELECT * FROM public.auditoria_cambios WHERE entidad = 'adrs' AND entidad_id = '${id}'`)
    expect(audits.rows.length).toBeGreaterThan(0)
  })

  it('hayTriggersAuditoria debe devolver true en este DB', async () => {
    // Provide a thin db adapter compatible with hayTriggersAuditoria
    const adapter = { query: async (sql: string) => client.query(sql) }
    const res = await (hayTriggersAuditoria as any)(adapter)
    expect(res).toBe(true)
  })
})
