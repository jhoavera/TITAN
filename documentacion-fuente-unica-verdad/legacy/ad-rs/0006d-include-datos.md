# ADR 0006d: Incluir rutas de `datos` y `modelos` en el Manifiesto

**Estado:** Proposed
**Fecha:** 2025-12-14
**Autor:** jhoavera / automation

## Contexto

Rutas bajo `datos` y `modelos` contienen archivos de datos, caches y modelos que son relevantes para pruebas y despliegues locales. Estas rutas estaban presentes en la plantilla física pero no estaban todas reflejadas en el manifiesto derivado del SSOT.

## Decisión Propuesta

Incluir explícitamente en el manifiesto los directorios y archivos bajo `datos` y `modelos` con `owner: team-data` y `template: data`.

## Justificación

- Mantener estos artefactos en el manifiesto facilita reproducibilidad de entornos locales y pruebas off-line.

## Artefactos

- `reports/manifest_owner_template_datos_filled.csv` (propuesta de owners para datos y modelos). **Count: 125**
- `reports/manifest_owner_template_proposal_0006.csv`
- `config/structure_manifest_exact_from_template_0006.yml`

## Checklist

- [ ] Revisar y confirmar la lista exacta de rutas en el CSV.
- [ ] Aprobar ADR para aplicar cambios en PR posterior.
