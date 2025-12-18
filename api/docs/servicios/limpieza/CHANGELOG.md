## 2025-12-17 - Mejora: Heurísticas de auto-aprobación seguras

- Añadido `evaluarAutoAprobacion` en `ServicioLimpieza` con reglas:
  - Archivos temporales por nombre → auto-aprobado
  - Archivos pequeños y antiguos → auto-aprobado
  - Duplicados con hash SHA-256 idéntico → auto-aprobado
  - Carpetas pequeñas y antiguas → auto-aprobado (mover)
  - `reportar-adr` nunca se auto-aprueba
- Expuesto flag `--auto-approve` en `scripts/limpiar-repo.ts` para ejecutar despliegues controlados.
- Tests añadidos: `tests/servicios/limpieza/autoaprobacion.test.ts`.
- Documentación de uso actualizada en `docs/servicios/limpieza.md`.
