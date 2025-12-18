#!/usr/bin/env bun
import fs from 'fs';
import path from 'path';

const REPORT = path.resolve(process.cwd(), 'reports/fastify-deteccion.json');
const OUT = path.resolve(process.cwd(), 'reports/plan-migracion-fastify.json');

function main() {
  if (!fs.existsSync(REPORT)) {
    console.error('No se encontró', REPORT);
    process.exit(1);
  }
  const r = JSON.parse(fs.readFileSync(REPORT, 'utf-8'));
  const plan = Object.keys(r.occurrences).map((file) => ({
    archivo: file,
    referencias: r.occurrences[file],
    accionPropuesta: (file.includes('middleware')) ? 'reescribir_middleware_a_hono' : (file.includes('controladores') || file.includes('rutas')) ? 'verificar_y_ajustar_adaptador' : 'auditar',
    notas: [] as string[],
  }));

  const out = { fecha: new Date().toISOString(), total: plan.length, plan };
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2), 'utf-8');
  console.log('Plan de migración generado:', OUT);
}

if (import.meta.main) main();
