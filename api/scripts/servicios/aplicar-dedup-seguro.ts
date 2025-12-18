#!/usr/bin/env bun
import path from 'path';
import fs from 'fs';
import ServicioDeduplicacionPropuestas from '../../src/servicios/deduplicacion-propuestas';

const args = process.argv.slice(2);
let reportPath = path.resolve(process.cwd(), '../reports/dedup-propuestas-*.json');
let confidence = 0.9;
let minMembers = 50;
let apply = false;
let threshold = 0.85;
for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === '--report' && args[i+1]) { reportPath = path.resolve(process.cwd(), args[i+1]); i++; }
  else if (a === '--confidence' && args[i+1]) { confidence = parseFloat(args[i+1]); i++; }
  else if (a === '--min-members' && args[i+1]) { minMembers = parseInt(args[i+1], 10); i++; }
  else if (a === '--apply') { apply = true; }
  else if (a === '--threshold' && args[i+1]) { threshold = parseFloat(args[i+1]); i++; }
}

(async () => {
  const proposalsDir = path.resolve(process.cwd(), '../documentacion-fuente-unica-verdad/glosario-biblioteca/propuestas');
  console.log('📁 Aplicador seguro - proposalsDir:', proposalsDir);
  console.log('🔎 Parámetros:', { reportPath, confidence, minMembers, apply, threshold });
  const svc = new ServicioDeduplicacionPropuestas(proposalsDir);
  const grupos = await svc.agruparPorSimilitud({ threshold });

  const candidates = grupos.filter(g => {
    const members = g.miembros.length;
    const score = g.score ?? 0;
    const canonValido = (g.canonical && (g.canonical.meta?.valido === true));
    return (score >= confidence) || (members >= minMembers) || canonValido;
  });

  console.log(`✅ ${candidates.length} grupos candidatas de ${grupos.length} (total propuestas ${grupos.reduce((s,g)=>s+g.miembros.length,0)})`);
  console.log('Top candidats (members, score, canonical):');
  candidates.slice(0,10).forEach(g => {
    console.log(` - members=${g.miembros.length} score=${(g.score ?? 0).toFixed(2)} canonical=${g.canonical ? path.relative(process.cwd(), g.canonical.filePath) : 'N/A'}`);
  });

  if (apply) {
    console.log('▶️ Aplicando consolidación segura (moviendo duplicados a _archivadas) ...');
    const res = await svc.aplicarConsolidacion(candidates, { archiveDir: path.join(proposalsDir, '_archivadas') });
    console.log('✅ Consolidación aplicada. Movidos:', res.moved);
  } else {
    console.log('💤 Dry-run. Para aplicar usar --apply.');
  }
})();
