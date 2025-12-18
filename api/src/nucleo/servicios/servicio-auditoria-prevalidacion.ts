import fs from 'fs'
import path from 'path'
import { rutaAuditoriaPrevalidacionLog } from '@nucleo/rutas/rutas-docs'

export type EventoPreValidacion = {
  timestamp: string
  nombre: string
  tipo: string
  valido: boolean
  hayIngles: boolean
  propuesta?: string | null
}

function getAuditFile(): string {
  return process.env.TITAN_AUDIT_PREVALIDACION_PATH || rutaAuditoriaPrevalidacionLog()
}

export async function registrarEvento(e: Omit<EventoPreValidacion, 'timestamp'>) {
  await fs.promises.mkdir(path.dirname(getAuditFile()), { recursive: true })
  const evento: EventoPreValidacion = { timestamp: new Date().toISOString(), ...e }
  await fs.promises.appendFile(getAuditFile(), JSON.stringify(evento) + '\n', 'utf8')
  return evento
}

export async function leerEventos(limit = 100) {
  try {
    const contenido = await fs.promises.readFile(getAuditFile(), 'utf8')
    const lines = contenido.trim().split('\n').filter(Boolean).reverse()
    const eventos = lines.slice(0, limit).map(l => JSON.parse(l) as EventoPreValidacion)
    return eventos
  } catch (_e) {
    return []
  }
}

export async function contarPropuestas() {
  const ev = await leerEventos(10000)
  return ev.length
}

function aggregateMetrics(evts: EventoPreValidacion[]) {
  const totals: Record<string, number> = {}
  for (const e of evts) {
    const k = `${e.tipo}::${e.hayIngles}`
    totals[k] = (totals[k] ?? 0) + 1
  }
  return totals
}

export function metricsText(prometheusPrefix = 'titan') {
  return async function text() {
    const eventos = await leerEventos(10000)
    const totals = aggregateMetrics(eventos)
    const lines: string[] = []
    lines.push(`# HELP ${prometheusPrefix}_prevalidacion_propuestas_total Numero de propuestas registradas por pre-validacion por tipo y hayIngles`)
    lines.push(`# TYPE ${prometheusPrefix}_prevalidacion_propuestas_total counter`)
    for (const key of Object.keys(totals)) {
      const [tipo, hayIngles] = key.split('::')
      lines.push(`${prometheusPrefix}_prevalidacion_propuestas_total{tipo="${tipo}",hayIngles="${hayIngles}"} ${totals[key]}`)
    }

    const lastTs = eventos[0]?.timestamp ? Math.floor(new Date(eventos[0].timestamp).getTime() / 1000) : 0
    lines.push(`# HELP ${prometheusPrefix}_prevalidacion_ult_event_timestamp_seconds Timestamp del ultimo evento de prevalidacion`)
    lines.push(`# TYPE ${prometheusPrefix}_prevalidacion_ult_event_timestamp_seconds gauge`)
    lines.push(`${prometheusPrefix}_prevalidacion_ult_event_timestamp_seconds ${lastTs}`)

    return lines.join('\n') + '\n'
  }
}

export default { registrarEvento, leerEventos, contarPropuestas, metricsText }
