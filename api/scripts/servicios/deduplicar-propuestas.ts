#!/usr/bin/env bun
import path from 'path';
import fs from 'fs';
import Service from '../../src/servicios/deduplicacion-propuestas';

const proposalsDir = path.resolve(process.cwd(), '../documentacion-fuente-unica-verdad/glosario-biblioteca/propuestas');
const args = process.argv.slice(2);
let dryRun = true;
let threshold = 0.85;
let out = path.resolve(process.cwd(), '../reports/dedup-propuestas-' + new Date().toISOString().replace(/[:.]/g, '-') + '.json');
let apply = false;
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--apply') { apply = true; dryRun = false; }
  else if (a === '--dry-run') { dryRun = true; }
  else if (a === '--threshold' && args[i+1]) { threshold = parseFloat(args[i+1]); i++; }
  else if (a === '--out' && args[i+1]) { out = path.resolve(process.cwd(), args[i+1]); i++; }
}

(async () => {
  console.log('🔎 Deduplicación - directorio:', proposalsDir);
  console.log('⚙️ Parámetros:', { dryRun, threshold, out, apply });
  const svc = new Service(proposalsDir);
  const grupos = await svc.agruparPorSimilitud({ threshold });
  await svc.generarReporte(grupos, out);
  console.log('✅ Reporte generado en', out);
  const total = grupos.reduce((s, g) => s + g.miembros.length, 0);
  const uniq = grupos.length;
  const duplicates = grupos.reduce((a, g) => a + Math.max(0, g.miembros.length - 1), 0);
  console.log(`📊 Encontradas ${total} propuestas en ${uniq} grupos (${duplicates} duplicados)`);
  console.log('✳️ Ejemplo de 10 grupos:');
  for (let i = 0; i < Math.min(10, grupos.length); i++) {
    const g = grupos[i];
    console.log(` - ${g.id}: canonical=${g.canonical ? path.relative(process.cwd(), g.canonical.filePath) : 'N/A'} members=${g.miembros.length} score=${(g.score ?? 0).toFixed(2)}`);
  }
  if (apply) {
    console.log('▶️ Aplicando consolidación (moviendo duplicados a _archivadas)...');
    const res = await svc.aplicarConsolidacion(grupos, { archiveDir: path.join(proposalsDir, '_archivadas') });
    console.log('✅ Consolidación aplicada. Movidos:', res.moved);
  } else {
    console.log('💤 Dry-run. Para aplicar usar --apply.');
  }
})();
