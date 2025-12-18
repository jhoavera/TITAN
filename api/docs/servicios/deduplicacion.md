# Servicio de Deduplicación

Resumen

El `ServicioDeduplicacion` detecta archivos duplicados por contenido (SHA-256) y propone una acción segura: mantener una copia canónica y mover las demás a `tmp/artefactos-dedup/<hash>/` (por defecto). Opcionalmente puede eliminar duplicados con `--delete`.

CLI

$ bun ./scripts/deduplicar.ts        # dry-run: lista grupos de duplicados
$ bun ./scripts/deduplicar.ts --apply  # aplica el plan: mueve duplicados
$ bun ./scripts/deduplicar.ts --apply --delete --commit --autor="tester"

Notas de seguridad

- Por defecto NO borra duplicados, solo los mueve a `tmp/artefactos-dedup`.
- Para borrar use `--delete` explícito.
- Use `--commit` para commitear los cambios automáticamente (local) y `--autor` para asignar el autor del commit.

Testing

Se incluye `tests/servicios/deduplicacion.test.ts` con casos básicos de detección y aplicación. Ejecutar con `bun test tests/servicios/deduplicacion.test.ts`.
