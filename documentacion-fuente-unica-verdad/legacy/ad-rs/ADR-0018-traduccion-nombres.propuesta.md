# ADR-0018: Propuesta de traducción y normalización de nombres a Español Técnico Empresarial

## Estado: propuesta

### Resumen
Proponer traducciones sistemáticas de nombres de archivos y carpetas del repositorio al Español Técnico Empresarial. Esta ADR define alcance, criterios y proceso de aprobación. No aplicar cambios hasta ADR aprobada.

### Alcance
- Nombres de archivos y carpetas (paths) en todo el workspace
- Generación de archivos `.propuesta` y reportes CSV para revisión

### Reglas básicas
- Preferir traducción literal a español técnico cuando exista (e.g., template→plantilla, manifest→manifiesto).
- Si no se encuentra traducción adecuada, agregar al `glosario_proyecto.yml` con justificación técnica.
- No modificar `.md` hasta ADR aprobada (solo generar `.propuesta`).

### Procedimiento propuesto
1. Ejecutar el detector y generar `reports/translation_proposals_files.csv` y `translation_proposals_docs.csv`.
2. Revisar por responsables de área (por sub‑lote: `api`, `frontend`, `modelos`, etc.).
3. Aprobación por ADR y aplicar los renombrados por sub‑lotes con backup y dry‑run.

### Artefactos generados
- `reports/translation_proposals_files.csv`
- `reports/translation_proposals_docs.csv`
- `documentacion-ssot/glosario_proyecto.yml`
- `.propuesta` files para `.md` bajo `documentacion/`

### Razonamiento técnico
Mejorar consistencia de idioma, buscabilidad y adherencia a Español Técnico Empresarial.
