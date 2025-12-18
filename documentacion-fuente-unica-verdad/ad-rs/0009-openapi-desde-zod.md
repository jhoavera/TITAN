---
numero: 0009
titulo: Generación OpenAPI desde esquemas Zod
estado: aprobada
fecha: 2025-12-17
autor: 'Equipo TITAN'
---

Resumen
-------
Se implementa un generador mínimo que convierte esquemas Zod relevantes a OpenAPI (YAML) y expone la documentación en `/api/docs/openapi.yaml`. Esto permite mantener la fuente de verdad en las validaciones Zod y asegurar trazabilidad entre validaciones y documentación.

Decisión
--------
Se decidió implementar una solución local y ligera (`src/infraestructura/documentacion/generador-openapi.ts`) compatible con Bun/Hono sin añadir dependencias externas, por ahora cubriendo los esquemas más críticos (Glosario y ADRs). Además, se añadió la UI Redoc en `/api/docs` y pruebas E2E que validan la integración.

Consecuencias
------------
- Pros: Trazabilidad directa Zod → OpenAPI, tests E2E incluidos, sin dependencias adicionales.
- Contras: El convertidor es intencionalmente limitado (soporta tipos comunes); se planea extenderlo con cobertura completa o sustituir por una librería madura cuando sea aprobada por la arquitectura.

Plan de seguimiento
-------------------
1. Extender cobertura (arrays, formatos, ejemplos, seguridad por endpoint) — **Completado** (2025-12-17). Se añadieron tests unitarios y E2E que verifican arrays, formatos (email/uuid/url/datetime), ejemplos automáticos en español y la presencia de `bearerAuth` en operaciones POST.
2. Automatizar la generación de paths recorriendo `src/infraestructura/servidor/servidor-hono.ts` y detectando validadores en controladores — **Prototipo implementado** (2025-12-17). El generador ahora detecta rutas y asocia automáticamente esquemas por convención y heurística; se añadieron pruebas que validan que `/api/docs/openapi.yaml` contiene las rutas y referencias esperadas.
3. Extensiones implementadas: soporte para `ZodUnion` (mapea a `anyOf`), `ZodRecord` (mapea a `additionalProperties`) y generación de ejemplos en español basados en nombres de propiedad (ej.: `termino`, `definicion`, `titulo`).
4. Plan siguiente: mejorar heurística para nombres irregulares (p.ej. ADR/ADRs), extender mapeo para parámetros de consulta y headers (ej.: paginación, filtros) y cubrir más tipos avanzados (map, tuple) y metadata (descripciones, ejemplos enriquecidos).
5. Evaluar integrar librería consolidada `zod-to-openapi` si se acepta por la arquitectura MCP.
6. Documentar en la guía de contribución cómo añadir nuevas mappings para esquemas Zod y cómo extender el generador.
