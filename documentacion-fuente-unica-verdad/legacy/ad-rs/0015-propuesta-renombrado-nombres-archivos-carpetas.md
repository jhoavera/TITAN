---
adr: 0015
title: Propuesta de renombrado por lote: nombres de archivos y carpetas a Español Técnico Empresarial
date: 2025-12-14
status: proposed
proposedBy: jhoavera

Context:
- Se requiere homogeneizar la nomenclatura del repositorio hacia Español Técnico Empresarial (carpetas y nombres de archivos), manteniendo términos técnicos inalterados y registrando los casos en el glosario.

Scope (propuesto):
- Renombrar rutas (carpetas y archivos) propuestas por el proceso automatizado y validado manualmente por lotes (prioridad: `modelos`, `documentacion`, `pruebas`, `configuracion`).
- No modificar el contenido de archivos `.md` sin aprobación individual (ver ADR-0013).

Process:
1. Generar propuestas de renombrado (`reports/move_manifest_aggressive_filename_changes.csv`) y archivos de propuesta por ruta (`*.name.propuesta`).
2. Revisar y aprobar cada lote mediante este ADR (por ejemplo: lote `modelos/datasets`).
3. Ejecutar `--dry-run` del aplicador para validar referencias y tests (buscar referencias en código y documentación).
4. Crear backup y `move_manifest.csv` con acciones `git mv` y checksums; aplicar cambios y ejecutar `apply+verify` localmente.
5. Archivar evidencia en `reports/archive/<ts>/` y abrir PR para revisión (NO realice push sin autorización explícita del responsable).

Testing & Reversibility:
- Cada renombrado incluirá pruebas automáticas: búsqueda de referencias rotas (grep), tests unitarios relevantes, y verificación de enlaces. Se registrará un plan de reversión (`git revert` + `restore-mapping`).

Execution evidence (actual):
- Generadas propuestas agresivas de renombrado: `reports/move_manifest_aggressive_filename_changes.csv`.
- Archivos de propuesta por ruta: `*.name.propuesta` creados junto a los archivos/carpetas objetivo.
- Glosario: propuestas iniciales en `documentacion/glosario/propuestas/` (plantillas para términos detectados).

Recommended Next Steps:
- Revisar y aprobar ADR-0015 (por lote) para proceder con dry‑run en un lote pequeño (recomiendo `modelos/datasets`).
- Si aprueban, ejecutar dry‑run → crear `move_manifest.csv` → backup → apply+verify y archivar evidencia.

---
