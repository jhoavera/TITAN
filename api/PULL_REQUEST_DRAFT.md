# Borrador PR: i18n — Propuestas de traducción y herramienta de validación de nombres

## Resumen
Este PR agrupa las propuestas generadas por `scripts/revisar-idioma.ts --apply` (140 hallazgos) y añade:
- ADRs propuestas en `documentacion-fuente-unica-verdad/ad-rs/` (p. ej. `000X-proponer-traduccion-*.md`).
- Archivo generado `tmp-glosario.json` con propuestas de entradas en estado *pendiente*.
- Scaffold del servicio `src/servicios/servicio-validacion-nombres.ts` (validaciones y sugerencias de traducción).
- Script CLI `scripts/refactorizar-idioma.ts` en modo dry-run (simula refactorizados y crea reportes).

> Nota: NINGÚN renombrado automático se aplica sin aprobación de ADR (política de proyecto). Este PR es **borrador** para revisión humana.

## Archivos importantes añadidos/modificados
- `tmp-glosario.json` (propuestas automáticas)
- `documentacion-fuente-unica-verdad/ad-rs/000X-proponer-traduccion-*.md` (ADRs propuestas)
- `src/servicios/servicio-validacion-nombres.ts` (nuevo)
- `scripts/refactorizar-idioma.ts` (nuevo, dry-run)
- `doc/specs/servicios-index.md` y `doc/specs/servicios-usage.md` (documentación e índices operativos para agentes y desarrolladores)
- `scripts/ci/preparar-pr-draft.ts` (genera `reports/pr-draft.json` con checklist de revisión)
- Tests nuevos: `tests/ci/cli-validar-semantica.test.ts`, `tests/ci/preparar-pr-draft.test.ts`, `api/test/servicios/revisar-idioma.applyWhenTests.test.ts` — suites locales pasan (ahora 138 tests; 0 fallos en mi entorno de verificación).
- `PULL_REQUEST_DRAFT.md` (este archivo)
- Cambios de CI local: `package.json` añadido `ci:local:drizzle`, `Makefile` (raíz) con tarea `ci-local` y reemplazo de invocaciones que dependían de `bun/register`/`ts-bun` por llamadas directas a `bun` para mayor compatibilidad local.

## Resumen de hallazgos (agruparé y priorizaré):
1. Términos recurrentes (alta prioridad): `migration`, `migrations`, `migrate` → traducir a `migración`, `migraciones`, `migrar` o añadir a glosario si aplica.
2. Documentación y specs: `doc/specs/*` → correcciones de terminología y plantillas.
3. Scripts y pruebas: `scripts/` y `test/` → nombres de archivos y mensajes en español.
4. Código fuente: `src/*` → cambias de nombre de variables/funciones donde corresponda (solo tras ADR aprobado).

## Checklist para revisión (obligatorio)
- [ ] Revisar cada ADR propuesta en `documentacion-fuente-unica-verdad/ad-rs/`.
- [ ] Validar `tmp-glosario.json` y aceptar/editar entradas en español técnico empresarial.
- [ ] Ejecutar `bun test` y `TEST_DATABASE_URL=... bun ./scripts/ci/aplicar-migraciones-test.ts` localmente.
- [ ] Aprobar ADR(s) antes de aplicar renombrados automáticos.
- [ ] Asegurar que todas las migraciones son idempotentes y que se documentan como `migraciones` en español.
- [ ] Validar que `servicio-validacion-nombres` cubre casos de nombres de archivos, variables, funciones y plantillas.

## Cómo reproducir localmente
1. Asegúrate de tener Bun instalado (ya verificado: v1.3.4).
2. Arrancar DB de prueba: `docker compose -f docker-compose.test.yml up -d`.
3. Aplicar migraciones de prueba: `TEST_DATABASE_URL=postgres://test:test@127.0.0.1:5432/test bun ./scripts/ci/aplicar-migraciones-test.ts` (ya aplicadas con éxito).
4. Ejecutar revisión dry-run: `bun ./scripts/revisar-idioma.ts --quiet`.
5. Ejecutar script dry-run de refactorización: `bun ./scripts/refactorizar-idioma.ts --dry-run`.

## Notas finales
- Todo el trabajo usa Bun por defecto y respeta las normas del documento maestro (100% español técnico empresarial). 
- No se realiza push ni PR remota hasta que confirmes proceder (política establecida).

---
Firma: Equipo TITÁN — Propuesta i18n automatizada (borrador)
