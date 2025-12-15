# ADR-0025: Propuesta para cambiar metadata 'approved' → 'aprobado' en MANIFEST/MD asociados

Estado: propuesta
Autor: jhoavera
Fecha: 2025-12-15

## Contexto
En el Lote 003 se detectó una propuesta cuya metadata incluye el sufijo `approved` en el nombre de archivo de una propuesta relacionada con asignación de propietarios: `manifest_owner_assignment_proposal_aggressive.approved.md`.

Objetivo: normalizar la metadata al español técnico empresarial (`approved` → `aprobado`) sin modificar el contenido del `.md` hasta que exista una decisión formal.

## Opciones consideradas

- Opción A (propuesta): Renombrar la metadata (filename) de `approved` a `aprobado` para todas las propuestas relacionadas y dejar el contenido del `.md` intacto. Esta acción es de baja intrusividad y mejora consistencia terminológica.

- Opción B: Cambiar también el contenido del `.md` para reflejar la traducción (por ejemplo, cambiar cadenas dentro del `.md`). Requiere aprobar un ADR explícito y revisión humana, ya que altera artefactos de documentación.

- Opción C: No cambiar nada — mantener `approved` como excepción reconocida en el glosario.

## Decisión (propuesta)
Ejecutar Opción A: renombrar metadata (`approved` → `aprobado`) en los archivos de propuesta y manifest, sin modificar el contenido de `.md`. Para cambios de contenido en `.md`, abrir una tarea ADR adicional y no aplicar cambios hasta su aprobación.

## Consecuencias
- Ventajas: mayor consistencia terminológica, facilita automatización y búsqueda por palabras en español.
- Riesgos: posible confusión temporal para colaboradores que esperen `approved` en nombres; mitigado con un comunicado y actualización de `glosario`.

## Validación y seguimiento
- Crear registro en `reports/review_batches/batch_003_reconciliation.md` indicando el cambio hecho.
- Si se aprueba posteriormente cambiar el contenido del `.md`, crear un ADR específico y ejecutar cambios bajo el proceso de revisión habitual.

## Archivos relacionados
- `reports/review_batches/batch_3_reconciliation.csv`
- `reports/review_batches/batch_3_reconciliation.md`
- `reportes/propietarios/manifiesto_owner_assignment_proposal_aggressive.aprobado.md.name.propuesta`

- ADR abierto relacionado: [documentacion-ssot/ADRs/ADR-0026-cambio-contenido-md.propuesta.md](documentacion-ssot/ADRs/ADR-0026-cambio-contenido-md.propuesta.md) — evaluación para cambios en el `.md` (NO aplicar hasta aprobación del ADR).

---

Solicito revisión y aprobación del ADR para proceder a aplicar naming-consistency amplio si se acuerda.
