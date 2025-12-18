import { describe, it, expect } from 'vitest';
import { heuristica_md_small, heuristica_traducible } from '@servicios/auto-approve/heuristicas';

describe('Heurísticas auto-approve', () => {
  it('rechaza textos muy cortos', () => {
    const r = heuristica_md_small('corto');
    expect(r.aprobacionSegura).toBe(false);
    expect(r.puntaje).toBeLessThan(0.9);
  });

  it('acepta textos largos', () => {
    const largo = Array(200).fill('palabra').join(' ');
    const r = heuristica_md_small(largo);
    expect(r.aprobacionSegura).toBe(true);
    expect(r.puntaje).toBeGreaterThan(0.9);
  });

  it('detecta ingles en términos', () => {
    const r = heuristica_traducible('migration');
    expect(r.aprobacionSegura).toBe(false);
  });
});
