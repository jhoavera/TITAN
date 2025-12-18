# Procedimiento: Indexación automática y reglas de auto-approve

## Objetivo
Documentar el comportamiento del indexador de alias y las heurísticas de aprobación automática implementadas en `api`.

## Scripts relevantes
- `bun run indexar-aliases` → ejecuta `scripts/indexar-aliases.ts`:
  - Genera `indice.ts` (o `indice.ts`) por cada directorio de `src/` que contenga archivos TypeScript.
  - Ejecuta `proposeRefactorImports` en modo `dry-run` y escribe ADRs propuestas en `tmp/adrs-propuestas/`.

- `bun run proponer:imports` → dry-run para detección de importaciones relativas y generación de ADRs.
- `bun run proponer:imports:apply` → aplica cambios en local creando rama y borrador de PR (no hace push).

## Heurísticas de auto-approve (resumen)
Las reglas son deliberadamente conservadoras:
- Auto-aprueba explícita: frontmatter `aprobado: true` o `auto-approve: yes/si`.
- Mantenedor: autor en lista de maintainers y cambio pequeño (`maxSizeForMaintainer`).
- Archivos no código: admite `md`, `propuesta`, `json`, `yml`, `yaml` si no contienen bloques de código ni `import`/`export`.
- Archivos índice seguros: `index.ts` / `indice.ts` que contengan únicamente re-exports (`export * from './...'` o `export { a } from './...'`) se consideran seguros y pueden auto-aprobarse incluso en lote grande.

## Flujo de aplicación seguro
1. `bun run indexar-aliases` genera propuestas (dry-run) y ADRs en `tmp/adrs-propuestas/`.
2. Revisar ADRs y reportes: `tmp/adrs-propuestas/report.json`.
3. Para aplicar: usar el script con `--apply` o `bun run proponer:imports:apply` — crea rama local, commit y ejecuta tests.
4. Si los tests locales pasan, se genera un borrador de PR en `.github/pr-drafts/` y se detiene (no hay push automático).

## Notas y recomendaciones
- Reglas diseñadas para minimizar riesgo; ampliar auto-approve requiere telemetría y métricas de confianza.
- Mantener `bun` como runtime preferido para eficiencia.

---

Documentado por: mantenimiento automático (cambios generados por scripts). Si quieres ajustar las reglas o el umbral `maxFiles`, indícalo para proponer un cambio en ADR.
