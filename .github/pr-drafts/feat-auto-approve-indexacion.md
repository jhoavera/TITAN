# PR Draft: feat(auto-approve + indexación de alias)

**Branch:** `feat/auto-approve-indexacion`  
**Commit:** `1c197d0`

## Resumen
Se agregan heurísticas más conservadoras para la aprobación automática de propuestas (auto-approve) y un script para la indexación automática de alias en los directorios de `src/`.

Cambios principales:
- `api/src/servicios/limpieza-utils.ts`: nuevas reglas para `shouldAutoApprove` (whitelist de extensiones, rechazo de bloques de código, rechazo de archivos con import/export, detección de frontmatter y tags de maintainers).
- `api/scripts/indexar-aliases.ts`: nuevo script que genera `indice.ts` por directorio de tipo y genera propuestas (dry-run).
- `api/src/nucleo/indexacion/generador-indices-mcp.ts`: mejoras menores en el scanner y generación de índices.
- `api/src/servicios/proponer-refactor-imports.ts`: hardening de `isSafeToAutoApply` (detección de barrels, re-exports, dynamic imports) y mejora de flujo `--apply` para crear branch, commit y borrador de PR en `.github/pr-drafts/` (local only, no push).
- Tests unitarios e integración añadidos/modificados en `api/test/` y `api/tests/ci/` (ver lista completa en commits).

## Cómo probar localmente (Bun)
1. Asegúrate de tener Bun instalado.
2. Ejecutar tests: `bun test`
3. Ejecutar indexador en modo dry-run: `node api/scripts/indexar-aliases.ts --dry-run` (o con Bun si lo prefiere).

## Checklist
- [x] Tests unitarios y de integración pasados localmente (última ejecución: todos verdes).
- [x] No hace push a remotos ni crea PR reales sin aprobación.
- [x] Generación de borrador de PR local en `.github/pr-drafts/`.

## Notas para reviewers
- Revisar heurísticas de `shouldAutoApprove`. Son deliberadamente conservadoras; podemos expandirlas si definimos métricas/telemetría de confianza.
- Revisión especial a `isSafeToAutoApply` para garantizar que no rompa imports con default vs named.

---

Si quieres, puedo:
- Empujar el branch y abrir el PR remoto (necesitaré tu confirmación explícita).
- Reducir/incrementar el umbral `maxFiles` por defecto y documentarlo en README.
- Añadir telemetría básica (conteo de rechazos por heurística) antes del merge.

