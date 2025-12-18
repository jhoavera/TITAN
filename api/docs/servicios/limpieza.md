# Servicio de Limpieza (automático)

🔧 Resumen

El `ServicioLimpieza` detecta elementos obsoletos, temporales y duplicados, propone acciones (eliminar, mover, reportar-ADR) y permite ejecutar las acciones de forma controlada.

Flags principales:
- `--dry-run`: no aplica cambios, solo lista propuestas.
- `--commit`: tras aplicar los cambios, crea un commit con el mensaje `chore(limpieza): aplicar N acciones de limpieza automatizada`.
- `--auto-approve`: aplica automáticamente acciones que cumplan heurísticas seguras (archivos temporales, duplicados idénticos por hash, carpetas pequeñas y antiguas). Las acciones no seguras se convierten en `reportar-adr` para revisión humana.

Heurísticas seguras principales:
- Archivos temporales por nombre (`*.tmp`, `*.log`, `*.bak`, `.DS_Store`, `~*`) → auto-aprobado.
- Archivos pequeños (<1MB) y con fecha de modificación anterior a 30 días → auto-aprobado.
- Duplicados con hash SHA-256 idéntico → auto-aprobado para eliminar la copia duplicada.
- Carpetas con ≤10 archivos y antigüedad > 30 días → auto-aprobado para mover a `tmp/artefactos-limpieza`.
- `reportar-adr` nunca se auto-aprueba: genera una ADR (en modo `commit: false`) y una propuesta de glosario relacionada.

Trazabilidad, auditoría y seguridad
- Todas las propuestas que no sean auto-aprobadas generan una ADR en `documentacion-fuente-unica-verdad/ad-rs` con estado `pendiente`.
- Las propuestas de cambio de nombre generan además una propuesta en `documentacion-fuente-unica-verdad/glosario-biblioteca/propuestas`.

Uso CLI

$ bun ./scripts/limpiar-repo.ts --dry-run
$ bun ./scripts/limpiar-repo.ts --commit --autor="nombre" --email="a@local" --auto-approve

Notas
- El flag `--auto-approve` es útil para ejecuciones periódicas controladas (cron/local), pero no sustituye la revisión humana para cambios de nomenclatura o migraciones.
- Para cambiar reglas o añadir heurísticas adicionales, modificar `src/servicios/limpieza/servicio-limpieza.ts` (método `evaluarAutoAprobacion`).
