import { describe, it, expect } from 'vitest'
const { crearFastifyCompat } = await import('../../helpers/fastify-compat')
import rutaOps from '../../../src/infraestructura/servidor/rutas/ops'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { execSync } from 'child_process'

describe('Ops renombrar por ADR', () => {
  it('solo aplica renombrados cuando ADR está aprobado', async () => {
    const dir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'titan-ops-'))
    // init git repo
    execSync('git init -q', { cwd: dir })
    // crear archivo a renombrar
    await fs.promises.writeFile(path.join(dir, 'a.txt'), 'hola', 'utf8')
    execSync('git add -A && git commit -m "init" -q', { cwd: dir })

    // crear ADR aprobado
    const adrPath = path.join(dir, 'documentacion-fuente-unica-verdad', 'ad-rs', '0001-test-adr.md')
    await fs.promises.mkdir(path.dirname(adrPath), { recursive: true })
    await fs.promises.writeFile(adrPath, '---\nestado: aprobado\n---\n', 'utf8')

    const app = crearFastifyCompat()
    await app.register(rutaOps as any)

    // invocar endpoint pasando raiz explícita (permitido en tests por variable de entorno)
    process.env.TITAN_ALLOW_RENAME_ROOT_OVERRIDE = '1'
    const res = await app.inject({ method: 'POST', url: '/api/v1/ops/renombrar-por-adr', payload: { adrRuta: adrPath, ops: [{ desde: 'a.txt', hacia: 'b/b.txt' }], raiz: dir } })
    expect(res.statusCode).toBe(200)
    const body = JSON.parse(res.body)
    expect(body.ok).toBe(true)
    // comprobar que archivo fue movido
    expect(await fs.promises.stat(path.join(dir, 'b/b.txt'))).toBeTruthy()
    await fs.promises.rm(dir, { recursive: true, force: true })
  })
})
