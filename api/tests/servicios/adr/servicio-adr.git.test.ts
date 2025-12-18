import { describe, it, expect, beforeEach } from 'bun:test';
import { ServicioADR } from '@servicios/adr/servicio-adr';
import fs from 'fs/promises';
import path from 'path';
import { spawnSync } from 'child_process';

const TMP = path.join(process.cwd(), 'tmp', 'test-adrs-git');

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

describe('ServicioADR Git integration', () => {
  it('crea ADR y genera commit', async () => {
    const servicio = new ServicioADR(TMP);
    const adr = await servicio.crearADR({ titulo: 'Git prueba crear', autor: 'git-tester', objetivo: 'test', decision: 'decidir' }, { commit: true });
    // obtener último commit
    const log = spawnSync('git', ['-C', TMP, 'log', '-1', '--pretty=%B'], { encoding: 'utf8' }).stdout?.trim();
    expect(log).toContain(`chore(adr): crear ADR ${adr.id}`);
  });

  it('actualiza ADR y genera commit', async () => {
    const servicio = new ServicioADR(TMP);
    const adr = await servicio.crearADR({ titulo: 'Git prueba actualizar', autor: 'git-tester', objetivo: 'test', decision: 'decidir' }, { commit: true });
    await servicio.actualizarADR(adr.id, { decision: 'nueva decision' }, { commit: true, autorCommit: { nombre: 'git-tester', email: 'git-tester@example.local' } });
    const log = spawnSync('git', ['-C', TMP, 'log', '-1', '--pretty=%B'], { encoding: 'utf8' }).stdout?.trim();
    expect(log).toContain('chore(adr): actualizar ADR');
  });

  it('elimina ADR y genera commit', async () => {
    const servicio = new ServicioADR(TMP);
    const adr = await servicio.crearADR({ titulo: 'Git prueba borrar', autor: 'git-tester', objetivo: 'test', decision: 'decidir' }, { commit: true });
    await servicio.eliminarADR(adr.id, { commit: true });
    // el archivo debe no existir
    const ruta = (await servicio.listarADR()).find((a) => a.id.includes(adr.id));
    expect(ruta).toBeUndefined();
    const log = spawnSync('git', ['-C', TMP, 'log', '-1', '--pretty=%B'], { encoding: 'utf8' }).stdout?.trim();
    expect(log).toContain('chore(adr): eliminar ADR');
  });
});
