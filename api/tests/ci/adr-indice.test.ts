import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

const repoRoot = path.resolve(__dirname, '..', '..');
const adrsDir = path.resolve(repoRoot, 'documentacion-fuente-unica-verdad', 'ad-rs');
const indicePath = path.join(adrsDir, 'adr-indice.md');
const expectedFiles = [
  path.join(adrsDir, '2025-12-16-proponer-traduccion-migraciones.md'),
  path.join(adrsDir, '2025-12-16-proponer-traduccion-migrate.md'),
  path.join(adrsDir, '2025-12-16-propuesta-traducir-migraciones.md'),
  path.join(adrsDir, '2025-12-16-propuestas-automaticas.md')
];

describe('adr-indice', () => {
  it('contiene referencias a las ADRs automáticas y los archivos existen', () => {
    const indice = fs.readFileSync(indicePath, 'utf-8');
    for (const file of expectedFiles) {
      expect(fs.existsSync(file)).toBe(true);
    }
    expect(indice).toContain('Propuestas automáticas (2025-12-16)');
  });
});
