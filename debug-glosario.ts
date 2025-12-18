import app from './api/src/infraestructura/servidor/servidor-hono'

async function run() {
  const payload = { termino: 'paridad-test-debug', definicion: 'Def para debug - >20 chars', categoria: 'TERMINO_TECNICO' }
  const req = new Request('http://localhost/api/v1/glosario', { method: 'POST', headers: { authorization: 'Bearer t', 'content-type': 'application/json' }, body: JSON.stringify(payload) })
  const res = await app.fetch(req)
  console.log('status', res.status)
  try {
    const body = await res.text()
    console.log('body:', body)
  } catch (e) {
    console.log('no body')
  }
}

run().catch((e)=>{console.error('error', e)})
