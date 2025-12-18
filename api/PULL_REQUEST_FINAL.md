# PR: Consolidación y priorización de ADRs — i18n / migraciones / Bun

**Resumen breve (español técnico empresarial)**

Se consolidan las ADRs propuestas por el análisis i18n y el detector automático de nombres. Este PR agrupa las decisiones propuestas, prioriza acciones por categoría (Documentación / Scripts / Tests / Código), y propone checklist y pasos de verificación para aplicar los cambios (solo tras aprobación humana de las ADRs correspondientes).

---

## ADRs incluidas y priorización

**Alta prioridad (impacto amplio / cambia nombres globales / requiere coordinación)**
- `2025-12-16-propuesta-traducir-migrations.md` — Propuesta: `migrations` → `migraciones`. (Impacto: múltiples carpetas y scripts; prioridad ALTA)
- `0005-eliminar-node-en-favor-de-bun-2025-12-15.md` — Propuesta: migración controlada Node → Bun. (Impacto: runtime, CI local; prioridad ALTA)

**Media prioridad (convenciones, glosario, templates, prompts)**
- `000X-proponer-traduccion-scripts-2025-12-16.md` — `scripts` → mantener palabra o documentar en glosario.
- `000X-proponer-traduccion-template-2025-12-16.md` — `template` → `plantilla`.
- `000X-proponer-traduccion-prompts-2025-12-16.md` — `prompts` → proponer si se prefiere `prompts` o `indicadores`.
- `000X-proponer-traduccion-test-2025-12-16.md` — `test` → `prueba`.
- `000X-proponer-traduccion-service-2025-12-16.md` — `service` → `servicio`.

**Aceptadas / ya registradas (acciones concretas)**
- `0004-validacion-creacion.md` — **Aceptado**: implementar `servicio-validacion-creacion` para validar convenciones y crear propuestas en `glosario-biblioteca/propuestas/`.
- `000X-corregir-esquema-glosario.md` — **Registrado**: corregir placeholders en `esquema-glosario` para evitar fallos de build; plan de aplicación definido.

**Notas**: Hay ADRs duplicadas o variantes (p.ej. `000X-proponer-traduccion-migration*`) — consolidaré en el índice maestro (`ad-rs/adr-indice.md`) y propondré una sola ADR canonizada por concepto.

---

## Checklist para PR final

- [ ] Revisar y aprobar ADR canónica: `2025-12-16-proponer-traduccion-migraciones.md` (decisión explícita: aplicar o rechazar). **Acción**: consolidar/archivar variantes listadas en `ad-rs/adr-indice.md`.
- [ ] Revisar y aprobar ADR: `0005-eliminar-node-en-favor-de-bun-2025-12-15.md`
- [ ] Ejecutar y confirmar: `TEST_DATABASE_URL=... bun ./scripts/ci/aplicar-migraciones-test.ts` (migraciones idempotentes aplicadas)
- [ ] Ejecutar: `bun test` — todos los tests unitarios y de integracion deben pasar (atender fallos en `ensure-tools` y `abrir PR` automatizado)
- [ ] Ejecutar: `bun ./scripts/revisar-idioma.ts --dry-run` y validar propuestas generadas en `tmp-glosario.json` y `ad-rs/` propuestas
- [ ] Consolidar entradas del glosario en `glosario-biblioteca/` y crear ADRs de excepción si es necesario
- [ ] Confirmación humana: autor del PR y 1 revisor técnico. No aplicar cambios de renombrado global sin ADR aprobada.
- [ ] Abrir PR remoto en borrador cuando autor confirme: incluir referencia a ADRs aprobadas y checklist completada

---

## Pasos de verificación y pruebas (instrucciones reproducibles)

1. Actualizar rama local: `git checkout i18n/aplicar-traducciones-2025-12-15`
2. Ejecutar migraciones en DB de prueba:
   - `TEST_DATABASE_URL=postgres://test:test@127.0.0.1:5432/test bun ./scripts/ci/aplicar-migraciones-test.ts`
3. Ejecutar suite de tests con Bun:
   - `bun test --silent`
   - Registrar fallos y añadir issues para `ensure-tools` / `abrir PR` fallbacks (prioridad alta si bloquean CI)
4. Ejecutar detector i18n en modo dry-run y revisar propuestas:
   - `bun ./scripts/revisar-idioma.ts --dry-run --out reports/reporte-refactor-idioma.json`
5. Consolidar ADRs propuestas y actualizar `ad-rs/adr-indice.md` con prioridades y responsables.
6. Tras aprobación ADRs (especialmente `migraciones` y `eliminar-node-en-favor-de-bun`): ejecutar `scripts/refactorizar-idioma.ts --apply --plan plan-aplicacion.json` en rama separada con PR y pruebas completas.

---

## Riesgos conocidos y mitigaciones

- Cambios de nombres globales pueden romper rutas en tests y CI — mitigación: aplicar en PRs pequeños por área y correr tests locales/E2E antes de merge.
- Algunas herramientas pueden no ser compatibles con Bun — mitigación: documentar excepción en ADR y proponer alternativa o wrapper.
- Falta de aprobación humana -> no aplicar renombrados (regla del proyecto).

---

## Archivos principales generados/propuestos por el análisis
- `tmp-glosario.json` — propuestas automáticas de glosario
- `documentacion-fuente-unica-verdad/ad-rs/*.md` — ADRs propuestas (lista arriba)
- `scripts/refactorizar-idioma.ts` — script dry-run para agrupar hallazgos (ya existente — revisar y añadir modo `--apply` controlado)
- `src/servicios/servicio-validacion-nombres.ts` — servicio scaffold (validaciones) y `servicio-validacion-creacion` (ver ADR 0004)

---

## Solicitud al equipo / pasos siguientes propuestos
1. Revisar y aprobar (o rechazar) ADR `2025-12-16-propuesta-traducir-migrations.md` y `0005-eliminar-node-en-favor-de-bun-2025-12-15.md` — prioridad ALTA.
2. Si se aprueban, aplicar cambios por módulos con PRs pequeños y pruebas completas (propuesta: migraciones → documentación → scripts → tests → renombrados en código).
3. Mientras tanto, priorizar la corrección de los 5 tests fallidos reportados (ensure-tools, abrir PR/gh fallbacks) — esto mejora flujo CI y facilita merges seguros.

---

**¿Deseas que empuje este PR en borrador (`git push --set-upstream origin i18n/aplicar-traducciones-2025-12-15`) y abra el draft PR remoto ahora?**

(Nota: no empujaremos ni abriremos PR remoto sin tu confirmación explícita.)

---

_Fin del borrador de PR — creado automáticamente por el flujo de consolidación i18n._
