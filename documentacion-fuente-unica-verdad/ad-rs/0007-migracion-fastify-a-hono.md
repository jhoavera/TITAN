# 0007 - Migración de Fastify a Hono

Estado: propuesta
Fecha: 2025-12-16
Autores: Equipo TITÁN

Contexto
--------
Fastify se usa parcialmente en `src/infraestructura/servidor/` y en middlewares. El proyecto ha adoptado Bun como runtime y Hono como servidor edge-ready con menor consumo de memoria y mejor compatibilidad con Bun según el `documento-maestro`. Se propone migrar la ejecución principal a Hono para mejorar latencia, footprint, y uniformidad con el stack.

Decisión
--------
Se propone migrar gradualmente la superficie HTTP de Fastify a Hono manteniendo trazabilidad y sin cambios automáticos de nombres. El plan principal:

- Usar `src/infraestructura/servidor/servidor-hono.ts` como punto de arranque por defecto para desarrollo y producción en Bun.
- Mantener los controladores y lógica de negocio existentes y adaptarlos con `adaptadores/fastify-to-hono.ts` hasta completar la migración de middleware y plugins.
- Reescribir middlewares críticos (`middleware-autenticacion-jwt`, `middleware-contexto-inquilino`, etc.) a Hono middleware nativo o crear adaptadores equivalentes con pruebas.
- Eliminar dependencia runtime de `fastify` cuando se confirme que ninguna ruta critica o plugin la requiere.

Criterios de aceptación
-----------------------
- Todas las rutas existentes deben responder igual con Hono y pasar la suite de pruebas existente.
- Documentación actualizada: `PULL_REQUEST_DRAFT.md` incluirá checklist de migración y pasos de rollback.
- Crear ADRs para cualquier cambio de nombres o renombrado (ej.: `migrations` → `migraciones`) y sólo aplicar cambios tras aprobación de ADR.
- No se aplicarán modificaciones de nombres en el repo sin ADR aprobada.

Impacto
-------
- Rendimiento y consumo de memoria modestamente mejorados en Bun.
- Requiere refactor de middleware y eliminación controlada de `fastify` en package.json.

Plan de trabajo (alto nivel)
---------------------------
1. Detectar todas las referencias a Fastify y catalogarlas. (script automatizado)
2. Crear ADR de propuesta (este documento) y generar entradas de glosario si aparecen términos que requieren normalización.
3. Implementar adaptadores y probar Hono como servidor principal (dry-run).
4. Reescribir middlewares a Hono o wrappers equivalentes con pruebas unitarias.
5. Ejecutar migración completa, eliminar `fastify` de dependencias y actualizar docs.
6. Generar PR draft con checklist y resultados de pruebas para revisión.

Notas
-----
- Todo cambio que suponga renombrados o cambios semánticos en código (nombres de funciones, carpetas, variables, migraciones) debe acompañarse de una ADR específica y pasar por el flujo de aprobación.
- Esta ADR es la propuesta inicial; se actualizará con evidencias y métricas tras la implementación.

---

Referencias:
- `documentacion-fuente-unica-verdad/documento-maestro-parte-1.2.md` (Stack recomendado)
- `src/infraestructura/servidor/servidor-hono.ts`
- `src/infraestructura/servidor/adaptadores/fastify-to-hono.ts`
