-- Migración: crear tabla glosario
-- Fecha: 2025-12-15
CREATE TABLE IF NOT EXISTS glosario (
  id TEXT PRIMARY KEY,
  termino TEXT NOT NULL UNIQUE,
  definicion TEXT NOT NULL,
  estado TEXT NOT NULL DEFAULT 'pendiente',
  autor TEXT,
  creado_en TIMESTAMP WITH TIME ZONE DEFAULT now()
);
