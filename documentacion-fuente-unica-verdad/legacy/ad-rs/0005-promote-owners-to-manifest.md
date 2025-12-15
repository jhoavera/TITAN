---
adr: 0005
title: Promover asignaciones de owner del reporte al manifiesto
date: 2025-12-14
author: jhoavera
status: proposed
---

Context
-------
- Tras generar y aprobar `reports/manifest_owner_assignment_proposal_aggressive.csv` (ADRs/0004), se requiere promover dichas asignaciones al manifiesto canónico `config/structure_manifest.yml` para tener la fuente de la verdad actualizada.

Decision
--------
- Aplicar los valores `owner` y `template` desde `reports/manifest_owner_template_exact_md_filled.csv` (actualizado con la propuesta agresiva) al `config/structure_manifest.yml` mediante una operación local y trazada.
- Registrar la operación con metadatos en el manifiesto (`appliedOwners` con `appliedBy`, `appliedAt`, `source`) y generar un backup del manifiesto antes de la modificación.

Consequences
------------
- El manifiesto reflejará las asignaciones aprobadas por ADR 0004. No se modifican los `.md` originales.
- Se preserva trazabilidad: backup CSV y backup del manifiesto, registro en ADR 0005 y commit local.

Approval
--------
- Approved-by: jhoavera
- Approved-at: 2025-12-14T01:20:00-05:00
