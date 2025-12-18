-- Migración 0002: funciones y triggers para mantener fecha_actualizacion, versiones y registrar auditoría
-- Crea funciones que son independientes de la aplicación y registran eventos en `auditoria_cambios`.

-- Función helper: convertir registro a jsonb
CREATE OR REPLACE FUNCTION public.row_to_jsonb(input_record anyelement)
RETURNS jsonb LANGUAGE sql IMMUTABLE AS $$
  SELECT to_jsonb(input_record);
$$;

-- Función que registra auditoría en cada INSERT/UPDATE/DELETE
CREATE OR REPLACE FUNCTION public.fn_registrar_auditoria() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  v_operacion VARCHAR := TG_OP;
  v_new jsonb;
  v_old jsonb;
  v_git_ref VARCHAR := current_setting('app.operador_git_ref', true);
BEGIN
  IF TG_OP = 'INSERT' THEN
    v_new := row_to_jsonb(NEW);
    v_git_ref := COALESCE(NEW.git_ref::text, v_git_ref);
    INSERT INTO public.auditoria_cambios (entidad, entidad_id, operacion, autor_id, diff, git_ref)
    VALUES (TG_TABLE_NAME, NEW.id, 'CREAR', COALESCE(NEW.autor_id, '00000000-0000-0000-0000-000000000000')::uuid, jsonb_build_object('nueva', v_new), v_git_ref);
    RETURN NEW;
  ELSIF TG_OP = 'UPDATE' THEN
    v_new := row_to_jsonb(NEW);
    v_old := row_to_jsonb(OLD);
    v_git_ref := COALESCE(NEW.git_ref::text, v_git_ref);
    INSERT INTO public.auditoria_cambios (entidad, entidad_id, operacion, autor_id, diff, git_ref)
    VALUES (TG_TABLE_NAME, NEW.id, 'ACTUALIZAR', COALESCE(NEW.autor_id, COALESCE(OLD.autor_id, '00000000-0000-0000-0000-000000000000'))::uuid, jsonb_build_object('antes', v_old, 'despues', v_new), v_git_ref);
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    v_old := row_to_jsonb(OLD);
    v_git_ref := COALESCE(OLD.git_ref::text, v_git_ref);
    INSERT INTO public.auditoria_cambios (entidad, entidad_id, operacion, autor_id, diff, git_ref)
    VALUES (TG_TABLE_NAME, OLD.id, 'ELIMINAR', COALESCE(OLD.autor_id, '00000000-0000-0000-0000-000000000000')::uuid, jsonb_build_object('antes', v_old), v_git_ref);
    RETURN OLD;
  END IF;
  RETURN NULL; -- no debería llegar aquí
END;
$$;

-- Función para actualizar fecha_actualizacion y aumentar versión en tablas que lo requieran
CREATE OR REPLACE FUNCTION public.fn_actualizar_metadatos_version() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    NEW.fecha_actualizacion := NOW();
    IF TG_TABLE_NAME = 'glosario_terminos' THEN
      NEW.version := COALESCE(OLD.version, 1) + 1;
    ELSIF TG_TABLE_NAME = 'adrs' THEN
      NEW.numero_version := COALESCE(OLD.numero_version, 1) + 1;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

-- Crear triggers en tablas objetivo
DROP TRIGGER IF EXISTS tg_auditar_glosario ON public.glosario_terminos;
DROP TRIGGER IF EXISTS tg_actualizar_metadatos_glosario ON public.glosario_terminos;
CREATE TRIGGER tg_actualizar_metadatos_glosario
  BEFORE UPDATE ON public.glosario_terminos
  FOR EACH ROW EXECUTE FUNCTION public.fn_actualizar_metadatos_version();

CREATE TRIGGER tg_auditar_glosario
  AFTER INSERT OR UPDATE OR DELETE ON public.glosario_terminos
  FOR EACH ROW EXECUTE FUNCTION public.fn_registrar_auditoria();

DROP TRIGGER IF EXISTS tg_auditar_adrs ON public.adrs;
DROP TRIGGER IF EXISTS tg_actualizar_metadatos_adrs ON public.adrs;
CREATE TRIGGER tg_actualizar_metadatos_adrs
  BEFORE UPDATE ON public.adrs
  FOR EACH ROW EXECUTE FUNCTION public.fn_actualizar_metadatos_version();

CREATE TRIGGER tg_auditar_adrs
  AFTER INSERT OR UPDATE OR DELETE ON public.adrs
  FOR EACH ROW EXECUTE FUNCTION public.fn_registrar_auditoria();

-- Nota: la función intenta leer app.operador_git_ref; la aplicación puede establecerla con `SET LOCAL app.operador_git_ref = 'refs/...';` dentro de una transacción
