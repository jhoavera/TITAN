# 0008 - Eliminación controlada de Fastify

Fecha: 2025-12-16
Estado: propuesta
Autores: Equipo TITÁN

## Contexto
- Se inició la migración hacia Bun + Hono como runtime y servidor preferente (ver ADR 0007).
- Para reducir footprint, inconsistencias y alinear con el `documento-maestro-parte-1.2.md`, proponemos eliminar `fastify` cuando la migración sea completa y comprobada.

## Decisión propuesta
- Eliminar `fastify` y sus plugins (@fastify/*) de las dependencias del repositorio una vez completen los pasos de verificación y pruebas locales.
- Mantener adaptadores y wrappers (p. ej. `adaptadores/fastify-to-hono.ts`) y migrarlos o eliminarlos cuando ya no sean necesarios.

## Motivación
- Reducir uso de memoria y acelerar tiempos de inicio (Bun+Hono objetivo técnico).
- Simplificar la superficie de código y evitar mantenimiento de dos servidores HTTP.

## Impacto y consecuencias
- Requiere migración de middleware y posibles reimplementaciones de funcionalidades plugin específicas.
- Se exigirá 100% de cobertura E2E para endpoints críticos antes de la eliminación final.

## Plan de migración (pasos concretos)
1. Actualizar y validar reportes de referencia (`reports/fastify-deteccion.json`).
2. Migrar tests que dependen explícitamente de Fastify hacia Hono o mocks equivalentes.
3. Refactorizar middleware (CORS, JWT, rate-limit, websockets) a soluciones Hono-friendly o escribir adaptadores.
4. Ejecutar suite completa (local) y corregir regressions.
5. Crear PR para eliminación de `fastify` en `package.json`, regenerar lockfile en local y validar con `bun test`.
6. Commit/merge solo tras aprobación del equipo y cierre de ADR 0008 con estado `aprobado`.

## Rollback
- Mantener un tag/branch de la última versión con `fastify` hasta que la eliminación esté confirmada.

## Referencias
- ADR 0007 - Migración Fastify → Hono
- `reports/fastify-deteccion.json`

---

_Fin del borrador de ADR 0008 — Propuesta para revisión._