import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { execSync } from 'child_process'

describe('Ops renombrar Hono', () => {
  let app: any
  let tmpDir: string

  beforeEach(async () => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'titan-ops-hono-'))
    execSync('git init -b main', { cwd: tmpDir })
    fs.writeFileSync(path.join(tmpDir, 'README.md'), '# tmp repo')
    execSync('git add -A', { cwd: tmpDir })
    execSync('git commit -m "init"', { cwd: tmpDir })

    const servidor = await import('@infraestructura/servidor/servidor-hono')
    app = servidor.default
    const { _resetRateLimitForTests } = await import('@nucleo/middleware/hono/middleware-rate-limit-inquilino')
    _resetRateLimitForTests()
  })

  afterEach(async () => {
    try { fs.rmSync(tmpDir, { recursive: true }) } catch (_) {}
  })

  it('renombra archivos y devuelve detalle de git', async () => {
    const adrPath = path.join(tmpDir, 'docs', 'example-adr.md')
    await fs.promises.mkdir(path.dirname(adrPath), { recursive: true })
    await fs.promises.writeFile(adrPath, '---\nestado: aprobado\n---\n', 'utf8')

    const desde = 'old.txt'
    const hacia = 'renamed/new.txt'
    await fs.promises.writeFile(path.join(tmpDir, desde), 'contenido', 'utf8')
    execSync('git add -A', { cwd: tmpDir })
    execSync('git commit -m "add files"', { cwd: tmpDir })

    process.env.TITAN_ALLOW_RENAME_ROOT_OVERRIDE = '1'
    const headers = { authorization: 'Bearer token-usuario-prueba', 'x-identificador-inquilino': 'TNT-TEST-0001', 'content-type': 'application/json' }
    const res = await app.request('/api/v1/ops/renombrar-por-adr', {
      method: 'POST',
      headers,
      body: JSON.stringify({ adrRuta: adrPath, ops: [{ desde, hacia }], raiz: tmpDir })
    })

    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body.ok).toBe(true)
    expect(body.detalle).toBeDefined()
    expect(typeof body.detalle.rama).toBe('string')
    expect(body.detalle.rama.length).toBeGreaterThan(0)
    expect(typeof body.detalle.commit).toBe('string')
    expect(body.detalle.commit.length).toBeGreaterThan(0)
    expect(await fs.promises.stat(path.join(tmpDir, hacia))).toBeTruthy()
  })
})
