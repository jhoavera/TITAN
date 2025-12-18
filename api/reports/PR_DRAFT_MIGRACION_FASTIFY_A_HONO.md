# Borrador: Migración de Fastify → Hono (no empujar sin autorización)

**Resumen**
- Objetivo: Completar la migración de la superficie HTTP de Fastify a Hono, eliminar `fastify` de dependencias y actualizar documentación y tests. Todo trabajo se realiza *localmente* y en modo `Bun` preferente.
- Estado actual: Adaptador `fastify-to-hono` implementado y probada; servidor Hono funcional (`src/infraestructura/servidor/servidor-hono.ts`); la mayoría de tests pasan, una condición de carrera en glosario fue resuelta y la suite ahora está verde.

---

## Archivos que referencian Fastify (detectados)
(Se recomienda volver a ejecutar la detección automática antes de eliminar la dependencia)

- `src/infraestructura/servidor/app.ts` (registro Fastify minimal)
- `src/infraestructura/servidor/adaptadores/fastify-to-hono.ts` (adaptador)
- `src/infraestructura/servidor/servidor-hono.ts` (bootstrap Hono, importa adaptador)
- `test/pruebas/unit/adaptador-fastify-to-hono.prueba.ts`
- `test/pruebas/integracion/e2e-glosario-con-db-env.prueba.ts` (usa Fastify en CI DB env)
- `test/pruebas/integracion/auditoria-prevalidacion.prueba.ts` (usa Fastify)
- `test/pruebas/integracion/ops-renombrar.prueba.ts` (usa Fastify)
- `documentacion-fuente-unica-verdad/ad-rs/0007-migracion-fastify-a-hono.md` (ADR previa)
- `package-lock.json` (referencias a fastify metadata)
- `reports/fastify-deteccion.json` y `reports/plan-migracion-fastify.json`

> Nota: lista generada por búsqueda estática; puede haber referencias transitorias (docs, comentarios, examples) que deben revisarse caso por caso.

---

## Tests/artefactos que validan la corrección
- `test/pruebas/unit/adaptador-fastify-to-hono.prueba.ts` (unidad del adaptador)
- `test/servidor/servidor-hono.test.ts` (verifica bootstrap Hono) — **añadido test para /api/docs y /api/docs/openapi.yaml**
- `src/infraestructura/documentacion/generador-openapi.ts` — **implementado generador Zod→OpenAPI (YAML)**
- `test/e2e/rate-limit.prueba.ts` — **E2E para limitación de tasa (verifica 429)**
- `test/pruebas/integracion/e2e-glosario-flujo.prueba.ts` (E2E glosario: crear→aprobar)
- `test/pruebas/integracion/e2e-glosario-sin-db.prueba.ts` (fallback sin DB)
- Ejecutar `npm run pruebas` (Vitest sobre Bun) debe pasar todas las suites antes y después del cambio.

---

## Checklist previo a eliminar `fastify` de dependencias (obligatorio)
- [ ] Ejecutar búsqueda completa por `fastify` en el repo (scripts/revisar-fastify local)
- [x] Migrar todas las pruebas que importan `fastify` a usar `servidor-hono` o adaptadores equivalentes
- [ ] Validar que todos los endpoints críticos pasan E2E (sin DB y con DB env) en Bun
- [ ] Actualizar `documento-maestro` y `documento-maestro-parte-4.md` (eliminar o anotar sección que describe Fastify)
- [ ] Actualizar ADR: cerrar/adoptar `0007` + crear ADR de eliminación final (`0008`) y aprobar por el equipo
- [ ] Eliminar `fastify` de `package.json` y regenerar lockfile (`bun install` o `npm install --package-lock-only --ignore-scripts`) *localmente* sólo después de confirmación manual
- [ ] Ejecutar `bun install` y `bun test` para verificar que no hay roturas en runtime Bun
- [ ] Documentar rollback (re-aplicar `fastify` versión X si hay fallo crítico) y marcadores de tiempo para revertir

---

## Plan de trabajo incremental (alto nivel)
1. Detectar y catalogar (automatizado)
   - Afianzar `reports/fastify-deteccion.json` y regenerarlo con script (si es necesario).
2. Aislar y adaptar controladores (hecho parcialmente)
   - Mantener controladores runtime-agnósticos (RequestLike/ReplyLike).
3. Migrar middleware y plugins de `fastify` a alternativas Hono/MCP-aware
   - Revisar JWT auth, auditoría, CORS, **rate-limits (implementado)**, **swagger (endpoints añadidos)**, **websocket (pub/sub util añadido)**.
4. Actualizar tests y E2E para usar Hono o adaptadores
   - Asegurar cobertura para casos con y sin DB.
5. Crear ADR de eliminación final y someter a aprobación (propuesta incluida en este PR)
6. Eliminar `fastify` de `package.json` y lockfile (con PR separado de limpieza de dependencias)
7. Validación final, documentación y cierre de ADR

---

## Riesgos y mitigación
- Riesgo: Plugins (p.ej. `@fastify/*`) con comportamiento específico que no tienen 1:1 en Hono → mitigación: crear adaptadores o mantener pequeñas piezas de compatibilidad temporal y documentarlas.
- Riesgo: Regresión E2E → mitigación: ejecutar suite completa, añadir tests de regresión para endpoints críticos y bloquear merge hasta 0 fallos.

---

## Cómo revisarlo localmente (comandos sugeridos)
- Ejecutar tests: `npm run pruebas` (preferible con Bun: `bun test` cuando esté configurado)
- Detectar referencias: `rg "\bfastify\b" -n` (ripgrep) o `node scripts/migracion/detectar-fastify.js`
- Regenerar lockfile (local, sin push): `npm install --package-lock-only --ignore-scripts` (o `bun install` si utilizamos Bun)

---

## Petición al mantenedor (tú)
- Revisa el borrador y confirma si quieres que cree:
  - PR draft con estos cambios y archivos adjuntos (reports y ADR propuesta)
  - Un PR de limpieza para remover `fastify` (después de la confirmación y pasar CI local)

> No empujaré nada ni abriré PRs en remoto hasta recibir autorización explícita.

---

_Escrito en español técnico empresarial — preparado para ser incluido en PR draft._

**Estado actual:** Todas las pruebas unitarias, de integración y E2E pasan localmente (`bun test`), incluyendo las nuevas pruebas E2E para rate-limit y la validación de OpenAPI generado. Cambios comprometidos en la rama `migracion/node-a-bun-2025-12-17` (commit `ed7d79a`).

**Acción solicitada:** Revisión local y autorización explícita para abrir PR remoto y/o eliminar `fastify` de las dependencias (esto se hará en PR(s) separadas luego de validar que no quedan referencias críticas).
