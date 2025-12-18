import { describe, it, expect, beforeEach } from 'vitest'
import { registerClient, unregisterClient, broadcast, _resetClientsForTests } from '../../../src/nucleo/websocket/use-websocket'

describe('use-websocket (pubsub en memoria)', () => {
  beforeEach(() => { _resetClientsForTests() })

  it('debe registrar, enviar broadcast y eliminar cliente', () => {
    const received: string[] = []
    const client = { id: 'c1', send: (m: string) => { received.push(m) } }
    registerClient(client as any)
    broadcast('hola')
    expect(received).toEqual(['hola'])
    unregisterClient('c1')
    broadcast('otra')
    expect(received).toEqual(['hola'])
  })
})
