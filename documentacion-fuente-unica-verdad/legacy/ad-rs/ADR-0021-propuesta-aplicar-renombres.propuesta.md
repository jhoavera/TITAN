# ADR-0021: Propuesta para aplicar renombrados masivos a Español Técnico Empresarial

## Estado: propuesta

### Resumen
Proponer el proceso controlado para aplicar renombrados de archivos y carpetas en el workspace al Español Técnico Empresarial. Esta ADR define criterios de aprobación, pasos para backup, dry‑run, pruebas y aplicación por sub‑lotes.

### Alcance
- Cambios en nombres de archivos y carpetas (paths) para todo el workspace.
- Aplicación por sub‑lotes (e.g., `scripts`, `api`, `frontend`, `modelos`, `documentacion`) con prioridad en `scripts`.

### Reglas clave
- No modificar `.md` originales sin ADR específico aprobado (solo generar `.propuesta`).
- Preservar acrónimos técnicos y nombres producto si aplica (`ADR`, `API`, `TS`, `CD`, `CI`, `MSP`).
- Generar backup completo y manifiesto de acciones (`reports/move_manifest_*_dryrun.csv`) antes de aplicar.
- Ejecutar pruebas locales y verificación de imports/modulos tras aplicar cada sub‑lote.

### Procedimiento propuesto
1. Ejecutar detector mejorado y generar `translation_proposals_files.csv` y manifiesto dry‑run.
2. Ejecutar triage avanzado y generar `missing_src_candidates.csv`.
3. Revisar en PR bundle por responsables de sub‑lote.
4. Aprobación ADR para aplicar cambios.
5. Aplicar renombres por sub‑lote: backup → dry‑run → apply → probar → documentar.

### Artefactos
- `reports/translation_proposals_files.csv`
- `reports/move_manifest_translation_dryrun.csv`
- `reports/missing_src_detailed.csv`
- `reports/missing_src_candidates.csv`
- PR bundle por sub‑lote (ej.: `PRs/pr-0010-scripts-batch-1/`)

### Observaciones
- Todo trabajo será local hasta aprobación y verificación completa.
