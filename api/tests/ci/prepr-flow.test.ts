import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const run = (cmd: string) => execSync(cmd, { encoding: 'utf-8' });

describe('prepr flow', () => {
  it('ejecuta flujo dedup -> proponer -> resumen', () => {
    // Ejecutar deduplicación
    run('bun ./scripts/ci/deduplicar-propuestas.ts');

    // Ejecutar propuesta de aprobaciones
    run('bun ./scripts/ci/proponer-aprobacion-adrs.ts');

    // Ejecutar wrapper (simple)
    run('bun ./scripts/ci/run-prepr.ts');

    const dedup = path.resolve(process.cwd(), 'reports', 'dedup-propuestas.json');
    const prop = path.resolve(process.cwd(), 'reports', 'propuestas-aprobacion-posible.json');
    expect(fs.existsSync(dedup)).toBe(true);
    expect(fs.existsSync(prop)).toBe(true);
  });
});
