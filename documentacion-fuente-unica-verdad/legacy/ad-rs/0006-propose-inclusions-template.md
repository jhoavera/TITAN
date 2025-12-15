# ADR 0006: Propuesta para Incluir Entradas Faltantes en el Manifiesto de Estructura

**Status:** Proposed
**Date:** YYYY-MM-DD
**Author:** PLACEHOLDER
**Approved By:** (to be filled on approval)

## Context

Se ha detectado una discrepancia entre las fuentes de verdad del proyecto:
- Documentación SSOT (markdown) que describe el árbol del repositorio.
- Manifiesto actual (`config/structure_manifest*.yml`) que se usa para crear proyectos.
- Plantilla de repo en `scripts/despliegue/TITAN-MSP-v13.0`.

Algunas rutas aparecen en el manifiesto propuesto pero no en el MD generado automáticamente, y viceversa. Antes de aplicar cualquier cambio que modifique la estructura o los `.md`, se requiere una decisión documentada.

## Problema

Queremos asegurarnos de que el manifiesto represente sin ambigüedad y al 100% el árbol que debe ser creado para nuevos proyectos (ni menos ni más). No se puede introducir, eliminar o modificar rutas sin trazabilidad (ADR aprobada) y sin asignación de `owner`.

## Decision (Propuesta)

- Aprobar la inclusión/exclusión de las rutas listadas en el informe `reports/manifest_md_proposed_template_comparison.csv` (filtrar por `in_proposed_manifest != in_generated_from_md`).
- Para cada ruta afectada crear una entrada en `reports/manifest_owner_template_exact_md_filled.csv` con `owner`, `template` y `approvedBy` antes de aplicar cambios.
- Crear un cambio confirmado en `config/structure_manifest.yml` mediante un PR donde:
  - Se incluya un `changelog` y `backup` automático del manifiesto previo.
  - Se documente el impacto (qué repositorios/CI/scripts consumen esta ruta).
- No modificar archivos `.md` originales hasta que se apruebe un ADR específico que describa la edición del SSOT.

## Consequences

- Positivo: Trazabilidad completa y reversibilidad.
- Negativo: Proceso burocrático adicional para cambios estructurales (aceptable por seguridad y coherencia).

## Procedure (Checklist para ejecutar si se aprueba)

- [ ] Validar con los equipos dueños propuestos (assign_owners_templates.py output).
- [ ] Crear/actualizar `reports/manifest_owner_template_exact_md_filled.csv` con owners aprobados.
- [ ] Generar diff del manifiesto y crear PR con la referencia del ADR.
- [ ] Ejecutar tests locales: `scripts/despliegue/tests/test_create_manifest_apply_and_verify_local_tempdir.sh` y `test_manifest_count_and_coverage.sh`.
- [ ] Marcar `approvedBy` y `approvedAt` en el manifiesto final.

## Related Artifacts

- `reports/manifest_md_proposed_template_comparison.csv`
- `reports/generated_from_md.yml`
- `config/structure_manifest_proposed.yml` and `config/structure_manifest.yml`

## Templates / Fields Needed

- `owner`: equipo o persona responsable (ej. `team-api`).
- `template`: nombre de plantilla a usar (ej. `code`, `docs`).
- `approvedBy`: login del aprobador.

## Approval

- Decisión y firma: (espacio para firmas o link a PR con aprobación)

---

(Nota: Rellena los elementos entre paréntesis y adjunta CSV con las rutas exactas afectadas antes de solicitar aprobación.)
