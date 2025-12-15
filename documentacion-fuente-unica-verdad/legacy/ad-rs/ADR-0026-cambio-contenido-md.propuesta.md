---
adr: ADR-0026
title: Propuesta: Cambio de contenido en `.md` asociado a la metadata renombrada
status: propuesta
date: 2025-12-15
authors: [jhoavera]
related: [ADR-0025]
---

## Contexto
Durante la conciliación del Lote 3 se renombró la metadata de archivos de propuesta de `approved` → `aprobado` (metadata filename only). El archivo afectado más relevante es:

- `reportes/propietarios/manifiesto_owner_assignment_proposal_aggressive.aprobado.md` (contenido no modificado)

Existe autorización explícita para abrir un ADR que evalúe la posibilidad de modificar también el contenido del `.md` asociado, pero los cambios de contenido NO deben aplicarse hasta aprobación expresa de este ADR.

## Opciones consideradas

- Opción A: No modificar el contenido del `.md` y mantener sólo el renombrado de metadata (estado actual).
- Opción B: Traducir y normalizar el contenido del `.md` al Español Técnico Empresarial (puede requerir ajustes de formato y validación manual).
- Opción C: Mantener el `.md` en el idioma y forma actuales como excepción documentada en el glosario.

## Propuesta / Decisión (pendiente)

Abrir formalmente este ADR (ADR-0026) para evaluar Opción B con criterios de validación claros. No ejecutar cambios en el `.md` hasta que ADR-0026 sea aprobada y se haya definido un plan de aplicación por lotes, incluyendo:

- Generación de respaldo (tar.gz) del archivo y carpeta relacionados.
- Dry-run y tests de verificación de integridad (scripts locales existentes).
- Registro en `reports/rename_apply_results_batch_3_metadata_*.csv` y actualización del `estructura_manifiesto.yml` si procede.

## Consecuencias

- Ventajas: coherencia terminológica completa y mejora de búsquedas/automatización en español.
- Riesgos: modificaciones manuales en artefactos de documentación que requieren revisión humana; posible necesidad de actualizar referencias o enlaces.

## Validación y seguimiento

- Registrar la aprobación o rechazo de ADR-0026 en este archivo (actualizar `status` a `accepted` o `rejected`).
- Si se aprueba: realizar los cambios por sub‑lotes con backups y ejecutar `npx tsc --noEmit` en los módulos afectados cuando corresponda.

---

Solicito revisión y aprobación de ADR-0026 para proceder con la evaluación y un plan de aplicación controlado.
