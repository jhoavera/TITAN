import { describe, it, expect } from 'vitest';
import { execSync } from 'child_process';
import path from 'path';

const script = path.resolve(process.cwd(), 'scripts/ci/validar-semantica.ts');

function hasBun(): boolean {
  try {
    execSync('bun --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

describe('CLI validar-semantica', () => {
  it('devuelve JSON válido cuando bun está disponible', () => {
    if (!hasBun()) {
      // Skip silently if bun no está instalado en el ambiente de pruebas
      console.warn('bun no disponible: se omite test CLI validar-semantica');
      return;
    }

    const out = execSync(`bun ${script} migraciones migraciones`, { encoding: 'utf-8' }).trim();
    expect(out.length).toBeGreaterThan(0);
    const json = JSON.parse(out);
    expect(typeof json.score).toBe('number');
    expect(typeof json.valido).toBe('boolean');
    expect(typeof json.explicacion).toBe('string');
  });
});
