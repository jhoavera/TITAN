---
titulo: "Propuesta: traducir términos detectados en inglés (migraciones, scripts, test, template, service, prompts, etc.)"
autor: renombrar-guiado
fecha: 2025-12-16T10:00:00.000Z
estado: propuesta
---

## Resumen

Se consolida una única propuesta para traducir y normalizar términos detectados en inglés en el repositorio. Esta ADR agrupa las propuestas detectadas automáticamente (p. ej. `migrations`, `migration`, `scripts`, `test`, `template`, `service`, `prompts`, `spec`, `create`, `legacy`) y propone un mapeo por defecto junto con el procedimiento de aplicación controlada (solo tras aprobación humana).

## Mapeo propuesto (canonización)

- `migrations` / `migration` → `migraciones`
- `scripts` → `scripts` (opción: documentar como "scripts" en glosario o usar "scripts (scripts)"; propuesto: mantener pero documentar en glosario si procede)
- `test` / `tests` / `spec` → `prueba` / `pruebas` / `especificación` (preferir `prueba/pruebas`)
- `template` → `plantilla`
- `service` → `servicio`
- `prompts` → `prompts` o `indicadores` (propuesta: mantener `prompts` en glosario si su traducción cambia precisión técnica)
- `create` → `crear` (cuando sea nombre de carpeta/archivo/command)
- `legacy` → `antiguo` / `legado` (propuesta: `legado`)

> Nota: algunas palabras técnicas pueden permanecer en inglés si su traducción produce pérdida de significado; en esos casos se registrará la entrada en `glosario-biblioteca/glosario.md` y se justificará en la ADR.

## Procedimiento propuesto (aplicación controlada)

1. Consolidar y aprobar esta ADR.
2. Ejecutar `bun ./scripts/revisar-idioma.ts --dry-run` y revisar `reports/reporte-refactor-idioma.json`.
3. Preparar plan de aplicación por módulos (migraciones → documentación → scripts → pruebas → código), crear `plan-aplicacion.json` y una rama por módulo.
4. Para cada módulo, ejecutar `scripts/refactorizar-idioma.ts --apply --plan plan-aplicacion.json` en una rama separada con tests y PRs pequeños.
5. Registrar cada cambio en glosario si procede y crear ADRs de excepción cuando una palabra no deba traducirse.

## Riesgos y mitigaciones

- Cambios masivos de nombres pueden romper referencias y tests: mitigación → aplicar por pasos y ejecutar suite completa con Bun antes de merge.
- Palabras con ambigüedad técnica: mitigación → auditoría manual y entrada en glosario.

## Referencias

- `ad-rs/0004-validacion-creacion.md` (validador de nombres y propuesta de glosario automática)
- `scripts/revisar-idioma.ts` y `scripts/refactorizar-idioma.ts`

---
