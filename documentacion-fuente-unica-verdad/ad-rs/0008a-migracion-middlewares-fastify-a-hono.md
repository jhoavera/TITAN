# 0008a - Migración Fase 1: Middlewares Fastify → Hono

Fecha: 2025-12-16
Estado: propuesta
Autores: Equipo TITÁN

## Alcance (Fase 1)
- Migrar los middlewares más críticos y sencillos: `middleware-autenticacion-jwt`, `middleware-contexto-inquilino`, `middleware-cors-configurable`, `middleware-logging-estructurado`.
- Objetivo: tener equivalentes Hono nativos o adaptadores probados y con tests unitarios y E2E mínimos.

## Justificación
- Estas piezas son punto de dependencia fuerte entre routes y servicios; migrarlas primero reduce superficie de dependencia de `fastify` y permite cerrar la eliminación en fases posteriores.
- Cumple el plan general descrito en ADR 0007 y la estrategia de eliminación controlada (ADR 0008).

## Criterios de aceptación
- Implementaciones Hono disponibles en `src/nucleo/middleware/hono/` para cada caso.
- Tests unitarios para cada middleware (`test/pruebas/unit/*.prueba.ts`) que validen comportamiento esperado.
- E2E que demuestren flujo autenticación → contexto inquilino → solicitud succeeds.
- Actualización de `reports/fastify-deteccion.json` mostrando disminución de referencias en las rutas migradas.

## Tareas (con dueño y estimación)
1. Crear script de detección y actualizar `reports/fastify-deteccion.json` (YA) — 0.5d — Dev
2. Implementar `middleware-contexto-inquilino` en Hono — 0.5d — Dev
3. Implementar `middleware-cors-configurable` en Hono — 0.5d — Dev
4. Implementar `middleware-logging-estructurado` en Hono — 0.5d — Dev
5. Asegurar que `middleware-autenticacion-jwt` Hono está correcto y cubrir con tests (ya existe una versión Hono) — 0.25d — Dev
6. Crear tests E2E y correr suite completa (local) — 0.5d — Dev
7. Crear commit y ADR por fase completada — 0.1d — Dev/Reviewer

## Riesgos
- Diferencias semánticas entre hooks Fastify (`addHook('preHandler')`) y middleware Hono (async c,next) → mitigación: pruebas E2E y adaptadores cuando sea necesario.
- Plugins Fastify específicos (p. ej. rate-limit/helmet) — si hay dependencia directa, crear patrón adaptador o reimplementar con librerías Hono-friendly.

## Seguimiento
- Añadir nota de progreso en `reports/plan-migracion-fastify.json` por cada tarea completada.

---

_Fin del borrador 0008a — Propuesta Fase 1._