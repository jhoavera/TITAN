import type { RepositorioGlosario } from './interfaz-repositorio-glosario';
import type { GlosarioRow } from '../base-de-datos/esquemas/esquema-glosario';

/**
 * Implementación ligera basada en Drizzle + pg.
 * Para evitar romper entornos de prueba sin dependencia instalada, las importaciones
 * se hacen de forma dinámica en tiempo de ejecución.
 */
export class RepositorioGlosarioDrizzle implements RepositorioGlosario {
  private db: any;
  private glosario: any;

  constructor(databaseUrl: string) {
    if (!databaseUrl) throw new Error('DATABASE_URL requerida para usar RepositorioGlosarioDrizzle');
    // lazy load para evitar errores cuando dependencia no está instalada
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { drizzle } = require('drizzle-orm');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Pool } = require('pg');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { glosarioTabla } = require('../base-de-datos/esquemas/esquema-glosario');

    const pool = new Pool({ connectionString: databaseUrl });
    this.db = drizzle(pool);
    this.glosario = glosarioTabla;
  }

  async listar(): Promise<GlosarioRow[]> {
    return (await this.db.select().from(this.glosario)) as GlosarioRow[];
  }

  async buscarPorTermino(termino: string): Promise<GlosarioRow | null> {
    const rows = await this.db.select().from(this.glosario).where(this.glosario.termino.eq(termino));
    return rows[0] ?? null;
  }

  async crear(entrada: { termino: string; definicion: string; autor?: string }): Promise<GlosarioRow> {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    await this.db.insert(this.glosario).values({ id, termino: entrada.termino, definicion: entrada.definicion, estado: 'pendiente', autor: entrada.autor ?? null });
    const row = await this.buscarPorTermino(entrada.termino);
    if (!row) throw new Error('No se pudo crear entrada en glosario');
    return row as GlosarioRow;
  }

  async actualizar(id: string, cambios: Partial<Omit<GlosarioRow, 'id' | 'creado_en'>>): Promise<GlosarioRow | null> {
    await this.db.update(this.glosario).set(cambios).where(this.glosario.id.eq(id));
    const rows = await this.db.select().from(this.glosario).where(this.glosario.id.eq(id));
    return rows[0] ?? null;
  }

  async eliminar(id: string): Promise<boolean> {
    const res = await this.db.delete(this.glosario).where(this.glosario.id.eq(id));
    return (res.rowCount ?? 0) > 0;
  }
}

export default RepositorioGlosarioDrizzle;
