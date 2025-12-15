# ADR 0026 — Propuesta Operativa: Aplicación controlada de renombres por lotes

Estado: propuesta (pendiente aprobación humana)

Fecha: 2025-12-15

Contexto
-------
Se generaron 43 propuestas de renombrado para archivos/carpetas alineadas con el objetivo de migrar nomenclatura técnica a Español Técnico Empresarial (ver `reports/rename_proposals.csv` y `reports/rename_proposals_batch_*.csv`). Se realizaron dry‑runs, incluyendo un modo estricto que detecta colisiones, ciclos, conflictos padre/hijo, existencia del destino y referencias en manifiesto/código. Los dry‑run estricos por lote produjeron `reports/rename_apply_dryrun_batch_*.csv`.

Decisión Propuesta
------------------
1. Autorizar la aplicación por lotes *solo* tras la aprobación humana de este ADR y del ADR de lote asociado.
2. Procedimiento por lote aprobado:
   - Ejecutar `apply_rename_batch.py --batch N --apply --manifest <manifiesto>` en modo local.
   - El script debe:
     - Crear backup tar.gz en `respaldo/renombrados/` antes de cambiar nada.
     - Excluir explicitamente archivos `.md` de los renombres por política (se renombrarán solo con ADRs de documentación).
     - Intentar actualizar coincidencias exactas en `configuracion/estructura_manifiesto.yml` y registrar diferencias.
     - Ejecutar `scripts/despliegue/verificar-estructura-completa.sh --fix` y `npx tsc --noEmit` al final.
   - Registrar resultados en `reports/rename_apply_results_batch_{N}_*.csv`.

3. Criterios de rechazo automático de la ejecución:
   - Colisiones (varios orígenes hacia el mismo destino) detectadas en dry‑run.
   - Ciclos de renombrado entre dos rutas.
   - Conflictos padre/hijo no resueltos.

Archivos de referencia
---------------------
- `reports/rename_proposals.csv` (43 propuestas)
- `reports/rename_proposals_batch_1.csv`
- `reports/rename_proposals_batch_2.csv`
- `reports/rename_proposals_batch_3.csv`
- `reports/rename_apply_dryrun_batch_1_20251215T034231Z.csv`
- `reports/rename_apply_dryrun_batch_2_20251215T034241Z.csv`
- `reports/rename_apply_dryrun_batch_3_20251215T034245Z.csv`
- `scripts/herramientas/apply_rename_batch.py` (lógica de apply/backups/manifest update)

Listado de propuestas por lote (resumen):
- **Lote 1:** `reports/rename_proposals_batch_1.csv` (revise `reports/rename_apply_dryrun_batch_1_*.csv` para detalles)
- **Lote 2:** `reports/rename_proposals_batch_2.csv` (revise `reports/rename_apply_dryrun_batch_2_*.csv` para detalles)
- **Lote 3:** `reports/rename_proposals_batch_3.csv` (revise `reports/rename_apply_dryrun_batch_3_*.csv` para detalles)

Firma / Aprobación
------------------
Responsable del proyecto: ____________________  (Esta firma aprueba la ejecución de los lotes listados arriba)
