import path from 'path'
import { escanearRepositorioParaIngles, procesarHallazgosYGenerarPropuestas, Hallazgo } from '@nucleo/servicios/servicio-integridad-idioma'
import { registrarEvento } from '@nucleo/servicios/servicio-auditoria-prevalidacion'

export async function runIntegridadIdioma(raiz: string) {
  const r = path.resolve(raiz)
  const hallazgos: Hallazgo[] = await escanearRepositorioParaIngles(r)
  const resultados = await procesarHallazgosYGenerarPropuestas(r, hallazgos)

  // registrar en auditoría resumen por resultado
  try {
    for (const res of resultados) {
      await registrarEvento({ nombre: res.termino, tipo: 'glosario', valido: false, hayIngles: true, propuesta: res.propuestaGlosario ?? null })
    }
  } catch (_e) {
    // no bloquear flujo
  }

  return { hallazgos, resultados }
}

export default { runIntegridadIdioma }
