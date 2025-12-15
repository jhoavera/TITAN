/*
 * Esquema Drizzle para tabla `glosario_terminos`
 * Todo en español técnico empresarial. Cumplir TypeScript strict.
 */
import { pgTable, uuid, varchar, text, timestamp, jsonb, integer, index } from 'drizzle-orm/pg-core';

export const glosario_terminos = pgTable('glosario_terminos', {
  id: uuid('id').defaultRandom().primaryKey(),
  identificador_inquilino: uuid('identificador_inquilino').notNull(),
  termino: varchar('termino', { length: 120 }).notNull(),
  slug: varchar('slug', { length: 150 }).notNull(),
  definicion: text('definicion').notNull(),
  categoria: varchar('categoria', { length: 50 }).notNull(),
  traduccion: varchar('traduccion', { length: 255 }).nullable(),
  idioma_origen: varchar('idioma_origen', { length: 5 }).notNull().default('es'),
  estado: varchar('estado', { length: 20 }).notNull().default('PENDIENTE'),
  autor_id: uuid('autor_id').notNull(),
  fecha_creacion: timestamp('fecha_creacion').defaultNow().notNull(),
  fecha_actualizacion: timestamp('fecha_actualizacion').defaultNow().notNull(),
  metadatos: jsonb('metadatos').notNull().default('{}'),
  version: integer('version').notNull().default(1),
  aprobado_por: uuid('aprobado_por').nullable(),
  comentario_revision: text('comentario_revision').nullable(),
}, (tabla) => ({
  idx_inquilino_termino: index('idx_inquilino_termino').on(tabla.identificador_inquilino, tabla.termino),
}));
