# CI local reproducible — Drizzle (Postgres) ✔

Resumen: job `ci:local:drizzle` ejecuta todo en local (sin push remoto):

Pasos que ejecuta el job:
1. Levantar Postgres de pruebas (docker-compose.test.yml)
   - `bun run test:db:start`
2. Esperar a que la BD responda
   - `bun run test:db:wait`
3. Aplicar migraciones (idempotente)
   - `TEST_DATABASE_URL=postgres://test:test@127.0.0.1:5432/test bun run test:db:migrate`
4. Ejecutar la suite de tests con `TEST_DATABASE_URL` apuntando a la BD de tests
   - `TEST_DATABASE_URL=postgres://test:test@127.0.0.1:5432/test bun run pruebas --runInBand`
5. Parar y limpiar la BD de pruebas
   - `bun run test:db:stop`
6. Ejecutar indexador de aliases y generar propuestas
   - `bun run indexar-aliases` (salida: `tmp/adrs-propuestas/report.json` o similar)
7. Ejecutar `revisar-idioma` en modo dry-run para generar reporte de términos en inglés
   - `bun run revisar-idioma:bun` (salida: `reports/reporte-refactor-idioma.json`)

Archivos relevantes generados durante el flujo:
- `api/tmp-glosario.json` — entradas pendientes creadas por `revisar-idioma --apply` (si se ejecuta `--apply`).
- `/home/<user>/Documentos/TITAN/api/tmp/adrs-propuestas/report.json` — propuestas de indexación.
- `reports/reporte-refactor-idioma.json` — reporte de detección de términos en inglés.

Recomendaciones de uso:
- Ejecutar desde la raíz `api/`: `bun run ci:local:drizzle`.
- Revisar los reportes y aceptar manualmente ADR/Glosario cuando proceda.
- NO ejecutar push ni crear PRs automáticos sin revisión humana.

Errores comunes y soluciones:
- `ts-bun` / `bun/register` ausentes: este repositorio ahora usa `bun` directamente en scripts CI para mayor compatibilidad.
- Si el contenedor Postgres no arranca: revisar `docker compose -f docker-compose.test.yml ps` y logs `docker compose -f docker-compose.test.yml logs`.

Se ha añadido un `Makefile` en la raíz del repo con la tarea `ci-local` que invoca `bun run ci:local:drizzle` para uso más sencillo: desde la raíz del repo ejecutar `make ci-local`.
