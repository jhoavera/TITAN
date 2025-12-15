/* Repositorio para `adrs`.
 * Implementación mínima para CRUDs. Todo en español técnico empresarial.
 */
import type { DB } from '../../base-de-datos/cliente';
import { adrs } from '../../base-de-datos/esquemas/esquema-adrs';
import type { InferModel } from 'drizzle-orm';

export type ADR = InferModel<typeof adrs>;

export const crearADR = async (db: DB, datos: Partial<ADR>, identificadorInquilino: string, autorId: string): Promise<ADR> => {
  const resultado = await (db as any).insert(adrs).values({
    identificador_inquilino: identificadorInquilino,
    numero: datos.numero,
    slug: datos.slug ?? (datos.numero ? String(datos.numero).padStart(4, '0') : '0000'),
    titulo: datos.titulo,
    estado: 'BORRADOR',
    autor_id: autorId,
    objetivo: datos.objetivo,
    decision: datos.decision,
    motivos: datos.motivos ?? [],
    alternativas: datos.alternativas ?? {},
    referencias: datos.referencias ?? [],
    tags: datos.tags ?? [],
    archivo_markdown: datos.archivo_markdown ?? null,
  }).returning('*');
  return resultado[0];
};

export const obtenerListaADRs = async (db: DB, filtros: { estado?: string, limit?: number, offset?: number }, identificadorInquilino: string) => {
  const qb = (db as any).select().from(adrs).where({ identificador_inquilino: identificadorInquilino });
  if (filtros.estado) qb.where({ estado: filtros.estado });
  if (filtros.limit) qb.limit(filtros.limit);
  if (filtros.offset) qb.offset(filtros.offset);
  const rows = await qb.execute();
  return rows;
};

export const obtenerADRPorId = async (db: DB, id: string, identificadorInquilino: string) => {
  const row = await (db as any).select().from(adrs).where({ id, identificador_inquilino: identificadorInquilino }).limit(1).execute();
  return row[0] ?? null;
};

export const actualizarADR = async (db: DB, id: string, cambios: Partial<ADR>, identificadorInquilino: string) => {
  const resultado = await (db as any).update(adrs).set({ ...cambios }).where({ id, identificador_inquilino: identificadorInquilino }).returning('*');
  return resultado[0];
};

export const eliminarADR = async (db: DB, id: string, identificadorInquilino: string) => {
  const resultado = await (db as any).delete(adrs).where({ id, identificador_inquilino: identificadorInquilino }).returning('id');
  return resultado[0] ?? null;
};
