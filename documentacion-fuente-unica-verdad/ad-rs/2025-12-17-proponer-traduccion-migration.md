---
titulo: "Propuesta: traducir 'migration' → sugerencia: 'migración'"
fecha: "2025-12-17T22:10:00.000Z"
estado: "propuesta"
autor: "revisar-idioma-automatica"
---

# Propuesta: traducir 'migration' → sugerencia: 'migración'

**Contexto**: El análisis de `revisar-idioma` detectó numerosas instancias del término **migration** en el repositorio. El plan automatizado sugiere consolidar bajo **migración / migraciones** (ver `reports/plan-refactor-idioma.json`).

**Resumen de hallazgos**:
- total de archivos afectados reportados: 42,257 (ver `reports/plan-refactor-idioma.json`).
- muestra representativa y diffs generados en `reports/dedup-muestra-10-estado.json` y `reports/dedup-diffs-*.txt`.

**Archivos de ejemplo (muestra)**:
- documentacion-fuente-unica-verdad/glosario-biblioteca/propuestas/2025-12-17T21-20-04-968Z-integridad-idioma-migration.md
- documentacion-fuente-unica-verdad/glosario-biblioteca/propuestas/2025-12-17T21-19-39-798Z-integridad-idioma-migration.md
- documentacion-fuente-unica-verdad/glosario-biblioteca/propuestas/2025-12-17T21-20-13-095Z-integridad-idioma-migration.md

**Sugerencia automática**: usar `migración` (singular) y `migraciones` (plural) según contexto.

**Riesgos**:
- Cambios en nombres de archivos o rutas pueden afectar scripts y tests (p. ej. migraciones DB, scripts CI). Priorizar pruebas de integración y renombrados por módulos pequeños.
- Algunos usos (nombres de paquetes, comandos externos) podrían preferir mantener `migration` en inglés — revisar caso por caso.

**Acciones propuestas**:
1. Revisar ADRs existentes relacionadas (`ad-rs/2025-12-16-propuesta-traducir-migrations.md`) y consolidar información aquí.
2. Validar lista completa de archivos afectados (ejecutar `scripts/ci/auto-apply-flow --dry-run --filter migration`) y generar `reports/propuestas-aprobacion-posible.json` para este término.
3. Priorizar revisión manual de grupos con score bajo y muchos miembros.
4. Si se aprueba, aplicar renombrados en lotes pequeños con guardas de test (`--apply-when-tests-pass`).

**Referencias**:
- `reports/reporte-refactor-idioma.json`
- `reports/plan-refactor-idioma.json`
- `reports/dedup-propuestas-*.json`


