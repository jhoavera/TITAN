/*
 * Esquema Drizzle para tabla `adrs`
 * ADRs (Arquitectura Decisiones de Registro) en español técnico empresarial.
 */
import { pgTable, uuid, varchar, text, timestamp, jsonb, integer, index } from 'drizzle-orm/pg-core';

export const adrs = pgTable('adrs', {
  id: uuid('id').defaultRandom().primaryKey(),
  identificador_inquilino: uuid('identificador_inquilino').notNull(),
  numero: integer('numero').notNull(),
  slug: varchar('slug', { length: 200 }).notNull(),
  titulo: varchar('titulo', { length: 200 }).notNull(),
  estado: varchar('estado', { length: 20 }).notNull().default('BORRADOR'),
  autor_id: uuid('autor_id').notNull(),
  objetivo: text('objetivo').notNull(),
  decision: text('decision').notNull(),
  motivos: jsonb('motivos').notNull().default('[]'),
  alternativas: jsonb('alternativas').notNull().default('{}'),
  referencias: jsonb('referencias').notNull().default('[]'),
  fecha_creacion: timestamp('fecha_creacion').defaultNow().notNull(),
  fecha_actualizacion: timestamp('fecha_actualizacion').defaultNow().notNull(),
  fecha_aprobacion: timestamp('fecha_aprobacion').nullable(),
  numero_version: integer('numero_version').notNull().default(1),
  notas_revision: text('notas_revision').nullable(),
  tags: jsonb('tags').notNull().default('[]'),
  archivo_markdown: text('archivo_markdown').nullable(),
  git_ref: varchar('git_ref', { length: 255 }).nullable(),
}, (tabla) => ({
  idx_inquilino_numero: index('idx_inquilino_numero').on(tabla.identificador_inquilino, tabla.numero),
}));
