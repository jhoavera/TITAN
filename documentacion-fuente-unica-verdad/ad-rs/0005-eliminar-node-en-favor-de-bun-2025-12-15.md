# 0005 - Eliminar Node en favor de Bun (Propuesta)

Fecha: 2025-12-15
Estado: propuesta

## Contexto
Hemos decidido orientar el runtime del proyecto TITÁN+MSP al stack moderno optimizado para homelab: Bun 1.1.8 como runtime principal (ver documento-maestro.md). Actualmente existen múltiples scripts en `package.json` que invocan `node`, `ts-node`, `npx` o binarios desde `node_modules/.bin`. Para garantizar coherencia del stack, menores tiempos de inicio y consumo de recursos, proponemos una migración controlada de Node → Bun.

## Decisión
- Migrar progresivamente todos los scripts del monorepo a variantes compatibles con Bun (`bun`, `bunx`, `ts-bun`) y eliminar la dependencia operativa de Node en entornos de desarrollo y CI local.
- Esta migración será automática sólo después de que la ADR sea aprobada y tras una serie de pasos de verificación y pruebas E2E.

## Motivación
- Bun ofrece inicio más rápido, menor consumo de memoria y TypeScript nativo, alineado con los objetivos de optimización para homelab (documento-maestro.md).
- Reducir la complejidad del entorno y la superficie de soporte operacional al estandarizar en un único runtime.

## Consecuencias
- Se crearán reports y PRs con cambios sugeridos para cada script detectado.
- CI debe actualizarse para ejecutar con Bun. Hasta que la migración esté completa, `ensure-tools` advertirá si Node está presente y sugerirá una ruta de migración.
- Si algún paquete o herramienta es incompatible con Bun, se documentará y se propondrá una excepción o una alternativa.

## Plan de migración (resumen)
1. Generar reporte automatizado (`npm run migrar-node-a-bun:report`) que liste scripts, issues y sugerencias. ✅ (implementado)
2. Revisar y aprobar ADR (este documento) en el flujo ADR existente. (acción requerida)
3. Aplicar conversiones en modo controlado (`npm run migrar-node-a-bun:apply`) en ramas con PRs automáticas que incluyan tests y checklist de verificación. (pendiente)
4. Ejecutar pruebas unitarias e integrales y validar E2E en entornos locales homelab.
5. Actualizar `ensure-tools` y `estado-servicios` para que el estado oficial muestre Bun como runtime preferente y ofrezca pasos de remediación.
6. Documentar excepciones en el glosario y generar ADRs adicionales en caso de herramientas no compatibles.

## Rollback
- Mantendremos una rama por cada PR para revertir cambios que rompan tests o servicios hasta que la conversión sea estable.

## Referencias
- documento-maestro.md (sección Stack)
- scripts/ci/analizar-node-compatibilidad.ts
- scripts/ci/generar-reporte-migracion.ts

---
> NOTA: Este archivo se generó automáticamente en modo borrador. Para aplicar cambios en el código se debe aprobar esta ADR y seguir el plan indicado.
