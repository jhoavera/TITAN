# Borrador de PR local: `ci-local/drizzle-job`

Objetivo: añadir job reproducible localmente para integrar Drizzle + Postgres y hacer `ci:verify` robusto sin wrappers externos.

Cambios incluidos en la rama `ci-local/drizzle-job` (no empujada):
- `package.json`
  - Añadido `ci:local:drizzle` para ejecutar start/wait/migrate/tests/stop/indexar/revisar-idioma (todo en local).
  - Reemplazadas invocaciones a `bun/register` y `ts-bun` por llamadas directas a `bun` para compatibilidad local.
- `docs/ci-local.md` — documentación de uso y rutas de reportes.
- `Makefile` (raíz) — nueva tarea `ci-local` que invoca `bun run ci:local:drizzle` para uso sencillo: `make ci-local`.
- `api/test/servicios/revisar-idioma.applyWhenTests.test.ts` — tests que validan `--apply-when-tests-pass` en escenarios de tests que pasan y fallan.
- `PULL_REQUEST_DRAFT.md` — nota de inclusión de CI local en el borrador de PR general.

Qué revisar antes de push (recomendado):
- Ejecutar `bun run ci:local:drizzle` en máquina local y verificar: tests OK, reportes generados, tmp-glosario.json actualizado si se usa `--apply`.
- Revisar `reports/` y `tmp/` para validar propuestas de indexación y entradas de glosario.
- Confirmar que no se desea aplicar propuestas automáticamente — si se quisiera, pediré confirmación explícita para implementar la opción `--apply-when-tests-pass`.

Política: No se realizará `git push` ni se abrirá PR remoto sin tu autorización explícita.
