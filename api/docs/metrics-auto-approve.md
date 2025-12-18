# Métricas Auto‑Approve

Resumen: Este documento explica cómo se registran y analizan las métricas relacionadas con decisiones de auto‑aprobación.

Archivos
- `tmp/metrics/auto-approve-metrics.jsonl`: archivo JSONL con eventos (ts, file, ok, reason, rule, ...)
- `tmp/metrics/auto-approve-summary-*.json`: resúmenes escritos por la CLI
- `tmp/metrics/auto-approve-archive-YYYY-MM-DD.jsonl`: archivos archivados por rotación

Comandos
- `bun run metrics:auto-approve` → muestra resumen simple (por regla)
- `bun run metrics:auto-approve --json --write-summary` → imprime JSON y guarda resumen
- `bun run api/scripts/metrics/sumar-auto-approve.ts --json --write-summary --rotate-days 30` → resumen + rotación

Uso y buenas prácticas
- Recomendado ejecutar la rotación periódicamente (30 días por defecto).
- Las métricas son no-faltantes y no fatales: fallos al registrar no interrumpen el flujo.
- Las métricas deben usarse para afinar reglas de `shouldAutoApprove` (reglas que generan `rule` y `reason`).

Próximos pasos sugeridos
- Añadir un endpoint interno para consultar resúmenes (si se requiere visión en UI local).
- Integrar rotación con job CRON del desarrollador local (scripts/ci/ jobs).
