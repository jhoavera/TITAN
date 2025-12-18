import { describe, it, expect, beforeEach } from 'bun:test';
import fs from 'fs/promises';
import path from 'path';
import { spawnSync } from 'child_process';
import { ServicioDeduplicacion } from '../../../src/servicios/servicio-deduplicacion';

const TMP = path.join(process.cwd(), 'tmp', 'test-dedup');

beforeEach(async () => {
  await fs.rm(TMP, { recursive: true }).catch(() => {});
  await fs.mkdir(TMP, { recursive: true });

  // archivos duplicados
  await fs.writeFile(path.join(TMP, 'a.txt'), 'contenido-igual');
  await fs.writeFile(path.join(TMP, 'b.txt'), 'contenido-igual');
  await fs.writeFile(path.join(TMP, 'c.txt'), 'diferente');

  // repo git básico
  spawnSync('git', ['-C', TMP, 'init'], { encoding: 'utf8' });
  spawnSync('git', ['-C', TMP, 'config', 'user.name', 'tester'], { encoding: 'utf8' });
  spawnSync('git', ['-C', TMP, 'config', 'user.email', 'tester@example.local'], { encoding: 'utf8' });
  await fs.writeFile(path.join(TMP, 'README.md'), '# test repo');
  spawnSync('git', ['-C', TMP, 'add', '.'], { encoding: 'utf8' });
  spawnSync('git', ['-C', TMP, 'commit', '-m', 'init'], { encoding: 'utf8' });
});

describe('ServicioDeduplicacion', () => {
  it('detecta duplicados por hash y mueve los duplicados cuando se aplica', async () => {
    const mod = await import(`file://${path.join(process.cwd(), 'src', 'servicios', 'servicio-deduplicacion.ts')}`);
    const ServicioDeduplicacion = mod.ServicioDeduplicacion;
    const s = new ServicioDeduplicacion(TMP);
    const grupos = await s.detectarDuplicados({ raiz: TMP });
    expect(grupos.length).toBe(1);
    expect(grupos[0].archivos.length).toBe(2);

    const res = await s.aplicarPlan(grupos, { raiz: TMP, delete: false, commit: false });
    // comprobar que b.txt fue movido a tmp/artefactos-dedup/<hash>/b.txt
    const carpeta = path.join(TMP, 'tmp', 'artefactos-dedup', grupos[0].hash);
    const existeMoved = await fs.stat(path.join(carpeta, 'b.txt')).then(() => true).catch(() => false);
    expect(existeMoved).toBe(true);

    // a.txt debe permanecer
    const existeA = await fs.stat(path.join(TMP, 'a.txt')).then(() => true).catch(() => false);
    expect(existeA).toBe(true);
  });

  it('puede eliminar duplicados con --delete', async () => {
    const mod = await import(`file://${path.join(process.cwd(), 'src', 'servicios', 'servicio-deduplicacion.ts')}`);
    const ServicioDeduplicacion = mod.ServicioDeduplicacion;
    const s = new ServicioDeduplicacion(TMP);
    const grupos = await s.detectarDuplicados({ raiz: TMP });
    const res = await s.aplicarPlan(grupos, { raiz: TMP, delete: true, commit: false });
    // b.txt debe estar eliminado
    const existeB = await fs.stat(path.join(TMP, 'b.txt')).then(() => true).catch(() => false);
    expect(existeB).toBe(false);
  });
});
