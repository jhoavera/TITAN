# ADR 0006c: Incluir assets y recursos front-end en el Manifiesto

**Estado:** Proposed
**Fecha:** 2025-12-14
**Autor:** jhoavera / automation

## Contexto

Los recursos de frontend (CSS, imágenes, iconos, assets) y ciertos archivos estáticos están presentes en la plantilla pero no estaban incluidos explícitamente en el manifiesto derivado del SSOT.

## Decisión Propuesta

Incluir las rutas de `frontend` y subdirectorios de assets en el manifiesto con `owner: team-frontend` y `template: code` para asegurar que se preservan en proyectos generados.

## Justificación

- Evita la pérdida de recursos visuales y elementos estáticos necesarios para despliegues y pruebas locales.

## Artefactos

- `reports/manifest_owner_template_assets_filled.csv` (propuesta de owners para assets). **Count: 307**
- `reports/manifest_owner_template_proposal_0006.csv` (propuesta de owners para assets)
- `config/structure_manifest_exact_from_template_0006.yml`

## Checklist

- [ ] Revisar lista de assets en el CSV.
- [ ] Confirmar `team-frontend` como owner.
- [ ] Aprobar ADR para aplicar cambios en PR posterior.
