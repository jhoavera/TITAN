# Índice de Servicios - API TITÁN (Resumen operativo)

Este documento resume los servicios disponibles en `api/src/servicios`, su propósito, la interfaz pública, CLIs relacionadas, y dónde encontrar pruebas y documentación asociada.

## Objetivo
Proveer una referencia rápida y trazable para agentes (Copilot, Raptor mini), desarrolladores y CI local sobre cómo invocar y verificar cada servicio.

---

## Servicios principales

### servicio-validacion-semantica
- Ruta: `api/src/servicios/servicio-validacion-semantica.ts`
- Descripción: Stub LLM para validación semántica de términos y sugerencias; devuelve `ResultadoSemantico` con `score`, `valido`, `razon`, `explicacion`, `candidatos` y `ejemplos`.
- Uso programático: `import { validarSemantica } from '../src/servicios/servicio-validacion-semantica'`
- CLI: `api/scripts/ci/validar-semantica.ts` → `validar-semantica <termino> [sugerencia]` (salida JSON)
- Tests: `api/tests/ci/validacion-semantica.test.ts`
- Nota: diseñado para ser reemplazado por LLM local real (p. ej. llama.cpp) mediante variable de entorno.

### servicio-aprobacion-adrs
- Ruta: `api/src/servicios/servicio-aprobacion-adrs.ts`
- Descripción: Orquesta validaciones (glosario, ADRs existentes, reporte de deduplicación y validación semántica) y genera `reports/propuestas-aprobacion-posible.json`.
- Uso programático: `validarPropuesta(termino, sugerencia?)` y `revisarYProponerAprobaciones()`
- Tests: `api/tests/ci/aprobacion-adrs.test.ts`

### servicio-deduplicacion-propuestas
- Ruta: `api/src/servicios/servicio-deduplicacion-propuestas.ts`
- Descripción: Agrupa y deduplica hallazgos del escaneo (genera `reports/dedup-propuestas.json`)
- CLI: `api/scripts/ci/deduplicar-propuestas.ts`
- Tests: `api/tests/ci/deduplicacion.test.ts` (si existe)

### validar-nombres / servicio-validacion-nombres
- Ruta: `api/src/servicios/validar-nombres.ts`, `api/src/servicios/servicio-validacion-nombres.ts`
- Descripción: Reglas de nomenclatura en Español Técnico Empresarial (rechaza `migrations`, `migration`, etc.), ofrece sugerencias.
- Uso programático: `validarNombre(nombre)` y `validarNombres(nombres)`; `validarNombreConGlosario` disponible para integrar con `ServicioGlosario`.
- CLI / Scripts: `api/scripts/revisar-idioma.ts` (modo dry-run / --apply). 
- Tests: `api/test/servicios/validar-nombres.prueba.ts`, `api/test/servicios/validar-nombres-async.prueba.ts`

### ServicioGlosario
- Ruta: `api/src/servicios/glosario.ts`
- Descripción: CRUD local (falla segura con archivo `tmp-glosario.json`) y adaptador a repositorio Drizzle si está disponible.
- Uso: `new ServicioGlosario()` → `listar()`, `buscar(termino)`, `crear(...)`, `actualizar(...)`, `eliminar(...)`.
- Tests: `api/test/servicios/glosario.prueba.ts`

---

## CLIs y orquestadores relevantes
- `api/scripts/revisar-idioma.ts` — escaneo de código para términos en inglés y propuestas de glosario (dry-run / --apply)
- `api/scripts/revisar-todo.ts` — orquesta múltiples chequeos (idioma, generación de ADRs, deduplicación)
- `api/scripts/ci/validar-semantica.ts` — CLI para validar un término con el stub semántico (JSON output)
- `api/scripts/ci/deduplicar-propuestas.ts` — genera reporte de deduplicación para alimentar flujo de aprobación
- `api/scripts/ci/aplicar-aprobaciones-automatico.ts` — CLI seguro para aplicar propuestas aptas: `--dry-run` (no aplica) y `--apply --apply-when-tests-pass` (aplica solo si las pruebas pasan). Los cambios generan archivos ADR en `documentacion-fuente-unica-verdad/ad-rs/aplicadas/` y se commitean localmente (no se hace push).
- `api/scripts/ci/auto-apply-flow.ts` — orquestador E2E que ejecuta: `revisar-idioma (dry-run) -> deduplicar -> proponer -> aplicar` (controlado por flags `--dry-run`, `--apply`, `--apply-when-tests-pass`).
---

## Buenas prácticas de uso (para agentes o humanos)
1. Ejecutar `scripts/revisar-idioma.ts` en modo dry-run para identificar hallazgos.
2. Ejecutar `scripts/ci/deduplicar-propuestas.ts` para agrupar hallazgos y generar `reports/dedup-propuestas.json`.
3. Ejecutar `servicio-aprobacion-adrs.revisarYProponerAprobaciones()` para generar `reports/propuestas-aprobacion-posible.json` y revisar manualmente.
4. Si una propuesta necesita cambio estructural, crear ADR usando las plantillas en `documentacion-fuente-unica-verdad/ad-rs/` y seguir el flujo de aprobación.

---

## Documentación y trazabilidad
- Migraciones DB para glosario/ADRs: `api/src/infraestructura/base-de-datos/migraciones/0001_crear_tablas_glosario_adrs.sql`
- Plantillas ADR: `documentacion-fuente-unica-verdad/ad-rs/PLANTILLA-ADR.md`
- Plantilla Glosario: `documentacion-fuente-unica-verdad/ad-rs/PLANTILLA-GLOSARIO.md`
- PR Draft Template que incluye checklist de propuestas automáticas: `api/PULL_REQUEST_DRAFT.md` y `.github/PULL_REQUEST_TEMPLATE/pr-migracion.md`

---

## Próximos pasos recomendados
- Añadir un documento `api/doc/specs/servicios-usage.md` con ejemplos concretos de llamadas desde agentes (snippets) y comandos de CLI.
- Asegurar que todos los CLIs tengan `--help` y códigos de salida claros.
- Añadir pruebas de integración para `revisarYProponerAprobaciones()` que simulen `reports/dedup-propuestas.json`.
- Incluir este índice en `README` o en la documentación principal del repo para visibilidad.

---

Archivo generado automáticamente por el agente. Si aprobás, continuaré implementando las mejoras listadas (tests, CLI help, PR helper) y dejaré la rama lista para push cuando me indiques.
