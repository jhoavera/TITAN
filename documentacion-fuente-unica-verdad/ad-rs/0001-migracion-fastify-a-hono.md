# 0001 - Migración de Fastify a Hono

Fecha: 2025-12-16
Estado: propuesta

## Contexto
En línea con la política del proyecto (documento-maestro.md y documentacion-fuente-unica-verdad/documento-maestro-parte-1.2.md) se prioriza el uso de Bun como runtime y Hono como servidor HTTP ligero y moderno, optimizado para nuestros requisitos de rendimiento en homelab multi-inquilino.

Se ha detectado uso extensivo de Fastify en registradores legacy y en rutas que ya fueron reimplementadas o adaptadas para Hono mediante un adaptador temporal (fastify→hono). Para completar la migración y mantener trazabilidad, se propone una migración planificada y probada por paridad.

## Decisión
Migrar paso a paso las rutas y registradores de Fastify a Hono usando pruebas de paridad (Fastify ↔ Hono) por cada endpoint crítico. Una vez confirmada la paridad y la cobertura de tests (incluyendo validaciones Zod, headers de tenant y responses), eliminar los registradores Fastify y dejar Hono como servidor principal.

## Justificación
- Bun + Hono reduce consumo de recursos y tiempos de inicio (alineado con el stack definido).
- Hono facilita integraciones con middlewares del proyecto (JWT, rate-limit por inquilino) y generación OpenAPI desde Zod.
- Pruebas de paridad permiten migración incremental con riesgo mínimo.

## Plan de migración
1. Añadir pruebas de paridad para cada registrador Fastify existente (glosario, adrs, ops, auditoría, auditoría DB, ops extras).
2. Implementar y validar adaptador Hono → Fastify para compatibilidad temporal. Corregir cabeceras y comportamiento (tenant header, usuario, tipos de body).
3. Ejecutar pruebas con Bun Test; corregir diferencias hasta paridad completa.
4. Generar documentación OpenAPI y examples desde validaciones Zod.
5. Crear ADR canónica (esta) y checklist para eliminación de Fastify.
6. Tras aprobación, eliminar registradores Fastify y actualizar CI/local scripts si aplica.

## Criterios de aceptación
- Todas las pruebas de paridad pasan con Bun Test.
- OpenAPI actualizado con ejemplos básicos y security schemes.
- PR con cambios listo y ADR aprobado por revisor(es).
- Documentación actualizada en `documentacion-fuente-unica-verdad`.

## Riesgos y mitigaciones
- Riesgo: diferencias de comportamiento (headers, serialización) en adaptador → Mitigación: pruebas de paridad y logging temporal durante migración.
- Riesgo: pérdida de trazabilidad en auditoría → Mitigación: conservar hooks de auditoría y triggers DB; añadir métricas y logs estructurados antes de eliminar Fastify.

Autor: Equipo TITAN

---

Notas: Este ADR es el inicio del proceso de migración; se recomienda aprobar y aplicar cambios en la rama `migracion/node-a-bun-2025-12-17` y preparar PR con checklist de validación para revisión final.
