# Servicio de limpieza automatizada (propuestas → aplicar)

Resumen: `api/scripts/servicios/limpieza-repo.ts` detecta propuestas antiguas en `documentacion-fuente-unica-verdad/glosario-biblioteca/propuestas`, evalúa heurísticas conservadoras (`shouldAutoApprove`) y puede aplicar (mover a `aplicadas/`) en modo `--apply`.

Comandos:
- `bun run limpiar-repo` — dry-run por defecto
- `bun run limpiar-repo:apply` — aplicar (usar `--auto-approve` para permitir aprobaciones automáticas)

Métricas y trazabilidad:
- Cada decisión de auto-approve se registra en `tmp/metrics/auto-approve-metrics.jsonl` con motivo (`reason`) y `rule` para iterar reglas.
- Al aplicar, el script genera ADRs de registro en `documentacion-fuente-unica-verdad/ad-rs/aplicadas/` para trazabilidad.

Seguridad:
- Se bloquean cambios importantes automáticamente, p.ej. `package.json` nunca se auto-aprueba.
- La política por defecto es conservadora; ajustes deben revisarse vía ADR.
