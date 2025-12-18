import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { execSync } from 'child_process'

describe('Migración Ops: paridad Fastify <-> Hono', () => {
  let honoApp: any
  let fastifyApp: any
  let tmpDirFast: string
  let tmpDirHono: string

  beforeEach(async () => {
    tmpDirFast = fs.mkdtempSync(path.join(os.tmpdir(), 'titan-ops-fast-'))
    tmpDirHono = fs.mkdtempSync(path.join(os.tmpdir(), 'titan-ops-hono-'))

    // preparar repos git mínimos en ambos roots
    for (const d of [tmpDirFast, tmpDirHono]) {
      execSync('git init -b main', { cwd: d })
      fs.writeFileSync(path.join(d, 'README.md'), '# tmp repo')
      execSync('git add -A', { cwd: d })
      execSync('git commit -m "init"', { cwd: d })
    }

    const servidor = await import('../../../src/infraestructura/servidor/servidor-hono')
    honoApp = servidor.default

    const { crearFastifyCompat } = await import('../../helpers/fastify-compat')
    fastifyApp = crearFastifyCompat()
    const rutaOps = await import('../../../src/infraestructura/servidor/rutas/ops')
    await rutaOps.default(fastifyApp)
  })

  afterEach(async () => {
    try { fs.rmSync(tmpDirFast, { recursive: true }) } catch (_) {}
    try { fs.rmSync(tmpDirHono, { recursive: true }) } catch (_) {}
    if (honoApp && typeof honoApp.close === 'function') await honoApp.close()
    if (fastifyApp && typeof fastifyApp.close === 'function') await fastifyApp.close()
  })

  it('Parity: renombrado por ADR debería coincidir entre Fastify y Hono', async () => {
    // crear ADR aprobado en cada root
    const adrPathFast = path.join(tmpDirFast, 'docs', 'example-adr.md')
    const adrPathHono = path.join(tmpDirHono, 'docs', 'example-adr.md')
    await fs.promises.mkdir(path.dirname(adrPathFast), { recursive: true })
    await fs.promises.mkdir(path.dirname(adrPathHono), { recursive: true })
    await fs.promises.writeFile(adrPathFast, '---\nestado: aprobado\n---\n', 'utf8')
    await fs.promises.writeFile(adrPathHono, '---\nestado: aprobado\n---\n', 'utf8')

    // crear archivo a renombrar en ambos roots
    const desde = 'old.txt'
    const hacia = 'renamed/new.txt'
    await fs.promises.writeFile(path.join(tmpDirFast, desde), 'contenido', 'utf8')
    await fs.promises.writeFile(path.join(tmpDirHono, desde), 'contenido', 'utf8')
    execSync('git add -A', { cwd: tmpDirFast })
    execSync('git commit -m "add files"', { cwd: tmpDirFast })
    execSync('git add -A', { cwd: tmpDirHono })
    execSync('git commit -m "add files"', { cwd: tmpDirHono })

    // permitir override de raíz
    process.env.TITAN_ALLOW_RENAME_ROOT_OVERRIDE = '1'

    const payloadFast = { adrRuta: adrPathFast, ops: [{ desde, hacia }], raiz: tmpDirFast }
    const payloadHono = { adrRuta: adrPathHono, ops: [{ desde, hacia }], raiz: tmpDirHono }

    const headers = { authorization: 'Bearer t', 'x-identificador-inquilino': 'TNT-TEST-0001' }
    const reqFast = await fastifyApp.inject({ method: 'POST', url: '/api/v1/ops/renombrar-por-adr', headers, payload: payloadFast })
    const reqHono = await honoApp.fetch(new Request('http://localhost/api/v1/ops/renombrar-por-adr', { method: 'POST', headers: { ...headers, 'content-type': 'application/json' }, body: JSON.stringify(payloadHono) }))

    // Validar estructura de detalle de renombrado
    const bodyFast = JSON.parse(reqFast.body)
    const bodyHono = JSON.parse(await reqHono.text())
    expect(bodyFast.ok).toBe(true)
    expect(bodyHono.ok).toBe(true)
    expect(bodyFast.detalle).toBeDefined()
    expect(bodyHono.detalle).toBeDefined()
    expect(typeof bodyFast.detalle.rama).toBe('string')
    expect(bodyFast.detalle.rama.length).toBeGreaterThan(0)
    expect(typeof bodyFast.detalle.commit).toBe('string')
    expect(bodyFast.detalle.commit.length).toBeGreaterThan(0)
    expect(typeof bodyHono.detalle.rama).toBe('string')
    expect(bodyHono.detalle.rama.length).toBeGreaterThan(0)
    expect(typeof bodyHono.detalle.commit).toBe('string')
    expect(bodyHono.detalle.commit.length).toBeGreaterThan(0)


    expect(reqFast.statusCode).toBe(200)
    expect(reqHono.status).toBe(200)
  })
})
