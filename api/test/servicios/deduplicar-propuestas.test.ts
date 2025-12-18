import fs from 'fs';
import path from 'path';
import ServicioDeduplicacionPropuestas from '../../src/servicios/deduplicacion-propuestas';

const tmpDir = path.join(process.cwd(), 'tmp', 'dedup-test');

describe('ServicioDeduplicacionPropuestas', () => {
  beforeAll(async () => {
    await fs.promises.mkdir(tmpDir, { recursive: true });
    await fs.promises.writeFile(path.join(tmpDir, 'a.md'), `---\nnombre-original: Hola\nvalido: true\n---\nContenido de prueba`, 'utf-8');
    await fs.promises.writeFile(path.join(tmpDir, 'b.md'), `---\nnombre-original: hola\nvalido: false\n---\nContenido de prueba`, 'utf-8');
    await fs.promises.writeFile(path.join(tmpDir, 'c.md'), `---\nnombre-original: Otro\nvalido: true\n---\nContenido distinto`, 'utf-8');
  });

  afterAll(async () => {
    await fs.promises.rm(tmpDir, { recursive: true, force: true });
  });

  it('agrupa duplicados similares', async () => {
    const svc = new ServicioDeduplicacionPropuestas(tmpDir);
    const grupos = await svc.agruparPorSimilitud({ threshold: 0.6 });
    expect(grupos.length).toBeGreaterThanOrEqual(2);
    const joined = grupos.map(g => g.miembros.map(m => m.meta['nombre-original']));
    // one group should have both 'Hola' and 'hola'
    const found = joined.some(arr => arr.includes('Hola') && arr.includes('hola'));
    expect(found).toBe(true);
  });
});
