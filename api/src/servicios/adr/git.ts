import { spawnSync } from 'child_process';
import path from 'path';

export async function esRepositorioGit(directorio: string): Promise<boolean> {
  const res = spawnSync('git', ['-C', directorio, 'rev-parse', '--is-inside-work-tree'], { encoding: 'utf8' });
  return res.status === 0 && (res.stdout ?? '').trim() === 'true';
}

export async function commitArchivo(directorio: string, archivoRuta: string, mensaje: string, autor?: { nombre: string; email: string } ): Promise<void> {
  // Usar ruta relativa dentro del repo para git add
  const relativo = path.relative(directorio, archivoRuta);
  const add = spawnSync('git', ['-C', directorio, 'add', '--', relativo], { encoding: 'utf8' });
  if (add.status !== 0) {
    throw new Error(`git add falló: ${add.stderr ?? add.stdout}`);
  }

  const env = { ...process.env } as Record<string, string>;
  if (autor) {
    env['GIT_AUTHOR_NAME'] = autor.nombre;
    env['GIT_AUTHOR_EMAIL'] = autor.email;
    env['GIT_COMMITTER_NAME'] = autor.nombre;
    env['GIT_COMMITTER_EMAIL'] = autor.email;
  }

  const commit = spawnSync('git', ['-C', directorio, 'commit', '-m', mensaje, '--', relativo], { encoding: 'utf8', env });
  if (commit.status !== 0) {
    throw new Error(`git commit falló: ${commit.stderr ?? commit.stdout}`);
  }
}
