---
titulo: "0001 - Registrar 'git_ref' al aprobar ADRs"
estado: "propuesta"
fecha: "2025-12-15"
autor: "automated-agent <copilot@local>"
---

# Resumen

Se propone que, al aprobar un ADR, el sistema permita registrar explícitamente una referencia de control de versiones (campo `git_ref`) asociada a la acción de aprobación. Este ADR documenta la decisión técnica, la justificación y los cambios mínimos realizados para soportar la trazabilidad requerida por el proyecto TITÁN.

## Contexto

El proyecto TITÁN exige trazabilidad completa de cambios en decisiones arquitectónicas y de diseño (ADRs). Para cumplir este requisito, las aprobaciones deben poder enlazarse explícitamente a una referencia de Git (commit/branch/tag) que representa el estado del código o de la documentación vinculada a la decisión.

## Decisión

Se acepta permitir un campo opcional `git_ref` en el flujo de aprobación de un ADR. El sistema registrará la referencia como metadato en la entidad ADR sin ejecutar automáticamente acciones sobre el repositorio (por política de no automatización CI en nube). La decisión incluye:

- Añadir soporte para `git_ref` en la API de actualización de ADRs (aceptar y persistir cuando viene en el body de la petición).
- Mantener la operación como explícita y opcional: el usuario/aprobador debe proporcionar la `git_ref` manualmente.
- Añadir pruebas unitarias y E2E que validen el flujo: crear → enviar a revisión → aprobar con `git_ref` y verificar que se almacena.

## Cambios realizados (implementación mínima)

- `api/src/infraestructura/servidor/controladores/adrs-controlador.ts`
  - `actualizar(...)` ahora acepta `git_ref` en el body y lo pasa al repositorio en el `payload`.
- `api/test/pruebas/unitarias/validador-adrs.prueba.ts` (pruebas de validador ADR)
- `api/test/pruebas/e2e/adrs-flujo.prueba.ts` (E2E: crear → enviar a revisión → aprobar con `git_ref`)

Nota: La implementación actual es mínima (acepta y persiste el campo) y está acompañada de pruebas que pasan localmente. No se modifica el flujo de commit/merge automático; cualquier integración con Git deberá documentarse y aprobarse en ADRs posteriores.

## Razonamiento

- Trazabilidad: registrar `git_ref` mejora la auditabilidad de decisiones y permite correlacionar aprobaciones con artefactos concretos (commit/branch).
- Principio de menor sorpresa: la referencia es opcional y no automatiza commits; evita cambios indeseados o acciones automáticas que el proyecto prohíbe.
- Seguridad y cumplimiento: respeta la política “no nube” y mantiene el control humano sobre qué referencias se asocian.

## Consecuencias

- Positivas: Mejora la trazabilidad de ADRs y facilita auditorías y revisiones históricas.
- Riesgos: Cambio menor en contrato de API (acepta un campo adicional opcional). Riesgo muy bajo y retrocompatible.

## Plan de seguimiento

1. Añadir nota en documentación de API (OpenAPI/README) sobre el campo `git_ref` y su uso.  
2. Considerar, en un ADR posterior, la automatización controlada para capturar `git_ref` desde procesos de revisión (ej. scripts locales) siguiendo aprobaciones del equipo.

---

Firma: equipo TITÁN - agente automatizado (acción: crear ADR tras pruebas)
