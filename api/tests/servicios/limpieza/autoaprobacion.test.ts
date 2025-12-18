import { describe, it, expect, beforeEach } from 'bun:test';
import fs from 'fs/promises';
import path from 'path';
import { spawnSync } from 'child_process';
import { ServicioLimpieza } from '../../../src/servicios/limpieza/servicio-limpieza';

const TMP = path.join(process.cwd(), 'tmp', 'test-limpieza-auto');

beforeEach(async () => {
  await fs.rm(TMP, { recursive: true }).catch(() => {});
  await fs.mkdir(TMP, { recursive: true });

  // Archivos y carpetas de prueba
  await fs.writeFile(path.join(TMP, 'archivo.tmp'), 'tmp');
  await fs.writeFile(path.join(TMP, 'duplicado1.txt'), 'same');
  await fs.writeFile(path.join(TMP, 'duplicado2.txt'), 'same');
  // carpeta migractions (debe generar ADR en vez de auto-aprobar)
  await fs.mkdir(path.join(TMP, 'migrations'), { recursive: true });
  await fs.writeFile(path.join(TMP, 'migrations', '001_init.sql'), 'create table');

  // git repo básico
  spawnSync('git', ['-C', TMP, 'init'], { encoding: 'utf8' });
  spawnSync('git', ['-C', TMP, 'config', 'user.name', 'tester'], { encoding: 'utf8' });
  spawnSync('git', ['-C', TMP, 'config', 'user.email', 'tester@example.local'], { encoding: 'utf8' });
  await fs.writeFile(path.join(TMP, 'README.md'), '# test repo');
  spawnSync('git', ['-C', TMP, 'add', '.'], { encoding: 'utf8' });
  spawnSync('git', ['-C', TMP, 'commit', '-m', 'init'], { encoding: 'utf8' });
});

describe('Heurísticas de auto-aprobación', () => {
  it('auto-aprueba archivos temporales y duplicados idénticos, y genera ADR para migraciones', async () => {
    const s = new ServicioLimpieza({ basePath: TMP });
    const propuestas = await s.proponerLimpieza();

    const resultado = await s.ejecutarLimpieza(propuestas, { dryRun: false, commit: false, autor: { nombre: 'tester', email: 'tester@example.local' }, autoApprove: true });

    // archivo.tmp debe haber sido eliminado
    const existeTmp = await fs.stat(path.join(TMP, 'archivo.tmp')).then(() => true).catch(() => false);
    expect(existeTmp).toBe(false);

    // duplicado2.txt (segundo) debe haber sido eliminado por hash
    const existeDup2 = await fs.stat(path.join(TMP, 'duplicado2.txt')).then(() => true).catch(() => false);
    expect(existeDup2).toBe(false);

    // migrations debe producir ADR (en aplicadas habrá una entrada reportar-adr con adr creado)
    const tieneADR = resultado.aplicadas.some((a) => a.tipo === 'reportar-adr' && (a as any).descripcion.includes('ADR creado'));
    expect(tieneADR).toBeTruthy();
  });
});
