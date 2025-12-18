import { describe, it, expect, beforeEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { execSync } from 'child_process'

describe('Ops renombrar por ADR (Hono)', () => {
  let app: any
  const headers = { authorization: 'Bearer token-usuario-prueba', 'x-identificador-inquilino': 'TNT-TEST-0001' }

  beforeEach(async () => {
    const servidor = await import('@infraestructura/servidor/servidor-hono')
    app = servidor.default
    const { _resetRateLimitForTests } = await import('@nucleo/middleware/hono/middleware-rate-limit-inquilino')
    _resetRateLimitForTests()
  })

  it('solo aplica renombrados cuando ADR está aprobado', async () => {
    const dir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'titan-ops-'))
    execSync('git init -q', { cwd: dir })
    await fs.promises.writeFile(path.join(dir, 'a.txt'), 'hola', 'utf8')
    execSync('git add -A && git commit -m "init" -q', { cwd: dir })

    const adrPath = path.join(dir, 'documentacion-fuente-unica-verdad', 'ad-rs', '0001-test-adr.md')
    await fs.promises.mkdir(path.dirname(adrPath), { recursive: true })
    await fs.promises.writeFile(adrPath, '---\nestado: aprobado\n---\n', 'utf8')

    process.env.TITAN_ALLOW_RENAME_ROOT_OVERRIDE = '1'
    const res = await app.request('/api/v1/ops/renombrar-por-adr', {
      method: 'POST',
      headers: { ...headers, 'content-type': 'application/json' },
      body: JSON.stringify({ adrRuta: adrPath, ops: [{ desde: 'a.txt', hacia: 'b/b.txt' }], raiz: dir })
    })
    const body = await res.json()
    expect(res.status).toBe(200)
    expect(body.ok).toBe(true)
    expect(await fs.promises.stat(path.join(dir, 'b/b.txt'))).toBeTruthy()
    await fs.promises.rm(dir, { recursive: true, force: true })
  })
})
