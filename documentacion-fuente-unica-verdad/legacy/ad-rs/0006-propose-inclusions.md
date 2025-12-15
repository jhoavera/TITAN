# ADR 0006: Incluir rutas faltantes y reconciliar manifiestos (Draft)

**Status:** Proposed (Draft)
**Date:** 2025-12-14
**Author:** jhoavera / automation
**Approved By:** (TBD)

## Context

Se han detectado discrepancias entre:
- El árbol extraído de la documentación SSOT (`documento-maestro-*.md`) — representado en `reports/generated_from_md.yml`.
- El manifiesto propuesto `config/structure_manifest_proposed.yml`.
- La plantilla física `scripts/despliegue/TITAN-MSP-v13.0/`.

Adjunto: `reports/manifest_md_proposed_template_comparison.csv` contiene la matriz completa (columna por fuente).

## Observaciones Clave

- `generated_from_md.yml` (derivado directamente del SSOT) tiene 1048 entradas.
- `config/structure_manifest.yml` (aplicado) tiene 1048 entradas.
- `config/structure_manifest_proposed.yml` tiene 1049 entradas (difiriendo en una o más rutas).
- La plantilla física en `scripts/despliegue/TITAN-MSP-v13.0` tiene 1049 items; el item extra es `scripts/despliegue/verificar-estructura-completa.sh` (presente en repo raíz, no en el manifiesto exacto desde MD).

Además, hay un conjunto sustancial de rutas que aparecen en el manifiesto propuesto pero no fueron extraídas por la versión generada a partir del MD (véase CSV para lista completa). Muchas de estas diferencias corresponden a pruebas (`pruebas` o `pruebas/unitarias`) y assets adicionales del frontend y datos (binarios o recursos). Esto puede indicar que la fuente MD no contiene todas las líneas del árbol o que el manifiesto propuesto contiene extensiones (ej. placeholders o entradas de 'cache' y 'temp-files').

## Propuesta de Decision

1. Aprobar la inclusión controlada de rutas faltantes que son *requeridas* por el equipo técnico (ej: pruebas, assets) mediante:
   - Crear un ADR por cada categoría significativa (p. ej. `0006a-pruebas-incluir`, `0006b-assets-incluir`).
   - Cada ADR debe listar rutas exactas y el propietario propuesto.
2. Para la discrepancia de `scripts/despliegue/verificar-estructura-completa.sh`, propongo incluirla en el manifiesto (como archivo utilitario) y asignar `owner: team-infra`.
3. No modificar los `.md` originales: si se necesita que el SSOT incluya más rutas, proponer un ADR separado para editar el MD con trazabilidad (y un diff propuesto incluido en la ADR).

## Impacto y Riesgos

- Impacto bajo: recuperación y verificación local ya funcionan (tests de apply+verify pasan).
- Riesgo: cambios no autorizados en MD o en el manifiesto pueden generar inconsistencias; por eso proponemos el proceso ADR.

## Next Steps Recomendados

- Revisión humana de la columna `in_proposed_manifest != in_generated_from_md` del CSV para decidir inclusión/exclusión.
- Preparar ADRs pequeñas y específicas (una por categoría), con propietario propuesto y ejemplos de uso.
- Una vez aprobadas las ADRs, ejecutar `assign_owners_templates.py`, generar `reports/..._filled.csv` y aplicar los cambios al manifiesto en un PR con backups.

---

Adjuntos:
- `reports/manifest_md_proposed_template_comparison.csv`
- `reports/generated_from_md.yml`
- `reports/manifest_owner_template_exact_md_filled.csv` (si requiere owners previos)
