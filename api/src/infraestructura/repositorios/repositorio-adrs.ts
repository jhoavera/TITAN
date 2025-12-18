/* Repositorio para `adrs`.
 * Implementación mínima para CRUDs. Todo en español técnico empresarial.
 */
import type { DB } from '../base-de-datos/cliente';
// Carga dinámica de esquema para evitar resolución estática de módulos heavy en entornos de test
// (ej. `drizzle-orm/pg-core`). Se importa cuando se requiere dentro de cada operación.
import { auditoria_cambios } from '../base-de-datos/esquemas/esquema-auditoria';
import { hayTriggersAuditoria } from '../base-de-datos/utilidades/chequeo-auditoria';
import type { InferModel } from 'drizzle-orm';

export type ADR = InferModel<typeof adrs>;

export const crearADR = async (db: DB, datos: Partial<ADR>, identificadorInquilino: string, autorId: string): Promise<ADR> => {
  // Validar slug/archivo antes de crear y registrar propuesta si no cumple
  try {
    const { validarYRegistrarNombre } = await import('../../nucleo/servicios/servicio-validacion-creacion');
    await validarYRegistrarNombre(datos.slug ?? (datos.archivo_markdown ?? 'adr-' + (datos.numero ?? '0000')));
  } catch (_err) {}
  const { adrs } = await import('../base-de-datos/esquemas/esquema-adrs');
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
  // Registrar auditoría explícita solo si no hay triggers/funciones DB que ya lo hagan
  try {
    const tieneTriggers = await hayTriggersAuditoria(db);
    if (!tieneTriggers) {
      await (db as any).insert(auditoria_cambios).values({
        entidad: 'adrs',
        entidad_id: resultado[0].id,
        operacion: 'CREAR',
        autor_id: autorId,
        diff: { nueva: resultado[0] },
        git_ref: (datos as any).git_ref ?? null,
      }).execute?.();
    }
  } catch (_err) {}
  return resultado[0];
};

export const obtenerListaADRs = async (db: DB, filtros: { estado?: string, limit?: number, offset?: number }, identificadorInquilino: string) => {
  const { adrs } = await import('../base-de-datos/esquemas/esquema-adrs');
  const qb = (db as any).select().from(adrs).where({ identificador_inquilino: identificadorInquilino });
  if (filtros.estado) qb.where({ estado: filtros.estado });
  if (filtros.limit) qb.limit(filtros.limit);
  if (filtros.offset) qb.offset(filtros.offset);
  const rows = await qb.execute();
  return rows;
};

export const obtenerADRPorId = async (db: DB, id: string, identificadorInquilino: string) => {
  const { adrs } = await import('../base-de-datos/esquemas/esquema-adrs');
  const row = await (db as any).select().from(adrs).where({ id, identificador_inquilino: identificadorInquilino }).limit(1).execute();
  return row[0] ?? null;
};

export const actualizarADR = async (db: DB, id: string, cambios: Partial<ADR>, identificadorInquilino: string) => {
  const { adrs } = await import('../base-de-datos/esquemas/esquema-adrs');
  const resultado = await (db as any).update(adrs).set({ ...cambios }).where({ id, identificador_inquilino: identificadorInquilino }).returning('*');
  // Registrar auditoría si no existe trigger a nivel DB
  try {
    const tieneTriggers = await hayTriggersAuditoria(db);
    if (!tieneTriggers) {
      await (db as any).insert(auditoria_cambios).values({
        entidad: 'adrs',
        entidad_id: resultado[0].id,
        operacion: 'ACTUALIZAR',
        autor_id: cambios.autor_id ?? resultado[0].autor_id,
        diff: { despues: resultado[0] },
        git_ref: (cambios as any).git_ref ?? null,
      }).execute?.();
    }
  } catch (_err) {}

  return resultado[0];
};

export const eliminarADR = async (db: DB, id: string, identificadorInquilino: string) => {
  const { adrs } = await import('../base-de-datos/esquemas/esquema-adrs');
  const resultado = await (db as any).delete(adrs).where({ id, identificador_inquilino: identificadorInquilino }).returning('id');
  try {
    await (db as any).insert(auditoria_cambios).values({
      entidad: 'adrs',
      entidad_id: resultado[0] ?? id,
      operacion: 'ELIMINAR',
      autor_id: null,
      diff: null,
      git_ref: null,
    }).execute?.();
  } catch (_err) {}
  return resultado[0] ?? null;
};
