/*
 * Esquema Drizzle para tabla `auditoria_cambios`.
 * Usado por repositorios para registrar eventos de auditoría.
 */
let pgTableImpl: any;
let uuidImpl: any;
let varcharImpl: any;
let jsonbImpl: any;
let timestampImpl: any;

try {
  // Intentar requerir drizzly/pg-core; en entornos de test puede no estar disponible
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const core = require('drizzle-orm/pg-core');
  pgTableImpl = core.pgTable;
  uuidImpl = core.uuid;
  varcharImpl = core.varchar;
  jsonbImpl = core.jsonb;
  timestampImpl = core.timestamp;
} catch (_err) {
  // Fallback: exportar un placeholder para evitar fallos de import en entornos sin dependencia
  pgTableImpl = null;
  uuidImpl = null;
  varcharImpl = null;
  jsonbImpl = null;
  timestampImpl = null;
}

export const auditoria_cambios = pgTableImpl ? pgTableImpl('auditoria_cambios', {
  id: uuidImpl('id').defaultRandom().primaryKey(),
  entidad: varcharImpl('entidad', { length: 100 }).notNull(),
  entidad_id: uuidImpl('entidad_id').notNull(),
  operacion: varcharImpl('operacion', { length: 20 }).notNull(),
  autor_id: uuidImpl('autor_id').notNull(),
  timestamp: timestampImpl('timestamp').defaultNow().notNull(),
  diff: jsonbImpl('diff'),
  git_ref: varcharImpl('git_ref', { length: 255 }),
}) : ({} as any);
