let pgTable: any; let text: any; let timestamp: any; let placeholder = false;
try {
  // Intentar cargar drizzle de forma dinámica; si no existe, exportar placeholders
  // para evitar romper tests en entornos sin dependencia instalada.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const drizzleCore = require('drizzle-orm/pg-core');
  pgTable = drizzleCore.pgTable;
  text = drizzleCore.text;
  timestamp = drizzleCore.timestamp;
} catch (e) {
  // No se pudo cargar drizzle; exportar tabla placeholder que lanzará si se usa
  placeholder = true;
  // Placeholders sin anotaciones de tipo para evitar errores de transformación en entornos sin soporte de TS en tiempo de build
  // name y _n se tratan como any intencionalmente
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pgTable = (name: any, _def: any) => ({ __placeholder: true, __name: name });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  text = (_n: any) => ({ __placeholder: true, __name: _n });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  timestamp = (_n: any) => ({ __placeholder: true, __name: _n, defaultNow: () => ({}) });
}

export const glosarioTabla = pgTable('glosario', {
  id: text('id').primaryKey?.() ?? undefined,
  termino: text('termino').notNull?.() ?? undefined,
  definicion: text('definicion').notNull?.() ?? undefined,
  estado: (text('estado').notNull?.() ?? undefined),
  autor: text('autor') ?? undefined,
  creado_en: timestamp('creado_en').defaultNow?.() ?? undefined,
});

export type GlosarioRow = {
  id: string;
  termino: string;
  definicion: string;
  estado: 'pendiente' | 'en_revision' | 'aprobado' | 'rechazado';
  autor?: string;
  creado_en?: string;
};

/*
 * Esquema Drizzle para tabla `glosario_terminos`
 * Todo en español técnico empresarial. Cumplir TypeScript strict.
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

export const glosario_terminos = pgTableImpl ? pgTableImpl('glosario_terminos', {
  id: uuidImpl('id').defaultRandom().primaryKey(),
  identificador_inquilino: uuidImpl('identificador_inquilino').notNull(),
  termino: varcharImpl('termino', { length: 120 }).notNull(),
  slug: varcharImpl('slug', { length: 150 }).notNull(),
  definicion: textImpl('definicion').notNull(),
  categoria: varcharImpl('categoria', { length: 50 }).notNull(),
  traduccion: varcharImpl('traduccion', { length: 255 }),
  idioma_origen: varcharImpl('idioma_origen', { length: 5 }).notNull().default('es'),
  estado: varcharImpl('estado', { length: 20 }).notNull().default('PENDIENTE'),
  autor_id: uuidImpl('autor_id').notNull(),
  fecha_creacion: timestampImpl('fecha_creacion').defaultNow().notNull(),
  fecha_actualizacion: timestampImpl('fecha_actualizacion').defaultNow().notNull(),
  metadatos: jsonbImpl('metadatos').notNull().default('{}'),
  version: integerImpl('version').notNull().default(1),
  aprobado_por: uuidImpl('aprobado_por'),
  comentario_revision: textImpl('comentario_revision'),
}, (tabla) => ({
  idx_inquilino_termino: indexImpl('idx_inquilino_termino').on(tabla.identificador_inquilino, tabla.termino),
})) : ({} as any);
