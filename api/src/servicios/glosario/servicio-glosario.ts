import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';

const EsquemaPropuesta = z.object({
  termino: z.string().min(1),
  definicion: z.string().min(1),
  autor: z.string().min(1),
});

type Propuesta = z.infer<typeof EsquemaPropuesta>;

export class ServicioGlosario {
  private basePath: string;

  constructor(basePath?: string) {
    this.basePath = basePath ?? path.join(process.cwd(), 'documentacion-fuente-unica-verdad', 'glosario-biblioteca');
  }

  async ensureBasePath(): Promise<void> {
    await fs.mkdir(this.basePath, { recursive: true });
  }

  /** Crea una propuesta de entrada en el glosario (no se aprueba automáticamente) */
  async crearPropuesta(propuesta: unknown): Promise<{ id: string; ruta: string }> {
    const datos = EsquemaPropuesta.parse(propuesta);
    await this.ensureBasePath();
    const id = crypto.randomUUID();
    const nombre = `${new Date().toISOString().split('T')[0]}-propuesta-${datos.termino.replace(/[^a-z0-9ñáéíóú\-]/gi, '-').slice(0, 60)}-${id}.md`;
    const ruta = path.join(this.basePath, 'propuestas');
    await fs.mkdir(ruta, { recursive: true });
    const full = path.join(ruta, nombre);
    const contenido = `# Propuesta de Glosario: ${datos.termino}

**Autor:** ${datos.autor}
**Fecha:** ${new Date().toISOString()}

## Definición propuesta

${datos.definicion}
`;
    await fs.writeFile(full, contenido, { encoding: 'utf8' });
    return { id, ruta: full };
  }

  async listarPropuestas(): Promise<string[]> {
    const dir = path.join(this.basePath, 'propuestas');
    await this.ensureBasePath();
    try {
      const archivos = await fs.readdir(dir);
      return archivos.map((f) => path.join(dir, f));
    } catch (err) {
      return [];
    }
  }
}
