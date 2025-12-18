---
titulo: "Propuesta: traducir 'migrations' → sugerencia: 'migraciones'"
fecha: "2025-12-17T22:11:00.000Z"
estado: "propuesta"
autor: "revisar-idioma-automatica"
---

# Propuesta: traducir 'migrations' → sugerencia: 'migraciones'

**Contexto**: `revisar-idioma` detectó el término **migrations** en miles de archivos. Existe ya una propuesta/ADR previa (ej. `ad-rs/2025-12-16-proponer-traduccion-migraciones.md`), por lo que esta entrada consolida la evidencia más reciente y sugiere una ruta de revisión.

**Resumen de hallazgos**:
- total de archivos afectados reportados: 27,300 (ver `reports/plan-refactor-idioma.json`).
- muestras y diffs relevantes generados en `reports/dedup-muestra-10-estado.json` y `reports/dedup-diffs-*.txt`.

**Archivos de ejemplo (muestra)**:
- documentacion-fuente-unica-verdad/glosario-biblioteca/propuestas/2025-12-17T21-20-07-711Z-integridad-idioma-migrations.md
- documentacion-fuente-unica-verdad/glosario-biblioteca/propuestas/2025-12-17T21-19-35-661Z-integridad-idioma-migrations.md
- documentacion-fuente-unica-verdad/documento-maestro-parte-1.2.md

**Sugerencia automática**: usar `migraciones`.

**Riesgos**:
- Alcance amplio: renombrados globales deben aplicarse con pruebas y en lotes pequeños.
- Penalidades: scripts CI que esperan rutas en inglés o integraciones externas.

**Acciones propuestas**:
1. Revisar y actualizar ADR existente (`ad-rs/2025-12-16-proponer-traduccion-migraciones.md`) con este respaldo y con la lista de archivos actualizada.
2. Ejecutar `scripts/ci/auto-apply-flow --dry-run --filter migrations` para producir `reports/propuestas-aprobacion-posible.json` filtrado.
3. Seleccionar grupos de riesgo (score bajo + members grandes) para revisión humana.
4. Si se aprueba, aplicar renombrados gradualmente con guardas de test.

**Referencias**:
- `reports/plan-refactor-idioma.json`
- `reports/reporte-refactor-idioma.json`

