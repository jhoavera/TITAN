# ADR 0006b: Incluir directorios y archivos de `pruebas` en el Manifiesto

**Estado:** Proposed
**Fecha:** 2025-12-14
**Autor:** jhoavera / automation

## Contexto

Se detectaron múltiples rutas relacionadas con `pruebas` (unitarias e integración) presentes en la plantilla `scripts/despliegue/TITAN-MSP-v13.0` que no estaban reflejadas en el manifiesto derivado del SSOT.

## Decisión Propuesta

Incluir de forma explícita en el manifiesto las rutas bajo los nodos de `pruebas` (por ejemplo `api/pruebas`, `api/src/.../pruebas`, `pruebas/compatibilidad`, etc.). Propongo asignar `owner: team-api` para las pruebas relacionadas con `api`, y `team-qa` para las pruebas de integración/compatibilidad de alto nivel.

## Justificación

- Las pruebas son artefactos necesarios para la calidad y la reproducibilidad del proyecto.
- Incluirlas en el manifiesto facilita su preservación en plantillas y evita omisiones accidentales.

## Acciones Propuestas

- Lista exacta de rutas: ver `reports/manifest_md_proposed_template_comparison.csv` (filtrar `pruebas`).
- Owner propuesto por ruta prefijada: `api/*` → `team-api`; `pruebas/*` → `team-qa`.

## Artefactos

- `reports/manifest_owner_template_pruebas_filled.csv` (fila(s) para cada ruta con owner propuesto). **Count: 104**
- `reports/manifest_owner_template_proposal_0006.csv` (fila(s) para cada ruta con owner propuesto).
- `config/structure_manifest_exact_from_template_0006.yml` (manifiesto que incluye todas las rutas de la plantilla).

## Checklist

- [ ] Revisar lista completa de rutas de `pruebas` en el CSV.
- [ ] Confirmar owners propuestos.
- [ ] Aprobar este ADR para proceder con el PR que actualice el manifiesto (solo tras aprobación).
