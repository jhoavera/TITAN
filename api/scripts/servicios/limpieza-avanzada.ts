#!/usr/bin/env bun
import path from 'path';
import ServicioLimpiezaAvanzada, { OpcionesLimpieza } from '@servicios/limpieza-avanzada';

function parseArgs(): OpcionesLimpieza {
  const argv = process.argv.slice(2);
  const apply = argv.includes('--apply');
  const umbral = getNumberArg(argv, '--umbral=', 0.85);
  const logMaxBytes = getNumberArg(argv, '--log-max-bytes=', 2_000_000);
  const logMaxLineas = getNumberArg(argv, '--log-max-lineas=', 10_000);
  const logLineasRetener = getNumberArg(argv, '--log-retener-lineas=', 2_000);
  const borrarFixtures = argv.includes('--borrar-fixtures');
  const reporteArg = getStringArg(argv, '--reporte=');

  return {
    apply,
    umbralSimilitud: umbral,
    archivoReporte: reporteArg,
    logMaxBytes,
    logMaxLineas,
    logLineasRetener,
    borrarFixtures,
  };
}

function getNumberArg(argv: string[], prefix: string, fallback: number): number {
  const match = argv.find((a) => a.startsWith(prefix));
  if (!match) return fallback;
  const val = Number(match.replace(prefix, ''));
  return Number.isFinite(val) ? val : fallback;
}

function getStringArg(argv: string[], prefix: string): string | undefined {
  const match = argv.find((a) => a.startsWith(prefix));
  if (!match) return undefined;
  const val = match.replace(prefix, '');
  return val.length > 0 ? path.resolve(process.cwd(), val) : undefined;
}

async function main() {
  const opciones = parseArgs();
  const svc = new ServicioLimpiezaAvanzada();
  const resultado = await svc.ejecutar(opciones);

  console.log('=== Limpieza avanzada ===');
  console.log('Modo:', opciones.apply ? 'apply' : 'dry-run');
  console.log('Umbral similitud:', opciones.umbralSimilitud);
  console.log('--- Propuestas ---');
  console.log('Grupos totales:', resultado.consolidacion.totalGrupos);
  console.log('Grupos con duplicados:', resultado.consolidacion.gruposConDuplicados);
  console.log('Archivados (potenciales):', resultado.consolidacion.archivosMovidos.length);
  console.log('Conservados:', resultado.consolidacion.archivosConservados.length);
  console.log('Reporte:', path.relative(process.cwd(), resultado.consolidacion.reporte));

  console.log('--- Log auditoria ---');
  console.log('Rotado:', resultado.log.rotado);
  console.log('Bytes antes/despues:', resultado.log.bytesAntes, '/', resultado.log.bytesDespues);
  console.log('Lineas antes/despues:', resultado.log.lineasAntes, '/', resultado.log.lineasDespues);
  if (resultado.log.snapshot) console.log('Snapshot:', path.relative(process.cwd(), resultado.log.snapshot));
  if (resultado.log.motivo) console.log('Motivo:', resultado.log.motivo);

  console.log('--- Fixtures ---');
  console.log('Accion:', resultado.fixtures.accion);
  if (resultado.fixtures.destino) console.log('Destino:', path.relative(process.cwd(), resultado.fixtures.destino));

  if (!opciones.apply) {
    console.log('Nota: ejecutar con --apply para aplicar cambios. Se recomienda confirmar en git diff antes de commit.');
  }
}

main().catch((err) => {
  console.error('Error en limpieza-avanzada:', err);
  process.exit(1);
});
