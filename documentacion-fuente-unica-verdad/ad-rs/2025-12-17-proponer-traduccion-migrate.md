---
titulo: "Propuesta: traducir 'migrate' → sugerencia: 'migrar'"
fecha: "2025-12-17T22:12:00.000Z"
estado: "propuesta"
autor: "revisar-idioma-automatica"
---

# Propuesta: traducir 'migrate' → sugerencia: 'migrar'

**Contexto**: `revisar-idioma` detectó el término **migrate** en scripts y documentación. Este ADR propone registrar `migrar` como la traducción preferida y definir reglas para usos en scripts o nombres reservados.

**Resumen de hallazgos**:
- total de archivos afectados reportados: 18 (ver `reports/plan-refactor-idioma.json`).

**Archivos de ejemplo (muestra)**:
- api/doc/specs/ci-local-db.md
- api/scripts/ci/convertir-scripts-a-bun.ts
- api/tests/ci/convertir-scripts-a-bun.test.ts

**Sugerencia automática**: usar `migrar` para verbos/conductas; conservar `migration(s)` traducido(s) según contexto.

**Riesgos**:
- Algunos binarios o comandos externos podrían usar `migrate` — evitar renombrarlos sin revisión manual.

**Acciones propuestas**:
1. Revisar ADR existente (`ad-rs/2025-12-16-proponer-traduccion-migrate.md`) y actualizar con evidencia adicional.
2. Ejecutar `scripts/ci/auto-apply-flow --dry-run --filter migrate` para generar propuestas concretas y lista de grupos.
3. Revisar manualmente scripts y tests; proponer cambios pequeños y confirmarlos con CI.

**Referencias**:
- `reports/reporte-refactor-idioma.json`
- `reports/plan-refactor-idioma.json`
