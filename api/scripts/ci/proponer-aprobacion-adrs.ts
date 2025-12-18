#!/usr/bin/env bun
import { revisarYProponerAprobaciones } from '@servicios/servicio-aprobacion-adrs';

async function main() {
  const res = await revisarYProponerAprobaciones();
  console.log(`Propuestas revisión: ${res.propuestas.length}`);
  for (const p of res.propuestas) {
    const razones = Array.isArray(p.razones) ? p.razones.join('; ') : '';
    console.log(`${p.termino}: valido=${p.valido} razones=${razones}`);
  }
  console.log('Reporte escrito en reports/propuestas-aprobacion-posible.json');
  return 0;
}

if (require.main === module) {
  main().then((code) => { process.exitCode = code as number; }).catch((e) => { console.error(e); process.exitCode = 1; });
}
