/*
 * Esquema Drizzle para tabla `adrs`
 * ADRs (Arquitectura Decisiones de Registro) en español técnico empresarial.
 */
let pgTableImpl: any;
let uuidImpl: any;
let varcharImpl: any;
let textImpl: any;
let timestampImpl: any;
let jsonbImpl: any;
let integerImpl: any;
let indexImpl: any;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const core = require('drizzle-orm/pg-core');
  pgTableImpl = core.pgTable;
  uuidImpl = core.uuid;
  varcharImpl = core.varchar;
  textImpl = core.text;
  timestampImpl = core.timestamp;
  jsonbImpl = core.jsonb;
  integerImpl = core.integer;
  indexImpl = core.index;
} catch (_err) {
  pgTableImpl = null;
}

export const adrs = pgTableImpl ? pgTableImpl('adrs', {
  id: uuidImpl('id').defaultRandom().primaryKey(),
  identificador_inquilino: uuidImpl('identificador_inquilino').notNull(),
  numero: integerImpl('numero').notNull(),
  slug: varcharImpl('slug', { length: 200 }).notNull(),
  titulo: varcharImpl('titulo', { length: 200 }).notNull(),
  estado: varcharImpl('estado', { length: 20 }).notNull().default('BORRADOR'),
  autor_id: uuidImpl('autor_id').notNull(),
  objetivo: textImpl('objetivo').notNull(),
  decision: textImpl('decision').notNull(),
  motivos: jsonbImpl('motivos').notNull().default('[]'),
  alternativas: jsonbImpl('alternativas').notNull().default('{}'),
  referencias: jsonbImpl('referencias').notNull().default('[]'),
  fecha_creacion: timestampImpl('fecha_creacion').defaultNow().notNull(),
  fecha_actualizacion: timestampImpl('fecha_actualizacion').defaultNow().notNull(),
  fecha_aprobacion: timestampImpl('fecha_aprobacion'),
  numero_version: integerImpl('numero_version').notNull().default(1),
  notas_revision: textImpl('notas_revision'),
  tags: jsonbImpl('tags').notNull().default('[]'),
  archivo_markdown: textImpl('archivo_markdown'),
  git_ref: varcharImpl('git_ref', { length: 255 }),
}, (tabla) => ({
  idx_inquilino_numero: indexImpl('idx_inquilino_numero').on(tabla.identificador_inquilino, tabla.numero),
})) : ({} as any);
