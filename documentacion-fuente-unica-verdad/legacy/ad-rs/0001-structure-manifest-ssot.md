---
title: "0001 - Manifiesto de Estructura (SSOT) para TITAN-MSP v13.0"
date: 2025-12-13
status: draft
authors: ["Automated: Copilot Draft"]
---

Context
-------

El proyecto TITAN-MSP v13.0 define una estructura de carpetas y archivos detallada en `documentacion-ssot` (Parte 4). Se requiere que la estructura del repositorio sea reproducible mediante scripts y que exista un único punto de verdad (SSOT) para la estructura: `config/structure_manifest.yml`.

Problem
-------

Actualmente existen diferencias entre:
- El documento maestro (documentacion-ssot Parte 4).
- El `config/structure_manifest_preview.yml` actual (preview automático parcial).
- Los scripts de creación/verificación (`scripts/despliegue/crear-estructura-titan-v13.sh`, `verificar-estructura-completa.sh`) que crean un subconjunto limitado de la estructura.

Objetivo
--------

1. Consolidar `documentacion-ssot` como la fuente de verdad para la estructura y generar un manifest YAML (`config/structure_manifest.yml`) que represente exactamente el árbol de la Parte 4.
2. Mantener la trazabilidad: cada `entry` del manifest tendrá metadatos (`owner`, `required`, `template`, `mode`, `createdBy`, `approvedBy`, `tags`).
3. Modificar los scripts de creación/verificación para que acepten y consuman el manifest (modo `--manifest`) como SSOT y se mantengan en `--dry-run` por defecto.

Propuesta de decisión
---------------------

- Generar un manifiesto final `config/structure_manifest.yml` a partir del `documentacion-ssot/parte-4.md` y validarlo antes de promoverlo a SSOT.
- Implementar un flujo de revisión obligatorio (ADR) antes de modificar documentos `.md` maestros.
- Mantener `config/structure_manifest_preview.yml` como preview hasta que se apruebe el ADR y el manifest final.
- Actualizar `scripts/despliegue/crear-estructura-titan-v13.sh` y `verificar-estructura-completa.sh` para usar el manifest final.

Consecuencias
-------------

- Positivo: Reproducibilidad, trazabilidad y validación automática en CI.
- Negativo: Revisión humana necesaria para validar propietarios/plantillas de ~1,049 entradas.

Rollout Plan
------------

1. Crear este ADR (Draft) y recopilar revisiones de propietarios por carpeta.
2. Validar el manifest regenerado (preview) y el CSV de recomendaciones (/tmp/regenerated_manifest_recommendations.csv).
3. Actualizar `config/structure_manifest_preview.yml` con el manifest final (solo tras aprobar ADR).
4. Actualizar scripts (crear, verificar) para consumir el manifest; mantener `--dry-run` por defecto y `--fix` o `--apply` para acciones mutativas; agregar pruebas de CI para verificación (PR gating).
5. Tras la aprobación y merge, ejecutar un release para crear el `config/structure_manifest.yml` y plantillas iniciales en `config/templates/`.

References
----------

- `documentacion-ssot/documento-maestro-parte-4.md` (definición del árbol)
- `config/structure_manifest_preview.yml` (preview actual)
- `/tmp/regenerated_manifest_final_preview.yml` (regen manifest preview automatizado)
- `/tmp/regenerated_manifest_recommendations.csv` (recomendaciones owner/required/template)
- `scripts/despliegue/crear-estructura-titan-v13.sh`
- `scripts/despliegue/verificar-estructura-completa.sh`

Approval
--------

Este ADR requiere aprobación explícita para promover y actualizar la SSOT. Tras la aprobación se aplicarán los cambios a `config/structure_manifest.yml` y `scripts/` en PR separado.

-- End Draft
