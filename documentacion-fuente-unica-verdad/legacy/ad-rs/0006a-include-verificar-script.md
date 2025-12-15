# ADR 0006a: Incluir `scripts/despliegue/verificar-estructura-completa.sh` en el Manifiesto

**Estado:** Proposed
**Fecha:** 2025-12-14
**Autor:** jhoavera / automation

## Contexto

El script `scripts/despliegue/verificar-estructura-completa.sh` es una utilidad usada para validar la estructura de proyectos creados por el manifiesto. Actualmente está presente en la plantilla (`scripts/despliegue/TITAN-MSP-v13.0`) pero no estaba incluido en el manifiesto exacto derivado del SSOT.

## Decisión Propuesta

Incluir `scripts/despliegue/verificar-estructura-completa.sh` como archivo obligatorio en el manifiesto de estructura (plantilla `code`) con `owner: team-infra`.

## Justificación

- Permite a los equipos verificar localmente que la estructura generada coincide con el manifiesto.
- Mejora reproducibilidad y permite validaciones automáticas en entornos locales sin acceder a la nube.

## Detalle de la inclusión

- Path: `scripts/despliegue/verificar-estructura-completa.sh`
- Tipo: file
- Owner propuesto: `team-infra`
- Template: `code`
- Requerido: `true`

## Impacto

- Bajo: solo añade una utilidad de verificación en los proyectos nuevos.

## Artefactos generados

- `reports/manifest_missing_in_proposed_0006.txt` (lista de rutas detectadas como faltantes en manifest propuesto)
- `config/structure_manifest_proposed_minimal_0006.yml` (manifiesto **mínimo** propuesto que incluye la ruta y mantiene compatibilidad con la creación local)
- `reports/manifest_owner_template_proposal_0006_minimal.csv` (mapeo de owners propuesto para la inclusión mínima)
- `reports/tests/test_create_manifest_apply_and_verify_local_tempdir_minimal_0006.log` (resultado de aplicar/validar localmente: MISSING-COUNT:0)
- `config/archive/manifests/structure_manifest_proposed_minimal_0006.yml` (manifiesto propuesto con la inclusión; entries: **1049**) 
- `reports/tests/test_create_manifest_apply_and_verify_local_tempdir.sh.log` (registro de ejecución: MISSING-COUNT:0)

**Nota:** Se realizó la aplicación local en un `mktemp` y la verificación dentro del directorio creado; la verificación contra el manifiesto mínimo arrojó `MISSING-COUNT:0`. Esto demuestra que la inclusión mínima es segura para ambientes locales y no requiere cambios adicionales en el SSOT `.md`.

## Checklist

- [ ] Revisar y aprobar el ADR 0006a
- [ ] Confirmar `owner` (por defecto: `team-infra`)
- [ ] Aplicar cambios al manifiesto en PR referenciado a este ADR (solo después de aprobación)
