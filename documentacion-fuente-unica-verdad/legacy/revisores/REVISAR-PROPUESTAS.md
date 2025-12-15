# Guía de revisión de propuestas de renombrado / traducción

Propósito: instrucciones claras y checklist para revisión humana de propuestas generadas automáticamente.

Pasos recomendados:

1. Abrir el índice de lotes: `reports/review_batches/index.md` y elegir un lote.
2. Revisar `batch_XXX_README.md` para la lista y métricas del lote.
3. Para cada entrada en `batch_XXX.csv` añadir dos columnas nuevas: `review_decision` (APROBAR/RECHAZAR) y `review_notes` (breve justificación).
4. Si `propuesto` es un `.md`, comprobar que exista un ADR aprobado; si no, marcar `RECHAZAR` hasta que ADR sea aprobado.
5. Para `origen_exists==False` evaluar si la propuesta es correcta o requiere triage; documentar en `review_notes`.
6. Cuando un lote alcanza consenso (p.ej. 2 revisores o aprobaciones formales), marcar el CSV como `approved` y avisar al responsable para aplicar el lote.

Checklist (por propuesta):
- [ ] Origen correcto y actual
- [ ] Propuesta respeta nomenclatura en español técnico empresarial
- [ ] No rompe manifest ni referencias (si aplica)
- [ ] ADR presente y aprobado para cambios en `.md` (si aplica)
- [ ] Notas claras en caso de rechazo

Formato de entrega de la revisión:
- En el mismo `reports/review_batches/batch_XXX.csv` añadir columnas `review_decision,review_notes,reviewer,reviewed_at`.
- Guardar cambios y crear issue/PR puntual con el lote aprobado si corresponde.

Seguridad y política:
- NO aplicar cambios sobre rutas críticas sin respaldo y verificación (`respaldo/renombrados/` y `reports/rename_apply_dryrun_*`).
- Todas las aplicaciones deben ir acompañadas de backup y verificación (`scripts/despliegue/verificar-estructura-completa.sh` y `npx tsc --noEmit`).

Contacto del reviewers: jhoavera

Nota operativa:

- Lote 3 (sub-manual-001): investigación profunda completada; propuestas relacionadas marcadas como `applied` en `configuracion/estructura_manifiesto.yml` localmente (backup creado en `respaldo/renombrados/estructura_manifiesto_backup_*.yml`). Ver reportes en `reports/review_batches/batch_3_deep_investigation.md` y `reports/review_batches/manifiesto_applied_proposals_batch_3.yml`.
