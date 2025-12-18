import { describe, it, expect, beforeEach } from 'bun:test';
import fs from 'fs/promises';
import path from 'path';
import { spawnSync } from 'child_process';
import { limpiarRepoDesdeArgs } from '../../scripts/limpiar-repo';

const TMP = path.join(process.cwd(), 'tmp', 'test-limpiar-repo-cli');

beforeEach(async () => {
  await fs.rm(TMP, { recursive: true }).catch(() => {});
  await fs.mkdir(TMP, { recursive: true });
  await fs.writeFile(path.join(TMP, 'archivo.tmp'), 'tmp');
  await fs.writeFile(path.join(TMP, 'keep.md'), 'keep');
  spawnSync('git', ['-C', TMP, 'init'], { encoding: 'utf8' });
  spawnSync('git', ['-C', TMP, 'config', 'user.name', 'tester'], { encoding: 'utf8' });
  spawnSync('git', ['-C', TMP, 'config', 'user.email', 'tester@example.local'], { encoding: 'utf8' });
  await fs.writeFile(path.join(TMP, 'README.md'), '# test repo');
  spawnSync('git', ['-C', TMP, 'add', '.'], { encoding: 'utf8' });
  spawnSync('git', ['-C', TMP, 'commit', '-m', 'init'], { encoding: 'utf8' });
});

describe('CLI limpiar-repo', () => {
  it('--auto-approve aplica eliminaciones seguras', async () => {
    const cwd = process.cwd();
    try {
      process.chdir(TMP);
      const res = await limpiarRepoDesdeArgs(['--auto-approve', '--commit', '--autor=tester']);
      const existe = await fs.stat(path.join(TMP, 'archivo.tmp')).then(() => true).catch(() => false);
      expect(existe).toBe(false);
      // commit message debe contener chore(limpieza)
      const log = spawnSync('git', ['-C', TMP, 'log', '-1', '--pretty=%B'], { encoding: 'utf8' }).stdout?.trim();
      expect(log).toContain('chore(limpieza): aplicar');
    } finally {
      process.chdir(cwd);
    }
  });
});
