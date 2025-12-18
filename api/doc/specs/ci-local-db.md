# Orquestación local para pruebas con BD (Postgres)

Objetivo: permitir ejecutar las pruebas E2E con una base de datos Postgres real en local, usando Docker Compose y las migraciones del proyecto.

Archivos/Comandos relevantes:

- `docker-compose.test.yml` — servicio `postgres-test` (Postgres 15-alpine) expuesto en el puerto 5432.
- Scripts:
  - `scripts/ci/wait-for-db.ts` — espera a que la BD responda (usa `TEST_DATABASE_URL`).
  - `scripts/ci/aplicar-migraciones-test.ts` — aplica todos los `.sql` en `src/infraestructura/base-de-datos/migraciones` contra `TEST_DATABASE_URL`.

Scripts npm:

- `npm run test:db:start` — arranca el servicio Postgres de prueba.
- `npm run test:db:wait` — espera a que la BD esté lista.
- `npm run test:db:migrate` — aplica migraciones (usa `TEST_DATABASE_URL`).
- `npm run test:e2e:db` — orquesta inicio, espera, migraciones, ejecución de tests y teardown.

Notas:
- Se usa `ts-bun` para ejecutar scripts TypeScript con Bun (consistente con la orientación del proyecto hacia Bun). Asegúrate de tener Bun instalado y `ts-bun` en el PATH (se gestiona habitualmente mediante bun global install o scripts de bootstrap del proyecto).
- Asegúrate de tener `docker` y `docker compose` instalados. El comando `npm run test:e2e:db` iniciará y detendrá el servicio.
- `TEST_DATABASE_URL` se establece en `postgres://test:test@127.0.0.1:5432/test` por defecto en los scripts, puedes sobrescribirla si necesitas otra configuración.

Recomendación: ejecutar `npm run test:e2e:db` en una terminal separada para verificar que el flujo completo funciona en tu entorno local.
