import { runIntegridadIdioma } from './integridad-idioma'

export async function runAllChecks(raiz: string) {
  const integridad = await runIntegridadIdioma(raiz)
  return { integridad }
}

// Servicio invocable por agentes: intenta usar Bun si está disponible
export async function servicioIntegridadInvoker(raiz: string) {
  // si Bun disponible, sugiere usar Bun para ejecución rápida; igual llamamos la función interna
  return await runIntegridadIdioma(raiz)
}

export default { runAllChecks }
