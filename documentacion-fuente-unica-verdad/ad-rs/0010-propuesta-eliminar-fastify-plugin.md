# 0010 - Propuesta: Eliminar plugin Fastify legacy (`src/infraestructura/servidor/app.ts`)

Estado: propuesta (pendiente de revisión ADR)

## Contexto
El proyecto migró su superficie HTTP principal a Hono (`src/infraestructura/servidor/servidor-hono.ts`) y cuenta con un adaptador `fastify-to-hono` y Helpers de compatibilidad para pruebas. El archivo `src/infraestructura/servidor/app.ts` contiene un plugin mínimo para Fastify que ya no es necesario para la ejecución y pruebas actuales.

## Decisión propuesta
Eliminar `src/infraestructura/servidor/app.ts` y cualquier referencia de uso productivo a este plugin, y preparar un PR separado para remover la dependencia `fastify` (y paquetes `@fastify/*`) de `package.json` y lockfile solo cuando:

- Todas las rutas críticas estén cubiertas por `servidor-hono` (paridad de comportamiento validada por pruebas automáticas y E2E locales).
- No exista código en producción que dependa del plugin Fastify.
- Se haya documentado y probado el rollback (reinstalar versión X de `fastify` vía PR de revert).

## Motivación
- Reducir huella de dependencias y simplificar stack conforme al `documento-maestro-parte-1.2.md` (Hono como servidor preferido para Bun).
- Facilitar mantenimiento y consistencia en middlewares, documentación y generación de OpenAPI.

## Consecuencias
- Se creará un PR de limpieza de dependencias (sin push remoto sin autorización explícita del responsable).
- Las pruebas y generator de OpenAPI deben permanecer verdes antes de la eliminación definitiva.

## Plan de acción propuesto
1. Añadir esta ADR a `ad-rs/` como propuesta y someter a revisión.
2. Auditar y corregir adaptador `fastify-to-hono` (hecho) y migrar middlewares faltantes a Hono (siguiente paso en el plan).
3. Revisar y ajustar tests que importan Fastify (se limpiaron imports redundantes; tests locales pasan).
4. Preparar PR de eliminación de `app.ts` y, en PR separado, remover `fastify` de `package.json` y limpiar lockfile; ejecutar tests completos con Bun.
5. Tras aprobación ADR y verificación local, abrir PR remoto (previa autorización explícita del responsable del proyecto).

---

Propuesta generada automáticamente por el flujo de migración local. Aprobación requerida para aplicar cambios de eliminación definitiva.
