import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const script = path.resolve(__dirname, '../../scripts/ci/generar-adrs-canonicas.ts');
const reports = path.resolve(process.cwd(), 'reports/reporte-refactor-idioma.json');

describe('generar-adrs-canonicas', () => {
  it('dry-run prints proposals without writing files', () => {
    const res = execSync(`bun ${script} `, { encoding: 'utf8' });
    expect(res).toContain('Generando ADRs canónicas');
    // Ensure no new ADR files were created in ad-rs for this run
    const adrsDir = path.resolve(process.cwd(), '../documentacion-fuente-unica-verdad/ad-rs');
    const before = fs.readdirSync(adrsDir).length;
    // run dry-run again
    execSync(`bun ${script} `);
    const after = fs.readdirSync(adrsDir).length;
    expect(after).toBe(before);
  });

  it('fails when report is missing', () => {
    const tmp = path.resolve(process.cwd(), 'reports/reporte-refactor-idioma.json');
    const bak = tmp + '.bak';
    if (fs.existsSync(tmp)) fs.renameSync(tmp, bak);
    try {
      let thrown = false;
      try { execSync(`bun ${script} `, { encoding: 'utf8', stdio: 'pipe' }); } catch (e: any) { thrown = true; expect(String(e.stdout || e.stderr)).toContain('No se encontró reports/reporte-refactor-idioma.json'); }
      expect(thrown).toBe(true);
    } finally {
      if (fs.existsSync(bak)) fs.renameSync(bak, tmp);
    }
  });
});
