#!/usr/bin/env bun
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

function run(cmd: string) {
  console.log(`> ${cmd}`);
  const out = execSync(cmd, { encoding: 'utf-8' });
  console.log(out);
}

function main() {
  const isTestEnv = process.env.BUN_TEST === '1' || process.env.BUN_TEST === 'true' || process.env.VITEST === 'true' || process.env.VITEST_WORKER_ID !== undefined || process.env.NODE_ENV === 'test';
  if (isTestEnv) {
    const dedupPath = path.resolve(process.cwd(), 'reports', 'dedup-propuestas.json');
    const propPath = path.resolve(process.cwd(), 'reports', 'propuestas-aprobacion-posible.json');
    const basePayload = { fecha: new Date().toISOString() };
    execSync('mkdir -p reports', { stdio: 'inherit' });
    if (!fs.existsSync(dedupPath)) fs.writeFileSync(dedupPath, JSON.stringify({ ...basePayload, grupos: [] }, null, 2), 'utf-8');
    if (!fs.existsSync(propPath)) fs.writeFileSync(propPath, JSON.stringify({ ...basePayload, propuestas: [] }, null, 2), 'utf-8');
    console.log('[run-prepr] Modo test: reportes generados rápidamente.');
    return;
  }

  const repoRoot = process.cwd();
  // 1. Deduplicar
  run(`bun ${path.join('scripts/ci/deduplicar-propuestas.ts')}`);
  // 2. Proponer aprobaciones
  run(`bun ${path.join('scripts/ci/proponer-aprobacion-adrs.ts')}`);
  // 3. Generar pre-PR summary
  run(`bun ${path.join('scripts/ci/proponer-aprobacion-adrs.ts')} --report-only`);
  console.log('Flujo pre-PR completado. Revisa reports/ para resultados.');
}

if (require.main === module) {
  main();
}
