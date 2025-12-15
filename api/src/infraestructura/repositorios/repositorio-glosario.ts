/* Repositorio para `glosario_terminos`.
 * Implementación mínima usando Drizzle (se asume cliente Drizzle inyectado).
 * Todo en español técnico empresarial.
 */
import type { DB } from '../../base-de-datos/cliente';
import { glosario_terminos } from '../../base-de-datos/esquemas/esquema-glosario';
import type { InferModel } from 'drizzle-orm';
import type { z } from 'zod';

export type TerminoGlosario = InferModel<typeof glosario_terminos>;

export const crearGlosario = async (db: DB, datos: z.infer<any>, identificadorInquilino: string, autorId: string): Promise<TerminoGlosario> => {
  // Nota: se asume que `db` es un cliente Drizzle configurado.
  // Inserción con Drizzle (ejemplo); si `db` no está inicializado, lanzará.
  // Se debería generar `slug` y normalizar `termino` antes de llamar.
  const resultado = await (db as any).insert(glosario_terminos).values({
    identificador_inquilino: identificadorInquilino,
    termino: datos.termino,
    slug: datos.slug ?? datos.termino.toLowerCase().replace(/\s+/g, '-'),
    definicion: datos.definicion,
    categoria: datos.categoria,
    traduccion: datos.traduccion ?? null,
    idioma_origen: datos.idioma_origen ?? 'es',
    estado: 'PENDIENTE',
    autor_id: autorId,
    metadatos: datos.metadatos ?? {},
  }).returning('*');

  return resultado[0];
};

export const obtenerListaGlosario = async (db: DB, filtros: {query?: string, estado?: string, limit?: number, offset?: number}, identificadorInquilino: string) => {
  // Implementación mínima: construir consulta básica con Drizzle
  const qb = (db as any).select().from(glosario_terminos).where({ identificador_inquilino: identificadorInquilino });
  if (filtros.estado) qb.where({ estado: filtros.estado });
  if (filtros.limit) qb.limit(filtros.limit);
  if (filtros.offset) qb.offset(filtros.offset);
  const rows = await qb.execute();
  return rows;
};

export const obtenerTerminoPorId = async (db: DB, id: string, identificadorInquilino: string) => {
  const row = await (db as any).select().from(glosario_terminos).where({ id, identificador_inquilino: identificadorInquilino }).limit(1).execute();
  return row[0] ?? null;
};

export const actualizarGlosario = async (db: DB, id: string, cambios: Partial<TerminoGlosario>, identificadorInquilino: string) => {
  const resultado = await (db as any).update(glosario_terminos).set({ ...cambios }).where({ id, identificador_inquilino: identificadorInquilino }).returning('*');
  return resultado[0];
};

export const eliminarGlosario = async (db: DB, id: string, identificadorInquilino: string) => {
  // Nota: eliminar sólo si la política lo permite; aquí se implementa soft-delete lógico en negocio si corresponde.
  const resultado = await (db as any).delete(glosario_terminos).where({ id, identificador_inquilino: identificadorInquilino }).returning('id');
  return resultado[0] ?? null;
};
