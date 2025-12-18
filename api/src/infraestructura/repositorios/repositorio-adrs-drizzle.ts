/* Implementación Drizzle para ADRs (CRUD). 
 * Sigue el patrón de `RepositorioGlosarioDrizzle` y usa conexiones perezosas para evitar romper entornos sin Drizzle.
 * Nombres y comentarios en español técnico empresarial.
 */

export class RepositorioADRsDrizzle {
  private db: any
  private adrs: any

  constructor(databaseUrl: string) {
    if (!databaseUrl) throw new Error('DATABASE_URL requerida para usar RepositorioADRsDrizzle')
    // carga dinámica para evitar errores cuando la dependencia no está instalada
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const drizzleMod = require('drizzle-orm')
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { Pool } = require('pg')
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { adrs } = require('@infraestructura/base-de-datos/esquemas/esquema-adrs')

    const pool = new Pool({ connectionString: databaseUrl })
    const drizzleFn = (drizzleMod && (drizzleMod.drizzle ?? drizzleMod.default ?? drizzleMod))
    if (typeof drizzleFn !== 'function') throw new Error('No se pudo cargar la función drizzle desde drizzle-orm')
    this.db = drizzleFn(pool)
    this.adrs = adrs
  }

  async crear(datos: { numero: number; titulo: string; objetivo: string; decision: string; identificador_inquilino: string; autor_id: string; archivo_markdown?: string; tags?: string[] }) {
    const row = await this.db.insert(this.adrs).values({
      identificador_inquilino: datos.identificador_inquilino,
      numero: datos.numero,
      slug: String(datos.numero).padStart(4, '0'),
      titulo: datos.titulo,
      estado: 'BORRADOR',
      autor_id: datos.autor_id,
      objetivo: datos.objetivo,
      decision: datos.decision,
      archivo_markdown: datos.archivo_markdown ?? null,
      tags: datos.tags ?? [],
    }).returning('*')
    return row[0]
  }

  async listar(identificadorInquilino: string, filtros?: { estado?: string; limit?: number; offset?: number }) {
    const qb = this.db.select().from(this.adrs).where({ identificador_inquilino: identificadorInquilino })
    if (filtros?.estado) qb.where({ estado: filtros.estado })
    if (filtros?.limit) qb.limit(filtros.limit)
    if (filtros?.offset) qb.offset(filtros.offset)
    const rows = await qb.execute()
    return rows
  }

  async obtenerPorId(id: string, identificadorInquilino: string) {
    const rows = await this.db.select().from(this.adrs).where({ id, identificador_inquilino: identificadorInquilino }).limit(1).execute()
    return rows[0] ?? null
  }

  async actualizar(id: string, cambios: Partial<Record<string, unknown>>, identificadorInquilino: string) {
    const res = await this.db.update(this.adrs).set({ ...cambios }).where({ id, identificador_inquilino: identificadorInquilino }).returning('*')
    return res[0]
  }

  async eliminar(id: string, identificadorInquilino: string) {
    const res = await this.db.delete(this.adrs).where({ id, identificador_inquilino: identificadorInquilino }).returning('id')
    return (res[0] && res[0].id) ?? null
  }
}

export default RepositorioADRsDrizzle
