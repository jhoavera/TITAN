export type WebsocketClient = {
  id: string
  send: (msg: string) => void
}

const clients = new Map<string, WebsocketClient>()

export function registerClient(client: WebsocketClient) {
  clients.set(client.id, client)
}

export function unregisterClient(id: string) {
  clients.delete(id)
}

export function broadcast(message: string) {
  for (const c of clients.values()) {
    try {
      c.send(message)
    } catch (_err) {
      // Ignorar fallos en envío a cliente local
    }
  }
}

export function _resetClientsForTests() {
  clients.clear()
}
