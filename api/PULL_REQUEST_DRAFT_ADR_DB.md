Título: feat(adrs): integrar ADR DB-backed con migración FS→DB, migración automática y tests E2E

Resumen:
- Se añade `ServicioADRIntegrado` que unifica comportamiento FileSystem + DB (Drizzle).
- Se añade `RepositorioADRsDrizzle` (scaffold ya presente) y se endurece la carga dinámica de `drizzle-orm` para evitar fallos en entornos sin DB.
- Se añade script `scripts/servicios/migrar-adrs-fs-a-db.ts` para migrar ADRs desde `documentacion-fuente-unica-verdad/ad-rs` a la base de datos y archivar los MD originales.
- Se añade test E2E `test/e2e/adr-db-migration.test.ts` que valida migración en entorno DB (`TEST_DATABASE_URL`) y archiving.
- Se añade test unitario `test/servicios/adr/servicio-adr-integrado.test.ts`.
- Se actualizó `api/src/infraestructura/repositorios/repositorio-adrs-drizzle.ts` para carga robusta de `drizzle`.

Cómo probar localmente (recomendado):
1. Levantar Postgres de prueba: `bun run test:db:start`
2. Esperar DB: `bun run test:db:wait`
3. Aplicar migraciones: `TEST_DATABASE_URL=postgres://test:test@127.0.0.1:5432/test bun ./scripts/ci/aplicar-migraciones-test.ts`
4. Ejecutar tests E2E DB: `TEST_DATABASE_URL=postgres://test:test@127.0.0.1:5432/test bun run pruebas --runInBand`
5. Probar migración manualmente: `TEST_DATABASE_URL=postgres://test:test@127.0.0.1:5432/test bun ./scripts/servicios/migrar-adrs-fs-a-db.ts`

Notas:
- Algunos tests E2E fallan en la ejecución completa por condiciones de orden con métricas y servicios de validación semántica; he ajustado la carga de `drizzle` y añadí un warning si no está disponible, para permitir operaciones en entorno sin DB.
- Pendiente: investigar y estabilizar un fallo intermitente en `servicio-validacion-semantica` (stub avanzado) y en algunos tests de métricas cuando se ejecutan en suite completa (probablemente contaminación de archivos temporales entre tests). 

Etiquetas: area(adrs), area(infra), test(e2e), chore

Reviewers: @jhoavera
