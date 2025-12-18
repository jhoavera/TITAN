import { describe, it, expect } from 'vitest'
import { Hono } from 'hono'
import { adaptarHandler } from '../../../src/infraestructura/servidor/adaptadores/fastify-to-hono'

describe('adaptador fastify->hono', () => {
  it('debe ejecutar handler tipo fastify y devolver JSON', async () => {
    const app = new Hono()

    const handler = async (req: any, reply: any) => {
      const nombre = (req.body as any)?.nombre ?? 'anon'
      reply.code(201).send({ saludo: `hola ${nombre}` })
    }

    app.post('/test', adaptarHandler(handler))

    const res = await app.fetch(new Request('http://localhost/test', { method: 'POST', body: JSON.stringify({ nombre: 'prueba' }), headers: { 'content-type': 'application/json' } }))
    expect(res.status).toBe(201)
    const body = JSON.parse(await res.text())
    expect(body.saludo).toBe('hola prueba')
  })
})
