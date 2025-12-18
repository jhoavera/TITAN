import fs from 'fs';
import path from 'path';

export type TerminoGlosario = {
  id: string;
  termino: string;
  definicion: string;
  estado: 'pendiente' | 'en_revision' | 'aprobado' | 'rechazado';
  creadoEn: string;
  autor?: string;
};

export class ServicioGlosario {
  private almacenPath: string;
  private datos: TerminoGlosario[] = [];
  private repo: import('../infraestructura/repositorios/interfaz-repositorio-glosario').RepositorioGlosario | null = null;

  constructor(almacenPath?: string, repo?: import('../infraestructura/repositorios/interfaz-repositorio-glosario').RepositorioGlosario) {
    // Permitir sobreescribir el path de almacenamiento para tests aislados mediante la variable de entorno TITAN_TMP_GLOSARIO
    const envPath = process.env.TITAN_TMP_GLOSARIO
    this.almacenPath = almacenPath ?? (envPath ? path.resolve(envPath) : path.resolve(process.cwd(), 'tmp-glosario.json'));
    this.repo = repo ?? null;

    if (!this.repo) {
      try {
        if (fs.existsSync(this.almacenPath)) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          this.datos = JSON.parse(fs.readFileSync(this.almacenPath, 'utf-8')) as TerminoGlosario[];
        } else {
          this.flush();
        }
      } catch (e) {
        this.datos = [];
        this.flush();
      }
    }
  }

  private flush(): void {
    fs.writeFileSync(this.almacenPath, JSON.stringify(this.datos, null, 2), 'utf-8');
  }

  async listar(): Promise<TerminoGlosario[]> {
    if (this.repo) {
      const rows = await this.repo.listar();
      return rows.map((r) => ({ id: r.id, termino: r.termino, definicion: r.definicion, estado: r.estado as any, creadoEn: r.creado_en ?? new Date().toISOString(), autor: r.autor }));
    }
    return [...this.datos];
  }

  private normalizeText(s: string): string {
    return s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
  }

  async buscar(termino: string): Promise<TerminoGlosario[]> {
    if (this.repo) {
      const r = await this.repo.buscarPorTermino(termino);
      return r ? [{ id: r.id, termino: r.termino, definicion: r.definicion, estado: r.estado as any, creadoEn: r.creado_en ?? new Date().toISOString(), autor: r.autor }] : [];
    }
    const q = this.normalizeText(termino)
    return this.datos.filter((t) => this.normalizeText(t.termino).includes(q) || this.normalizeText(t.definicion).includes(q));
  }

  async crear(entrada: Omit<TerminoGlosario, 'id' | 'creadoEn' | 'estado'>): Promise<TerminoGlosario> {
    if (this.repo) {
      const r = await this.repo.crear({ termino: entrada.termino, definicion: entrada.definicion, autor: entrada.autor });
      return { id: r.id, termino: r.termino, definicion: r.definicion, estado: r.estado as any, creadoEn: r.creado_en ?? new Date().toISOString(), autor: r.autor };
    }

    const nuevo: TerminoGlosario = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      termino: entrada.termino,
      definicion: entrada.definicion,
      autor: entrada.autor,
      estado: 'pendiente',
      creadoEn: new Date().toISOString(),
    };
    this.datos.push(nuevo);
    this.flush();
    return nuevo;
  }

  async actualizar(id: string, cambios: Partial<Omit<TerminoGlosario, 'id' | 'creadoEn'>>): Promise<TerminoGlosario | null> {
    if (this.repo) {
      const r = await this.repo.actualizar(id, cambios as any);
      if (!r) return null;
      return { id: r.id, termino: r.termino, definicion: r.definicion, estado: r.estado as any, creadoEn: r.creado_en ?? new Date().toISOString(), autor: r.autor };
    }

    const idx = this.datos.findIndex((d) => d.id === id);
    if (idx === -1) return null;
    const actualizado = { ...this.datos[idx], ...cambios } as TerminoGlosario;
    this.datos[idx] = actualizado;
    this.flush();
    return actualizado;
  }

  async eliminar(id: string): Promise<boolean> {
    if (this.repo) {
      return await this.repo.eliminar(id);
    }
    const orig = this.datos.length;
    this.datos = this.datos.filter((d) => d.id !== id);
    const cambiado = this.datos.length !== orig;
    if (cambiado) this.flush();
    return cambiado;
  }
}

export default ServicioGlosario;
