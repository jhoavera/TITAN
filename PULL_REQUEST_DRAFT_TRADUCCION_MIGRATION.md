# PR Draft: Propuestas de traducción (migration / migrations / migrate)

Resumen ejecutivo
------------------
Se agregan **propuestas ADR** para los términos detectados por `revisar-idioma`:
- `migration` → **migración** (`documentacion-fuente-unica-verdad/ad-rs/2025-12-17-proponer-traduccion-migration.md`)
- `migrations` → **migraciones** (`documentacion-fuente-unica-verdad/ad-rs/2025-12-17-proponer-traduccion-migrations.md`)
- `migrate` → **migrar** (`documentacion-fuente-unica-verdad/ad-rs/2025-12-17-proponer-traduccion-migrate.md`)

Evidencia generada
-------------------
- Reporte detección idioma: `reports/reporte-refactor-idioma.json`
- Plan consolidado: `reports/plan-refactor-idioma.json`
- Reporte deduplicación principal: `reports/dedup-propuestas-2025-12-17T21-58-43-236Z.json`
- Propuestas automáticas (dry-run): `api/reports/propuestas-aprobacion-posible.json`
- Muestras y diffs: `reports/dedup-muestra-10-estado.json`, `reports/dedup-diffs-*.txt`
- Lista de grupos de alto riesgo (miembros >= 100): `reports/high-risk-groups-2025-12-17.json`

Acción solicitada
-----------------
- Revisar las ADRs propuestas y confirmar o comentar (no se aplican renombrados en este PR).
- Revisar la lista de grupos de alto riesgo y priorizar revisión manual (score bajo + muchos miembros).

Notas operativas
----------------
- Flujo ejecutado: `scripts/ci/auto-apply-flow.ts --dry-run` (genera `api/reports/propuestas-aprobacion-posible.json`).
- Política: No aplicar renombrados sin ADR aprobada y guardas de tests (`--apply-when-tests-pass`).

Archivos incluidos en commit (propuestos)
----------------------------------------
- `documentacion-fuente-unica-verdad/ad-rs/2025-12-17-proponer-traduccion-migration.md`
- `documentacion-fuente-unica-verdad/ad-rs/2025-12-17-proponer-traduccion-migrations.md`
- `documentacion-fuente-unica-verdad/ad-rs/2025-12-17-proponer-traduccion-migrate.md`
- `reports/high-risk-groups-2025-12-17.json`

Próximos pasos sugeridos
------------------------
1. Revisar ADRs y aprobar/editar.
2. Ejecutar `scripts/ci/auto-apply-flow.ts --dry-run` focalizado y revisar `api/reports/propuestas-aprobacion-posible.json` para términos específicos.
3. Revisar manualmente los N grupos de mayor riesgo y generar notas por grupo.
4. Preparar PR listo para aplicar (cuando autorizado): `--apply` con `--apply-when-tests-pass`.

