# ADR-0024: Refactorización controlada de nombres a Español Técnico Empresarial

Estado: aprobado

AprobadoPor: jhoavera
AprobadoEn: 2025-12-14T23:59:00Z

Autor: jhoavera
Fecha: 2025-12-14

## Contexto

El proyecto requiere una normalización lingüística y semántica de nombres de archivos y carpetas a Español Técnico Empresarial para mejorar consistencia, buscabilidad, gobernanza documental y cumplimiento de estándares internos. Actualmente existen numerosas rutas y artefactos con nombres en inglés que deben traducirse salvo que el término sea 100% necesario en inglés (p. ej. acrónimos, nombres de productos externos).

La refactorización debe realizarse de forma incremental, totalmente local, con backups previos y trazabilidad completa. No se modificarán archivos de documentación (`.md`) sin aprobación explícita de esta ADR y su checklist asociada.

## Decisión

Adoptar un proceso de refactorización por sub‑lotes que incluya:

- Detección automatizada de candidatos (`scripts/tools/generate_name_translation_proposals.py`).
- Generación de archivos `.propuesta` para cualquier `.md` detectado (no aplicar sin ADR aprobado).
- Enriquecimiento y mantenimiento del `documentacion-ssot/glosario_proyecto.yml` como único glosario maestro, con campos: `sugerencia`, `nota`, `descripcion`, `preservar` (booleano) y `apariciones`.
- Criterios claros de traducción: preferir traducción literal a Español Técnico Empresarial; cuando no sea posible, dejar en inglés y documentar la razón en el glosario (`preservar: true` y `descripcion`).
- Aplicación por sub‑lotes (ej.: `api`, `frontend`, `modelos`, `scripts`, `documentacion`) con backups tar.gz previos, logs (`reports/rename_apply_log.csv`) y manifiestos de dry‑run y apply.
- Implementar validaciones automáticas: `verify_structure_and_language.py` para cobertura de manifiesto y `ensure_ts_strict.py` para exigir `strict` en TypeScript; todos los cambios deben pasar verificaciones locales antes de aplicar.

## Alcance

- Abarca nombres de archivos y carpetas en todo el workspace, incluida la raíz `TITAN`.
- No aplicar cambios automáticos sobre `.md` sin aprobación adicional de ADR específica para documentación.
- Mantener todas las operaciones en local; se prohíben integraciones nube/CI remota para este flujo inicial.

## Procedimiento propuesto (pasos)

1. Ejecutar el detector para generar `reports/translation_proposals_files.csv` y `reports/translation_proposals_docs.csv`.
2. Generar y revisar `reports/translation_proposals_glossary_updates.csv` y actualizar `documentacion-ssot/glosario_proyecto.yml` con `descripcion` y `preservar` cuando corresponda.
3. Crear manifiesto dry‑run por sub‑lote: `reports/move_manifest_<sublote>_dryrun.csv`.
4. Revisar y aprobar manifiesto por responsables de cada sub‑lote.
5. Aplicar manifiesto aprobado con `scripts/tools/apply_move_manifest.py` (siempre crear backup tar.gz antes). Registrar resultados en `reports/rename_apply_log.csv`.
6. Ejecutar `scripts/tools/analyze_skipped_candidates.py` y procesar SKIPPED (aceptar `DEST_EXISTS`, proponer candidatos para `ORIG_MISSING`).
7. Repetir para siguiente sub‑lote hasta cubrir todo el `documento-maestro-parte-4.md` y `config/structure_manifest.yml`.

## Plan por sub‑lotes (orden recomendado)

1. `scripts` (menor riesgo operativo, ya se ha aplicado un primer sub‑lote exitoso)
2. `documentacion` (solo generar `.propuesta` y revisión humana; NO APLICAR sin ADR específica)
3. `modelos` (pesado pero standalone: mover binarios y metadatos con cuidado)
4. `frontend` (interdependencias y rutas relativas; pruebas locales necesarias)
5. `api` (mayor impacto: requerirá pruebas unitarias/integración locales y políticas de TS strict)
6. Raíz y archivos de configuración (por último; asegurando `tsconfig` y `Makefile` actualizados)

## Checklist mínima (cada sub‑lote)

- [ ] Manifiesto dry‑run creado (`reports/move_manifest_<sublote>_dryrun.csv`).
- [ ] Backup pre‑aplicación creado (tar.gz en `respaldo/renombrados/`).
- [ ] Tests unitarios básicos ejecutados localmente (si aplica).
- [ ] `scripts/tools/verify_structure_and_language.py` ejecutado y cobertura reportada.
- [ ] `scripts/tools/analyze_skipped_candidates.py` ejecutado y revisadas `ORIG_MISSING` propuestas.
- [ ] Glosario actualizado con nuevos términos y decisiones (`preservar`/`traducir`).
- [ ] Revisores responsables del sub‑lote han aprobado (documentar en PR/issue de seguimiento local).
- [ ] Registro de cambios y resumen guardados en `reports/summary_*`.

## Criterios de aceptación

- Todos los movimientos aplicados tienen `status=OK` en `reports/rename_apply_log.csv` o un plan de corrección para los `SKIPPED`.
- La verificación del manifiesto `config/structure_manifest.yml` muestra cobertura ≥ 100% del árbol descrito en `documento-maestro-parte-4.md` (entradas existentes en disco o planeadas en manifiestos aprobados).
- Para paquetes TypeScript, `reports/ts_strict_report.csv` debe indicar `strict` aplicado o plan para abordar `tsconfig` vacíos (evaluado por ADR-0023).
- Glosario maestro actualizado con decisiones `preservar`/`traducir` para todos los tokens no triviales.

## Criterios de reversión

- Si una aplicación produce fallos funcionales (tests fallando localmente o rutas rotas), revertir usando el backup tar.gz y restaurar archivos según `respaldo/renombrados/` y registrar el incidente.
- Reversión parcial permitida por sub‑lote; no continuar con sub‑lotes siguientes hasta resolver fallos críticos.

## Artefactos generados

- `reports/move_manifest_<sublote>_dryrun.csv`
- `respaldo/renombrados/*.tar.gz`
- `reports/rename_apply_log.csv`
- `reports/missing_src_skipped_analysis.csv`
- `documentacion-ssot/glosario_proyecto.yml` (actualizado con `descripcion` y `preservar`)

## Seguridad y restricciones

- Todo el trabajo se realiza localmente. Queda prohibido ejecutar flujos automáticos en la nube o servicios externos sin aprobación explícita.
- Nunca modificar `.md` sin ADR específica y aprobación humana (se permiten `.propuesta` como artefacto de revisión).

## Propietarios y responsabilidades

- Propietario del ADR y responsable de la ejecución: `jhoavera` (autor)
- Revisión técnica por: equipo de `api`, `frontend`, `modelos` y `docs` según sub‑lote

## Razonamiento técnico

La conversión a Español Técnico Empresarial mantiene coherencia terminológica, facilita la búsqueda y reduce la fricción en onboarding local. Requiere control exhaustivo para evitar romper rutas, dependencias y pruebas.

---

Si apruebas esta ADR, la marcaré como `en proceso` y prepararé artefactos iniciales: manifiestos por sub‑lote, plan de pruebas local, y PR/issue de seguimiento para la primera tanda (scripts → aplicar). Además automatizaré la generación de un reporte de progreso y un tablero local por sub‑lote.
