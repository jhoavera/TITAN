# PR Draft Final: Migración Fastify → Hono (lista para revisión local)

Resumen de cambios principales:
- Implementación de Hono server (`src/infraestructura/servidor/servidor-hono.ts`) con middleware de autenticación y limitación de tasa por inquilino.
- Adaptador `fastify-to-hono` (`src/infraestructura/servidor/adaptadores/fastify-to-hono.ts`) para permitir migración incremental con paridad de comportamiento.
- Generador OpenAPI desde Zod: `src/infraestructura/documentacion/generador-openapi.ts`.
- Exposición de documentación en `/api/docs` (Redoc) y `/api/docs/openapi.yaml` (YAML generado desde Zod).
- Validadores Zod añadidos para `Ops` y `ADRs`.
- ADR creada: `documentacion-fuente-unica-verdad/ad-rs/0001-migracion-fastify-a-hono.md` (principal) y `0009-openapi-desde-zod.md` (documentación adicional).
- Tests de paridad: Glosario, ADRs, Ops y Auditoría (incluyendo auditoría DB) con `bun test` pasan localmente.
- Se añadió `test/helpers/fastify-compat.ts` (helper Fastify→Hono para pruebas) y se migraron las pruebas tipo `*.prueba.ts` y `*-paridad.test.ts` para usarlo, reduciendo la dependencia de Fastify en la suite de tests.

Estado de pruebas (ejecutadas localmente con `bun test`):
- Suite completa: **56 passed, 0 failed** (incluye tests de CI y tests de integración local). ✅
- Tests de paridad específicos: Glosario, ADRs, Ops y Auditoría → 6-7 tests de paridad revisados y migrados a Hono-compat.

Checklist previo a crear PR que elimine `fastify` de dependencias (obligatorio):
- [x] Ejecutar suite de pruebas de paridad y ver que pasa con Bun (`bun test`).
- [x] Ejecutado `scripts/migracion/detectar-fastify.ts` para localizar todas las referencias a `fastify` (reporte: `reports/fastify-deteccion.json`).
- [x] Actualizar pruebas que importan `fastify` a usar `servidor-hono` o adaptadores equivalentes (migraciones parciales están en `test/pruebas/integracion/*`).
- [ ] Revisar y anotar secciones relevantes en `documento-maestro` y `documento-maestro-parte-4.md` sobre el cambio de stack.
- [ ] Preparar PR de limpieza de dependencias (remover `fastify` y `@fastify/*`) en PR separado **después** de su aprobación y verificación local.
- [ ] Documentar rollback y plan de revert (incluye versión de `fastify` a re-instalar en caso de fallo crítico).

Archivos destacados modificados / añadidos:
- `src/infraestructura/servidor/servidor-hono.ts` (nuevo)
- `src/infraestructura/servidor/adaptadores/fastify-to-hono.ts` (nuevo/modificado)
- `src/nucleo/validadores/validador-ops.ts` (nuevo)
- `test/pruebas/integracion/*-paridad.test.ts` (nuevos tests de paridad)
- `documentacion-fuente-unica-verdad/ad-rs/0001-migracion-fastify-a-hono.md` (ADR)
- `api/scripts/migracion/detectar-fastify.ts` (script de detección)

Branch de trabajo: `migracion/node-a-bun-2025-12-17`  
Commit actual: `ed7d79a`  

Acción solicitada: revisión local y autorización explícita para abrir PR remoto y proceder a la eliminación controlada de `fastify` en PR(s) separados.

Estado actual: middlewares críticos migrados a Hono, pruebas de integración y paridad actualizadas y pasando localmente (`bun test` → 56 passed), y ADR `0010` creada para la eliminación del plugin legacy. Se propone abrir dos PRs separados: 1) eliminar `src/infraestructura/servidor/app.ts` y referencias internas (con ADR 0010), 2) remover `fastify` y `@fastify/*` de `package.json` y lockfile. **No empujar ni abrir PRs remotos sin autorización explícita del autor.**

Rollback plan (detallado):

- Paso 1: Revertir el commit que elimina `app.ts` y los cambios asociados (o usar PR de revert) para restaurar el plugin legacy.
- Paso 2: Reinstalar `fastify` y plugins necesarios con la versión previa conocida (por ejemplo `fastify@4.25.2` y dependencias `@fastify/*`) y actualizar `package.json` y lockfile:

```bash
# desde la raíz del repo
npm install --no-save fastify@4.25.2 @fastify/cors@x.y.z @fastify/helmet@x.y.z --legacy-peer-deps
# o si usan npm ci / bun install, restaurar lockfile desde el commit anterior
```

- Paso 3: Ejecutar smoke tests locales con el script `scripts/test-smoke.sh` (añadir si no existe) que invoque endpoints críticos `/api/v1/glosario`, `/api/v1/adrs` y `/.well-known/health`.
- Paso 4: Validar que la suite `bun test` pase y que la infraestructura de CI (si aplica) acepte el re-introducido runtime.

Incluir estos pasos en la descripción del PR para que el revisor tenga instrucciones claras en caso de rollback.
