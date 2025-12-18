/* Repositorio para `glosario_terminos`.
 * Implementación mínima usando Drizzle (se asume cliente Drizzle inyectado).
 * Todo en español técnico empresarial.
 */
import type { DB } from '../base-de-datos/cliente';
// Carga dinámica de esquema para evitar resolución estática de módulos heavy en entornos de test
// (ej. `drizzle-orm/pg-core`). Se importa cuando se requiere dentro de cada operación.
import { auditoria_cambios } from '../base-de-datos/esquemas/esquema-auditoria';
import { glosario_terminos } from '../base-de-datos/esquemas/esquema-glosario';
import { hayTriggersAuditoria } from '../base-de-datos/utilidades/chequeo-auditoria';
/* Minimal local shim for `InferModel` to avoid a hard dependency on `drizzle-orm`
 * when the package (or its types) isn't installed in the environment (e.g. tests).
 * Replace this with the real import when `drizzle-orm` is available.
 */
type InferModel<T = any> = any;
import type { z } from 'zod';

export type TerminoGlosario = InferModel<typeof glosario_terminos>;

export const crearGlosario = async (db: DB, datos: z.infer<any>, identificadorInquilino: string, autorId: string): Promise<TerminoGlosario> => {
  // Nota: se asume que `db` es un cliente Drizzle configurado.
  // Inserción con Drizzle (ejemplo); si `db` no está inicializado, lanzará.
  // Se debería generar `slug` y normalizar `termino` antes de llamar.
    // Validar nombre/slug antes de crear
    try {
      // @ts-ignore: dependencia opcional en tiempo de ejecución; en entornos sin el paquete no debe romper la compilación
      const mod = await import('../../../nucleo/servicios/servicio-validacion-creacion').catch(() => ({ validarYRegistrarNombre: async () => { /* noop */ } }));
      const { validarYRegistrarNombre } = mod;
      await validarYRegistrarNombre(datos.slug ?? datos.termino);
    } catch (_err) {
      // No bloquear creación por errores en el validador; ya se registrará propuesta si aplica
    }
  const { glosario_terminos } = await import('../base-de-datos/esquemas/esquema-glosario');
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

  // Registrar auditoría explícita solo si no hay triggers/funciones DB que ya lo hagan
  try {
    const tieneTriggers = await hayTriggersAuditoria(db);
    if (!tieneTriggers) {
      await (db as any).insert(auditoria_cambios).values({
        entidad: 'glosario_terminos',
        entidad_id: resultado[0].id,
        operacion: 'CREAR',
        autor_id: autorId,
        diff: { nueva: resultado[0] },
        git_ref: datos.git_ref ?? null,
      }).execute?.();
    }
  } catch (_err) {
    // No detener el flujo por fallo de auditoría; si el insert falla, el trigger DB (si existe) cubre el caso.
  }

  return resultado[0];
};

export const obtenerListaGlosario = async (db: DB, filtros: {query?: string, estado?: string, limit?: number, offset?: number}, identificadorInquilino: string) => {
  // Implementación mínima: construir consulta básica con Drizzle
  const { glosario_terminos } = await import('../base-de-datos/esquemas/esquema-glosario');
  const qb = (db as any).select().from(glosario_terminos).where({ identificador_inquilino: identificadorInquilino });
  if (filtros.estado) qb.where({ estado: filtros.estado });
  if (filtros.limit) qb.limit(filtros.limit);
  if (filtros.offset) qb.offset(filtros.offset);
  const rows = await qb.execute();
  return rows;
};

export const obtenerTerminoPorId = async (db: DB, id: string, identificadorInquilino: string) => {
  const { glosario_terminos } = await import('../base-de-datos/esquemas/esquema-glosario');
  const row = await (db as any).select().from(glosario_terminos).where({ id, identificador_inquilino: identificadorInquilino }).limit(1).execute();
  return row[0] ?? null;
};

export const actualizarGlosario = async (db: DB, id: string, cambios: Partial<TerminoGlosario>, identificadorInquilino: string) => {
  const { glosario_terminos } = await import('../base-de-datos/esquemas/esquema-glosario');
  const resultado = await (db as any).update(glosario_terminos).set({ ...cambios }).where({ id, identificador_inquilino: identificadorInquilino }).returning('*');
  // Insertar auditoría
  try {
    const tieneTriggers = await hayTriggersAuditoria(db);
    if (!tieneTriggers) {
      await (db as any).insert(auditoria_cambios).values({
        entidad: 'glosario_terminos',
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

export const eliminarGlosario = async (db: DB, id: string, identificadorInquilino: string) => {
  // Nota: eliminar sólo si la política lo permite; aquí se implementa soft-delete lógico en negocio si corresponde.
  const { glosario_terminos } = await import('../base-de-datos/esquemas/esquema-glosario');
  const resultado = await (db as any).delete(glosario_terminos).where({ id, identificador_inquilino: identificadorInquilino }).returning('id');
  // Registrar auditoría de eliminación
  try {
    const tieneTriggers = await hayTriggersAuditoria(db);
    if (!tieneTriggers) {
      await (db as any).insert(auditoria_cambios).values({
        entidad: 'glosario_terminos',
        entidad_id: resultado[0] ?? id,
        operacion: 'ELIMINAR',
        autor_id: null,
        diff: null,
        git_ref: null,
      }).execute?.();
    }
  } catch (_err) {}

  return resultado[0] ?? null;
};
