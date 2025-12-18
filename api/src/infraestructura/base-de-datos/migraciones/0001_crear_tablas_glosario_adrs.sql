-- Migración inicial: crear tablas `glosario_terminos`, `adrs` y `auditoria_cambios`
-- Requisitos: habilitar extensión pgcrypto para gen_random_uuid()

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Tabla: glosario_terminos
CREATE TABLE IF NOT EXISTS public.glosario_terminos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identificador_inquilino UUID NOT NULL,
  termino VARCHAR(120) NOT NULL,
  slug VARCHAR(150) NOT NULL,
  definicion TEXT NOT NULL,
  categoria VARCHAR(50) NOT NULL,
  traduccion VARCHAR(255),
  idioma_origen VARCHAR(5) NOT NULL DEFAULT 'es',
  estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
  autor_id UUID NOT NULL,
  fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
  fecha_actualizacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
  metadatos JSONB DEFAULT '{}'::jsonb NOT NULL,
  version INTEGER DEFAULT 1 NOT NULL,
  aprobado_por UUID,
  comentario_revision TEXT
);

-- Índices
CREATE UNIQUE INDEX IF NOT EXISTS uk_glosario_inquilino_termino ON public.glosario_terminos (identificador_inquilino, LOWER(termino));
CREATE INDEX IF NOT EXISTS idx_glosario_inquilino_estado ON public.glosario_terminos (identificador_inquilino, estado);
-- GIN para búsqueda full-text en definición
CREATE INDEX IF NOT EXISTS idx_glosario_definicion_tsv ON public.glosario_terminos USING GIN (to_tsvector('spanish', definicion));

-- Habilitar RLS y política básica de aislamiento por inquilino
ALTER TABLE public.glosario_terminos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS aislamiento_inquilino_glosario ON public.glosario_terminos;
CREATE POLICY aislamiento_inquilino_glosario ON public.glosario_terminos
  FOR ALL
  USING (identificador_inquilino = current_setting('app.identificador_inquilino_actual')::uuid)
  WITH CHECK (identificador_inquilino = current_setting('app.identificador_inquilino_actual')::uuid);

-- Tabla: adrs
CREATE TABLE IF NOT EXISTS public.adrs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identificador_inquilino UUID NOT NULL,
  numero INTEGER NOT NULL,
  slug VARCHAR(200) NOT NULL,
  titulo VARCHAR(200) NOT NULL,
  estado VARCHAR(20) NOT NULL DEFAULT 'BORRADOR',
  autor_id UUID NOT NULL,
  objetivo TEXT NOT NULL,
  decision TEXT NOT NULL,
  motivos JSONB DEFAULT '[]'::jsonb NOT NULL,
  alternativas JSONB DEFAULT '{}'::jsonb NOT NULL,
  referencias JSONB DEFAULT '[]'::jsonb NOT NULL,
  fecha_creacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
  fecha_actualizacion TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
  fecha_aprobacion TIMESTAMP WITHOUT TIME ZONE,
  numero_version INTEGER DEFAULT 1 NOT NULL,
  notas_revision TEXT,
  tags JSONB DEFAULT '[]'::jsonb NOT NULL,
  archivo_markdown TEXT,
  git_ref VARCHAR(255)
);

-- Índices
CREATE UNIQUE INDEX IF NOT EXISTS uk_adrs_inquilino_numero ON public.adrs (identificador_inquilino, numero);
CREATE INDEX IF NOT EXISTS idx_adrs_inquilino_estado ON public.adrs (identificador_inquilino, estado);

-- Habilitar RLS para ADRs
ALTER TABLE public.adrs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS aislamiento_inquilino_adrs ON public.adrs;
CREATE POLICY aislamiento_inquilino_adrs ON public.adrs
  FOR ALL
  USING (identificador_inquilino = current_setting('app.identificador_inquilino_actual')::uuid)
  WITH CHECK (identificador_inquilino = current_setting('app.identificador_inquilino_actual')::uuid);

-- Tabla: auditoria_cambios
CREATE TABLE IF NOT EXISTS public.auditoria_cambios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entidad VARCHAR(100) NOT NULL,
  entidad_id UUID NOT NULL,
  operacion VARCHAR(20) NOT NULL,
  autor_id UUID NOT NULL,
  timestamp TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW() NOT NULL,
  diff JSONB,
  git_ref VARCHAR(255)
);

CREATE INDEX IF NOT EXISTS idx_auditoria_entidad ON public.auditoria_cambios (entidad, entidad_id);
