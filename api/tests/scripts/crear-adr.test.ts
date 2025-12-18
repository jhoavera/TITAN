import { describe, it, expect, beforeEach } from 'bun:test';
import fs from 'fs/promises';
import path from 'path';
import { spawnSync } from 'child_process';
import { crearADRDesdeArgs } from '../../scripts/crear-adr';

const TMP = path.join(process.cwd(), 'tmp', 'test-crear-adr-cli');

beforeEach(async () => {
  await fs.rm(TMP, { recursive: true }).catch(() => {});
  await fs.mkdir(TMP, { recursive: true });
  // Inicializar repo git
  spawnSync('git', ['-C', TMP, 'init'], { encoding: 'utf8' });
  spawnSync('git', ['-C', TMP, 'config', 'user.name', 'tester'], { encoding: 'utf8' });
  spawnSync('git', ['-C', TMP, 'config', 'user.email', 'tester@example.local'], { encoding: 'utf8' });
  await fs.writeFile(path.join(TMP, 'README.md'), '# test repo');
  spawnSync('git', ['-C', TMP, 'add', '.'], { encoding: 'utf8' });
  spawnSync('git', ['-C', TMP, 'commit', '-m', 'init'], { encoding: 'utf8' });
});

describe('CLI crear-adr', () => {
  it('--no-commit debe crear ADR pero no hacer commit', async () => {
    const cwd = process.cwd();
    try {
      process.chdir(TMP);
      const adr = await crearADRDesdeArgs(['--no-commit', '--titulo=CLI prueba sin commit', '--autor=cli-tester', '--objetivo=prueba', '--decision=decidir']);
      // verificar que el archivo existe
      const base = path.join(TMP, 'documentacion-fuente-unica-verdad', 'ad-rs');
      const archivos = await fs.readdir(base);
      expect(archivos.some((f) => f.includes(adr.id))).toBeTruthy();

      // último commit debe ser 'init'
      const log = spawnSync('git', ['-C', TMP, 'log', '-1', '--pretty=%B'], { encoding: 'utf8' }).stdout?.trim();
      expect(log).toBe('init');
    } finally {
      process.chdir(cwd);
    }
  });

  it('sin --no-commit debe crear ADR y hacer commit', async () => {
    const cwd = process.cwd();
    try {
      process.chdir(TMP);
      const adr = await crearADRDesdeArgs(['--titulo=CLI prueba commit', '--autor=cli-tester', '--objetivo=prueba', '--decision=decidir']);
      const log = spawnSync('git', ['-C', TMP, 'log', '-1', '--pretty=%B'], { encoding: 'utf8' }).stdout?.trim();
      expect(log).toContain(`chore(adr): crear ADR ${adr.id}`);
    } finally {
      process.chdir(cwd);
    }
  });

  it('debe rechazar ADR cuando se detectan términos en inglés en título', async () => {
    const cwd = process.cwd();
    try {
      process.chdir(TMP);
      let thrown = false;
      try {
        await crearADRDesdeArgs(['--titulo=Propuesta migration fix', '--autor=cli-tester', '--objetivo=test', '--decision=decidir']);
      } catch (err: any) {
        thrown = true;
        expect(err.message).toMatch(/se detectaron términos en inglés/i);
      }
      expect(thrown).toBe(true);
    } finally {
      process.chdir(cwd);
    }
  });
});
