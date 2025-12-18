import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import { ADR } from '@servicios/adr/types';

const esquemaCreacionADR = z.object({
  titulo: z.string().min(3),
  autor: z.string().min(1),
  objetivo: z.string().min(1),
  decision: z.string().min(1),
  contexto: z.string().optional(),
});

export class ServicioADR {
  private basePath: string;

  constructor(basePath?: string) {
    this.basePath = basePath ?? path.join(process.cwd(), 'documentacion-fuente-unica-verdad', 'ad-rs');
  }

  private slug(titulo: string): string {
    return titulo
      .toLowerCase()
      .replace(/[^a-z0-9áéíóúñ\- ]/g, '')
      .replace(/\s+/g, '-')
      .slice(0, 80);
  }

  async ensureBasePath(): Promise<void> {
    await fs.mkdir(this.basePath, { recursive: true });
  }

  private plantillaContenido(data: { id: string; titulo: string; autor: string; fecha: string; estado: string; contexto?: string; decision: string; objetivo: string; }): string {
    return `# ADR ${data.id} - ${data.titulo}

**Autor:** ${data.autor}
**Fecha:** ${data.fecha}
**Estado:** ${data.estado}

## Contexto

${data.contexto ?? ''}

## Objetivo

${data.objetivo}

## Decisión

${data.decision}

## Consecuencias

- `;
  }

  async crearADR(input: unknown, opts?: { commit?: boolean; force?: boolean }): Promise<ADR> {
    const datos = esquemaCreacionADR.parse(input);
    // Validar nombre/slug para detección de inglés y registrar propuestas si aplica
    try {
      const { validarYRegistrarNombre } = await import('../../nucleo/servicios/servicio-validacion-creacion');
      const slug = this.slug(datos.titulo);
      const res = await validarYRegistrarNombre(`adr-${slug}`, 'adr');
      if (res.hayIngles && !opts?.force) {
        throw new Error('El título del ADR contiene indicios de inglés. Use --force para forzar o ejecute revisar-idioma para generar propuestas.');
      }
    } catch (err) {
      // Si validar falla por algún motivo, no bloquear la creación (solo registrar advertencia)
      if ((err as Error).message.includes('indicios de inglés')) throw err;
      // eslint-disable-next-line no-console
      console.warn('Advertencia al validar nombre ADR:', (err as Error).message);
    }

    await this.ensureBasePath();
    const id = crypto.randomUUID();
    const fecha = new Date().toISOString();
    const estado: ADR['estado'] = 'pendiente';
    const nombre = `${fecha.split('T')[0]}-${this.slug(datos.titulo)}-${id}.md`;
    const ruta = path.join(this.basePath, nombre);
    const contenido = this.plantillaContenido({ id, titulo: datos.titulo, autor: datos.autor, fecha, estado, contexto: datos.contexto, decision: datos.decision, objetivo: datos.objetivo });
    await fs.writeFile(ruta, contenido, { encoding: 'utf8' });

    // Commit automático si hay repo Git y no estamos en modo test
    const commit = opts?.commit ?? true;
    if (commit) {
      try {
        const { esRepositorioGit, commitArchivo } = await import('./git');
        const esRepo = await esRepositorioGit(this.basePath);
        if (esRepo) {
          const mensaje = `chore(adr): crear ADR ${id} - ${datos.titulo} (autor=${datos.autor})`;
          await commitArchivo(this.basePath, ruta, mensaje, { nombre: datos.autor, email: `${datos.autor.replace(/\s+/g,'').toLowerCase()}@local` });
        }
      } catch (err) {
        // No bloquear el flujo por errores de Git; registrar y continuar
        // eslint-disable-next-line no-console
        console.warn('Advertencia: no se pudo realizar commit automático del ADR:', (err as Error).message);
      }
    }

    return {
      id,
      titulo: datos.titulo,
      autor: datos.autor,
      fechaCreacion: fecha,
      estado,
      objetivo: datos.objetivo,
      decisión: datos.decision,
      contexto: datos.contexto,
    };
  }

  async listarADR(): Promise<Array<{ id: string; titulo: string; ruta: string }>> {
    await this.ensureBasePath();
    const archivos = await fs.readdir(this.basePath);
    return archivos
      .filter((f) => f.endsWith('.md'))
      .map((f) => ({ id: f, titulo: f, ruta: path.join(this.basePath, f) }));
  }

  private async encontrarPorId(idOrFilename: string): Promise<string | null> {
    await this.ensureBasePath();
    const archivos = await fs.readdir(this.basePath);
    const encontrado = archivos.find((f) => f.includes(idOrFilename) || f === idOrFilename);
    return encontrado ? path.join(this.basePath, encontrado) : null;
  }

  async leerADR(idOrFilename: string): Promise<string> {
    const ruta = await this.encontrarPorId(idOrFilename);
    if (!ruta) throw new Error('ADR no encontrado');
    return fs.readFile(ruta, 'utf8');
  }

  async actualizarADR(idOrFilename: string, cambios: Partial<{ titulo: string; autor: string; objetivo: string; decision: string; contexto: string; estado: ADR['estado'] }>, opts?: { commit?: boolean; autorCommit?: { nombre: string; email: string } }): Promise<void> {
    const ruta = await this.encontrarPorId(idOrFilename);
    if (!ruta) throw new Error('ADR no encontrado');
    const contenidoActual = await fs.readFile(ruta, 'utf8');

    // Extraer metadatos simples del header
    const headerMatch = contenidoActual.match(/^# ADR\s+([^\s]+)\s+-\s+(.+)\n\n\*\*Autor:\*\*\s*(.*)\n\*\*Fecha:\*\*\s*(.*)\n\*\*Estado:\*\*\s*(.*)\n/);
    const id = headerMatch ? headerMatch[1] : path.basename(ruta);
    const titulo = cambios.titulo ?? (headerMatch ? headerMatch[2] : '');
    const autor = cambios.autor ?? (headerMatch ? headerMatch[3] : '');
    const fecha = headerMatch ? headerMatch[4] : new Date().toISOString();
    const estado = cambios.estado ?? (headerMatch ? (headerMatch[5] as ADR['estado']) : 'pendiente');

    const nuevaDecision = cambios.decision ?? (contenidoActual.includes('\n## Decisión\n\n') ? contenidoActual.split('\n## Decisión\n\n')[1].split('\n\n## Consecuencias')[0] : '');
    const nuevoObjetivo = cambios.objetivo ?? (contenidoActual.includes('\n## Objetivo\n\n') ? contenidoActual.split('\n## Objetivo\n\n')[1].split('\n\n## Decisión')[0] : '');
    const nuevoContexto = cambios.contexto ?? (contenidoActual.includes('\n## Contexto\n\n') ? contenidoActual.split('\n## Contexto\n\n')[1].split('\n\n## Objetivo')[0] : '');

    const nuevoContenido = this.plantillaContenido({ id, titulo, autor, fecha, estado, contexto: nuevoContexto, decision: nuevaDecision, objetivo: nuevoObjetivo });
    await fs.writeFile(ruta, nuevoContenido, { encoding: 'utf8' });

    const commit = opts?.commit ?? true;
    if (commit) {
      try {
        const { esRepositorioGit, commitArchivo } = await import('./git');
        const esRepo = await esRepositorioGit(this.basePath);
        if (esRepo) {
          const mensaje = `chore(adr): actualizar ADR ${id} - ${titulo}`;
          await commitArchivo(this.basePath, ruta, mensaje, opts?.autorCommit ?? { nombre: autor || 'automatizado', email: 'automatizado@local' });
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('Advertencia: no se pudo realizar commit automático de actualización ADR:', (err as Error).message);
      }
    }
  }

  async eliminarADR(idOrFilename: string, opts?: { commit?: boolean; autorCommit?: { nombre: string; email: string } }): Promise<void> {
    const ruta = await this.encontrarPorId(idOrFilename);
    if (!ruta) throw new Error('ADR no encontrado');
    await fs.rm(ruta, { force: true });

    const commit = opts?.commit ?? true;
    if (commit) {
      try {
        const { esRepositorioGit, commitArchivo } = await import('./git');
        const esRepo = await esRepositorioGit(this.basePath);
        if (esRepo) {
          const mensaje = `chore(adr): eliminar ADR ${path.basename(ruta)}`;
          await commitArchivo(this.basePath, ruta, mensaje, opts?.autorCommit ?? { nombre: 'automatizado', email: 'automatizado@local' });
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn('Advertencia: no se pudo realizar commit automático de eliminación ADR:', (err as Error).message);
      }
    }
  }
}

