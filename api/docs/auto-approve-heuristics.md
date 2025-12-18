# Heurísticas de Auto‑Approve (Resumen)

Se aplican las siguientes reglas conservadoras para decidir auto‑aplicar cambios:

- Aprobación explícita en frontmatter (`aprobado: true`) o marca `auto-approve` → permite.
- Atajo de maintainer: autor listado en maintainers y cambio pequeño → permite.
- Índices `index.ts` / `indice.ts` que solo re-exportan → permiten.
- Se rechaza cualquier `package.json` de forma segura.
- Se rechazan archivos con bloques de código o que contienen `import`/`export`.
- Las decisiones quedan registradas en `tmp/metrics/auto-approve-metrics.jsonl` con `rule` y `reason`.

Uso:
- Ejecutar `bun run metrics:auto-approve:summary` para obtener un resumen JSON y guardarlo en `tmp/metrics`.
- Revisar `tmp/metrics/*` para afinar las heurísticas y añadir nuevos tests cuando sea necesario.
