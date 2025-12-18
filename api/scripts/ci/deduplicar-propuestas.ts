#!/usr/bin/env bun
import { listarPropuestas, agruparYDeduplicar, consolidar } from '../../src/servicios/servicio-deduplicacion-propuestas';

function main() {
  const propuestas = listarPropuestas();
  if (propuestas.length === 0) {
    console.log('No se detectaron propuestas automáticas.');
    return 0;
  }
  const grupos = agruparYDeduplicar(propuestas);
  const destino = consolidar(grupos);
  console.log(`Deduplicación completada. Reporte: ${destino}`);
  for (const g of grupos) {
    console.log(`Clave: ${g.clave} — ${g.archivos.length} archivo(s)`);
  }
  return 0;
}

if (require.main === module) {
  process.exitCode = main() as number;
}
