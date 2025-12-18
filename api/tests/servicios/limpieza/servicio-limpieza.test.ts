import { describe, it, expect, beforeEach } from 'bun:test';
import fs from 'fs/promises';
import path from 'path';
import { spawnSync } from 'child_process';
import { ServicioLimpieza } from '@servicios/limpieza/servicio-limpieza';

const TMP = path.join(process.cwd(), 'tmp', 'test-limpieza');

beforeEach(async () => {
  await fs.rm(TMP, { recursive: true }).catch(() => {});
  await fs.mkdir(TMP, { recursive: true });
  // crear archivos temporales y duplicados
  await fs.mkdir(path.join(TMP, 'carpeta'), { recursive: true });
  await fs.writeFile(path.join(TMP, 'carpeta', 'archivo.log'), 'log');
  await fs.writeFile(path.join(TMP, 'archivo.tmp'), 'tmp');
  await fs.writeFile(path.join(TMP, 'duplicado1.txt'), 'same');
  await fs.writeFile(path.join(TMP, 'duplicado2.txt'), 'same');
  // git repo básico
  spawnSync('git', ['-C', TMP, 'init'], { encoding: 'utf8' });
  spawnSync('git', ['-C', TMP, 'config', 'user.name', 'tester'], { encoding: 'utf8' });
  spawnSync('git', ['-C', TMP, 'config', 'user.email', 'tester@example.local'], { encoding: 'utf8' });
  await fs.writeFile(path.join(TMP, 'README.md'), '# test repo');
  spawnSync('git', ['-C', TMP, 'add', '.'], { encoding: 'utf8' });
  spawnSync('git', ['-C', TMP, 'commit', '-m', 'init'], { encoding: 'utf8' });
});

describe('ServicioLimpieza', () => {
  it('proponerLimpieza detecta temporales y duplicados', async () => {
    const s = new ServicioLimpieza({ basePath: TMP });
    const propuestas = await s.proponerLimpieza();
    expect(propuestas.some((p) => p.tipo === 'eliminar' && (p as any).ruta.endsWith('archivo.log'))).toBeTruthy();
    expect(propuestas.some((p) => p.tipo === 'eliminar' && (p as any).ruta.endsWith('archivo.tmp'))).toBeTruthy();
    // duplicados
    expect(propuestas.some((p) => p.razon?.includes && (p as any).razon.includes('duplicado')) || propuestas.some((p) => p.tipo === 'eliminar' && (p as any).razon.includes('duplicado'))).toBeTruthy();
  });

  it('ejecutarLimpieza aplica eliminaciones y permite commit', async () => {
    const s = new ServicioLimpieza({ basePath: TMP });
    const propuestas = await s.proponerLimpieza();
    const resultado = await s.ejecutarLimpieza(propuestas, { dryRun: false, commit: true, autor: { nombre: 'tester', email: 'tester@example.local' } });
    // confirmar que archivos temporales fueron eliminados
    const existe = await fs.stat(path.join(TMP, 'archivo.tmp')).then(() => true).catch(() => false);
    expect(existe).toBe(false);
    // verificar commit
    const log = spawnSync('git', ['-C', TMP, 'log', '-1', '--pretty=%B'], { encoding: 'utf8' }).stdout?.trim();
    expect(log).toContain('chore(limpieza): aplicar');
  });
});
