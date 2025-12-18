#!/usr/bin/env bun
import { promises as fs } from 'fs'
import path from 'path'
import { run as ejecutarLimpiezaRepo } from '@scripts/servicios/limpieza-repo'
import ServicioLimpiezaAvanzada, { OpcionesLimpieza } from '@servicios/limpieza-avanzada'

interface OpcionesCLI {
  aplicar: boolean
  autoAprobar: boolean
  diasPropuestas: number
  salida?: string
  umbralSimilitud: number
  logMaxBytes: number
  logMaxLineas: number
  logLineasRetener: number
  borrarFixtures: boolean
}

interface RegistroTrazable {
  instante: string
  etapa: 'limpieza-propuestas' | 'limpieza-avanzada'
  modo: 'dry-run' | 'apply'
  detalle: Record<string, unknown>
}

function ahoraISO(): string {
  return new Date().toISOString()
}

function parseArgs(): OpcionesCLI {
  const argv = process.argv.slice(2)
  const aplicar = argv.includes('--apply') || argv.includes('--aplicar')
  const autoAprobar = argv.includes('--auto-approve') || argv.includes('--auto-aprobar')
  const diasPropuestas = leerNumero(argv, '--older-than=', 30)
  const salida = leerCadena(argv, '--salida=')
  const umbralSimilitud = leerNumero(argv, '--umbral=', 0.85)
  const logMaxBytes = leerNumero(argv, '--log-max-bytes=', 2_000_000)
  const logMaxLineas = leerNumero(argv, '--log-max-lineas=', 10_000)
  const logLineasRetener = leerNumero(argv, '--log-retener-lineas=', 2_000)
  const borrarFixtures = argv.includes('--borrar-fixtures')

  return { aplicar, autoAprobar, diasPropuestas, salida, umbralSimilitud, logMaxBytes, logMaxLineas, logLineasRetener, borrarFixtures }
}

function leerNumero(argv: string[], prefijo: string, fallback: number): number {
  const valor = argv.find((a) => a.startsWith(prefijo))
  if (!valor) return fallback
  const n = Number(valor.replace(prefijo, ''))
  return Number.isFinite(n) ? n : fallback
}

function leerCadena(argv: string[], prefijo: string): string | undefined {
  const valor = argv.find((a) => a.startsWith(prefijo))
  if (!valor) return undefined
  const limpio = valor.replace(prefijo, '')
  return limpio.length > 0 ? path.resolve(process.cwd(), limpio) : undefined
}

async function asegurarDirectorio(ruta: string): Promise<void> {
  await fs.mkdir(path.dirname(ruta), { recursive: true })
}

async function escribirLineaTrazable(ruta: string, registro: RegistroTrazable): Promise<void> {
  const linea = JSON.stringify(registro)
  await fs.appendFile(ruta, linea + '\n', { encoding: 'utf8' })
}

async function ejecutarLimpiezaPropuestas(opts: OpcionesCLI, rutaLog: string): Promise<{ total: number }> {
  const resultado = await ejecutarLimpiezaRepo({
    dryRun: !opts.aplicar,
    olderThanDays: opts.diasPropuestas,
    apply: opts.aplicar,
    autoApprove: opts.autoAprobar,
    gitCommit: false,
  })

  const total = (resultado as { found?: number }).found ?? 0
  await escribirLineaTrazable(rutaLog, {
    instante: ahoraISO(),
    etapa: 'limpieza-propuestas',
    modo: opts.aplicar ? 'apply' : 'dry-run',
    detalle: { totalEncontradas: total, diasUmbral: opts.diasPropuestas, autoAprobar: opts.autoAprobar },
  })
  return { total }
}

async function ejecutarLimpiezaAvanzada(opts: OpcionesCLI, rutaLog: string): Promise<void> {
  const servicio = new ServicioLimpiezaAvanzada()
  const opcionesServicio: OpcionesLimpieza = {
    apply: opts.aplicar,
    umbralSimilitud: opts.umbralSimilitud,
    archivoReporte: undefined,
    logMaxBytes: opts.logMaxBytes,
    logMaxLineas: opts.logMaxLineas,
    logLineasRetener: opts.logLineasRetener,
    borrarFixtures: opts.borrarFixtures,
  }

  const resultado = await servicio.ejecutar(opcionesServicio)
  await escribirLineaTrazable(rutaLog, {
    instante: ahoraISO(),
    etapa: 'limpieza-avanzada',
    modo: opts.aplicar ? 'apply' : 'dry-run',
    detalle: {
      gruposTotales: resultado.consolidacion.totalGrupos,
      gruposDuplicados: resultado.consolidacion.gruposConDuplicados,
      archivados: resultado.consolidacion.archivosMovidos.length,
      conservados: resultado.consolidacion.archivosConservados.length,
      reporte: path.relative(process.cwd(), resultado.consolidacion.reporte),
      logRotado: resultado.log.rotado,
      logBytesAntes: resultado.log.bytesAntes,
      logBytesDespues: resultado.log.bytesDespues,
      logLineasAntes: resultado.log.lineasAntes,
      logLineasDespues: resultado.log.lineasDespues,
      snapshot: resultado.log.snapshot ? path.relative(process.cwd(), resultado.log.snapshot) : null,
      motivo: resultado.log.motivo ?? null,
      fixturesAccion: resultado.fixtures.accion,
      fixturesDestino: resultado.fixtures.destino ? path.relative(process.cwd(), resultado.fixtures.destino) : null,
    },
  })
}

async function main(): Promise<void> {
  const opciones = parseArgs()
  const rutaLog = opciones.salida ?? path.resolve(process.cwd(), 'tmp/registros-limpieza', `limpieza-${ahoraISO().replace(/[:.]/g, '-')}.jsonl`)
  await asegurarDirectorio(rutaLog)

  console.log('=== Limpieza trazable ===')
  console.log('Modo:', opciones.aplicar ? 'apply' : 'dry-run')
  console.log('Log JSONL:', path.relative(process.cwd(), rutaLog))

  const resumenPropuestas = await ejecutarLimpiezaPropuestas(opciones, rutaLog)
  console.log('Propuestas procesadas:', resumenPropuestas.total)

  await ejecutarLimpiezaAvanzada(opciones, rutaLog)
  console.log('Limpieza avanzada registrada en log.')

  if (!opciones.aplicar) {
    console.log('Ejecuta con --apply para aplicar cambios. Revisa el log antes de cualquier commit.')
  }
}

main().catch((err) => {
  console.error('Error en limpieza-trazable:', err)
  process.exit(1)
})
