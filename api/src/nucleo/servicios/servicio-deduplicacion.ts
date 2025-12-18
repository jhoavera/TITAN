import { promises as fs } from 'fs';
import path from 'path';
import crypto from 'crypto';

export type GrupoDuplicados = {
  hash: string;
  archivos: string[];
  tamano: number;
};

export class ServicioDeduplicacion {
  private raiz: string;

  constructor(raiz?: string) {
    this.raiz = raiz ?? process.cwd();
  }

  private async _listarRecursivo(raiz: string): Promise<string[]> {
    const resultado: string[] = [];
    const apilar = [raiz];
    while (apilar.length) {
      const actual = apilar.pop() as string;
      const entradas = await fs.readdir(actual);
      for (const e of entradas) {
        const ruta = path.join(actual, e);
        const stats = await fs.stat(ruta);
        if (stats.isDirectory()) {
          // evitar carpetas enormes o internas
          const bn = path.basename(ruta).toLowerCase();
          if (bn === 'node_modules' || bn === '.git') continue;
          apilar.push(ruta);
        } else if (stats.isFile()) {
          resultado.push(ruta);
        }
      }
    }
    return resultado;
  }

  async detectarDuplicados(opciones?: { raiz?: string }): Promise<GrupoDuplicados[]> {
    const raiz = opciones?.raiz ? path.resolve(opciones.raiz) : this.raiz;
    const archivos = await this._listarRecursivo(raiz);

    const mapa = new Map<string, { archivos: string[]; tamano: number }>();
    for (const f of archivos) {
      try {
        const datos = await fs.readFile(f);
        const hash = crypto.createHash('sha256').update(datos).digest('hex');
        const tamano = datos.length;
        const actual = mapa.get(hash);
        if (!actual) mapa.set(hash, { archivos: [f], tamano });
        else actual.archivos.push(f);
      } catch (_e) {
        // ignorar fallos de lectura
      }
    }

    const grupos: GrupoDuplicados[] = [];
    for (const [hash, val] of mapa.entries()) {
      if (val.archivos.length > 1) {
        grupos.push({ hash, archivos: val.archivos, tamano: val.tamano });
      }
    }

    return grupos;
  }

  /**
   * Aplica un plan de deduplicación: por seguridad, por defecto mueve duplicados a tmp/artefactos-dedup
   * Si opts.delete=true, elimina los duplicados (no recomendado sin revisión).
   */
  async aplicarPlan(grupos: GrupoDuplicados[], opts?: { raiz?: string; delete?: boolean; commit?: boolean; autor?: { nombre: string; email: string } }): Promise<{ aplicadas: Array<{ hash: string; mantenida: string; eliminadas: string[] }>; errores: Array<{ hash: string; error: string }> }> {
    const raiz = opts?.raiz ? path.resolve(opts.raiz) : this.raiz;
    const aplicadas: Array<{ hash: string; mantenida: string; eliminadas: string[] }> = [];
    const errores: Array<{ hash: string; error: string }> = [];

    const destinoBase = path.join(raiz, 'tmp', 'artefactos-dedup');
    await fs.mkdir(destinoBase, { recursive: true });

    for (const g of grupos) {
      try {
        // mantener el primero alfabéticamente como canónico
        const orden = [...g.archivos].sort();
        const mantener = orden[0];
        const eliminar = orden.slice(1);
        const eliminadas: string[] = [];

        for (const e of eliminar) {
          if (opts?.delete) {
            await fs.rm(e, { force: true });
            eliminadas.push(e);
          } else {
            // mover a carpeta de artefactos con subcarpeta por hash
            const carpeta = path.join(destinoBase, g.hash);
            await fs.mkdir(carpeta, { recursive: true });
            const nombre = path.basename(e);
            const destino = path.join(carpeta, nombre);
            await fs.rename(e, destino);
            eliminadas.push(destino);
          }
        }

        aplicadas.push({ hash: g.hash, mantenida: mantener, eliminadas });
      } catch (err) {
        errores.push({ hash: g.hash, error: (err as Error).message });
      }
    }

    // commit si se solicitó
    if (opts?.commit) {
      try {
        const { spawnSync } = await import('child_process');
        const mensaje = `chore(dedup): aplicar deduplicación de ${aplicadas.length} grupos`;
        spawnSync('git', ['add', '-A'], { cwd: raiz });
        spawnSync('git', ['commit', '-m', mensaje, '--author', `${opts.autor?.nombre ?? 'automatizado'} <${opts.autor?.email ?? 'automatizado@local'}>`], { cwd: raiz });
      } catch (_e) {
        // no bloquear flujo
      }
    }

    return { aplicadas, errores };
  }
}

export default ServicioDeduplicacion;
