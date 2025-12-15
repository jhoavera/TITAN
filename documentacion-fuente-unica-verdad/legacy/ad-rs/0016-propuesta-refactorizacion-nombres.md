---
adr: 0016
title: Propuesta: Refactorización global por lotes de nombres de archivos y carpetas (Español Técnico Empresarial)
date: 2025-12-14
status: accepted
proposedBy: jhoavera
approvedBy: jhoavera
approvedAt: '2025-12-14T16:55:00Z'

Context:
- Se ha identificado dispersión en la nomenclatura del repositorio (mezcla de inglés y español, formatos inconsistentes: CamelCase, underscores, espacios, etc.).
- Ya existen artefactos que proponen cambios y evidencias: `reports/move_manifest_aggressive_fs.csv`, `reports/move_manifest_modelos_datasets_dryrun.csv`, `reports/md_propuestas_fs_index.csv` y glosario inicial en `documentacion/glosario/diccionario-proyecto.md`.
- ADR-0013 y ADR-0015 establecen límites y procesos parciales (no tocar `.md` sin ADR-0013; proceso por lotes y dry‑run para renombrados).

Decision:
- Autorizar una refactorización controlada por lotes de nombres de archivos y carpetas para migrar a Español Técnico Empresarial con una política de nombres consistente (ver "Naming Policy"), aplicando el proceso de aprobación, dry‑run, backup, aplicación y verificación descrito abajo.

Scope:
- Cambios en nombres de carpetas y archivos en el repositorio que no impliquen modificación de contenido de `.md` hasta que ADR-0013 sea aprobado para cambios de contenido.
- Incluye: ficheros y directorios, plantillas, scripts auxiliares (nombres), entradas en `PRs/` y `reports/` cuando corresponda.
- Excluye: cambios semánticos en contenido de `.md`, cambios en dependencias externas, y renombres que afecten releases/artefactos on‑disk fuera del repo (a menos que haya plan de sincronización explícito).

Motivación:
- Mejora de la legibilidad y coherencia para equipos hispanohablantes.
- Facilita gobernanza, búsqueda, automatización y documentación central (glosario).
- Reduce la deuda técnica relacionada con nombres inconsistentes.

Naming Policy (resumen):
- Idioma: Español Técnico Empresarial (usar términos del glosario: `documentacion/glosario/diccionario-proyecto.md`).
- Formato: minúsculas, guiones (`-`) para separar palabras, sin espacios, evitar caracteres especiales.
- Conservación: mantener términos internacionales sin traducción si están en el glosario como "no traducir".

Pilot & Batches (propuesto):
1. Pilot (actual candidate): `modelos/datasets` — ya generado dry‑run (`reports/move_manifest_modelos_datasets_dryrun.csv`).
2. Batch 2: `reports/` → `reportes/` (filtrado: proposals dentro de `reports/` listadas en `reports/move_manifest_aggressive_fs.csv`).
3. Batch 3: `PRs/` (plantillas y PR-related docs), `templates/` → `plantillas/`.
4. Batch 4: Scripts y tests (`scripts/tests` → `scripts/pruebas`) y otros lotes prioritizados por impacto.

Process & Checklist (por lote):
1. Aprobación explícita de este ADR y del lote objetivo (registrar en ADR y `reports/`).
2. Generar mapping CSV para el lote (`move_manifest_<lote>.csv`) basado en `reports/move_manifest_aggressive_fs.csv` o propuestas manuales.
3. Ejecutar dry‑run: `apply_rename_mapping.py <mapping.csv> --out reports/move_manifest_<lote>_dryrun.csv --dry-run`.
4. Revisar dry‑run: resolver `missing-src`, referencias rotas, y actualizar mapping.
5. Crear backup y snapshot: `git branch backup/rename-<lote>-<ts>` y archivar checksums (sha256) en `reports/archive/<ts>/`.
6. Ejecutar apply controlado (local): `apply_rename_mapping.py <mapping.csv> --out reports/move_manifest_<lote>_applied.csv`.
7. Ejecutar verificación automática: tests, `scripts/despliegue/verificar-estructura-completa.sh`, comprobación de enlaces y búsqueda de referencias rotas (grep/rg).
8. Registrar evidencia (logs, CSVs) en `reports/archive/<ts>/` y preparar PR con cambios (NO pushear sin revisión final).
9. Si se detectan problemas, ejecutar el plan de reversión usando la rama de backup y el mapping invertido.

Verification & Metrics:
- Criterios de éxito por lote: todos los archivos/directorios renombrados existen en su nueva ruta, no hay referencias rotas en el tree (grep), los tests relevantes pasan, y la manifestación se mantiene consistente (`reports/md_manifest_mapping.csv` actualizado).
- KPI: tiempo medio por lote, número de `missing-src` en dry‑run, número de referencias actualizadas, porcentaje de cobertura del árbol objetivo.

Rollback & Risks:
- Riesgos: referencias rotas, scripts con rutas hardcodeadas, dependencias CI, cambios en releases.
- Mitigación: dry‑run exhaustivo, backups con rama, verificación automática y humana, despliegue en etapas pequeñas.

Dependencies & Approvals:
- ADR-0013 (para cambios en `.md`) debe estar aprobado antes de aplicar renombres que requieran editar contenido de `.md`.
- Revisores propuestos: responsable del repo (`jhoavera`), equipo de QA, al menos un revisor de la documentación.

Execution Evidence (referencias actuales):
- `reports/move_manifest_aggressive_fs.csv` — conjunto inicial de 1,288 propuestas detectadas.
- `reports/move_manifest_modelos_datasets_dryrun.csv` — dry‑run inicial del pilot.
- `reports/md_propuestas_fs_index.csv` — propuestas `.md.propuesta` generadas desde FS.
- `documentacion/glosario/diccionario-proyecto.md` — glosario y diccionario detectado.

Status Update (2025-12-14):
- Ejecutado dry‑run para lote `reports/` → `reportes/` utilizando propuestas filtradas: `reports/move_manifest_reports_batch.csv`.
- Resultado: `reports/move_manifest_reports_dryrun.csv` (152 propuestas con estado `proposed`).
- Revisión humana previa recomendada: revisar 152 propuestas, priorizar sub‑lotes por impacto y resolver casos con ambigüedad.

Consequences:
- Positivo: mayor coherencia, mejor experiencia de búsqueda y documentación, base para internacionalización de procesos.
- Negativo: requiere coordinación, revisión humana y tiempo de QA; existe riesgo de ruptura temporal de workflows sin mitigación adecuada.

Suggested Immediate Next Actions:
1. Aprobar ADR-0016 (si están de acuerdo con el enfoque y políticas aquí descritas).
2. Aceptar pilot `modelos/datasets` y proceder con dry‑run -> revisión -> backup -> apply+verify.
3. Priorizar y programar el lote `reports/` como siguiente paso tras validación del pilot.

---

```
