#!/usr/bin/env bun
import { execSync } from 'child_process';
import path from 'path';

function run(cmd: string) {
  console.log(`> ${cmd}`);
  const out = execSync(cmd, { encoding: 'utf-8' });
  console.log(out);
}

function main() {
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
