# ADR-00xx: Reestructura y centralización de `scripts/` en servicios con orquestador maestro

Estado: propuesta

## Contexto

El repositorio contiene una gran cantidad de scripts distribuidos bajo `scripts/` con responsabilidades variadas (despliegue, herramientas, pruebas, respaldo, migración, etc.). Esto dificulta descubrimiento, orquestación y mantenimiento. Existe la necesidad de centralizar y estandarizar la estructura manteniendo trazabilidad y seguridad (no mover artefactos del SSOT sin aprobación).

## Problema

- Scripts dispersos y nombres inconsistentes.
- Falta de un orquestador maestro que permita ejecutar flujos compuestos de forma reproducible y con dry-run.
- Riesgo de movimientos automáticos sin aprobaciones (pérdida de información o inconsistencias en manifiesto).

## Opciones consideradas

1. No hacer nada (status quo).
2. Reubicar y renombrar scripts automáticamente por un script (alto riesgo).
3. Proponer reestructuración en fases con ADR, creación de índices/README por servicio y un orquestador maestro en modo `--propuesta` y `--dry-run` para validar antes del movimiento real. (Recomendado)

## Decisión propuesta

Adoptar la opción 3: aprobar ADR para reestructuración por fases. Las fases incluyen análisis, creación de índices y `run.sh.propuesta` por servicio, crear `scripts/despliegue/maestro.sh.propuesta` (orquestador en modo propuesta), pruebas de dry-run y finalmente ejecución por sub‑lotes con backups y verificación. Ningún archivo será movido o renombrado hasta recibir aprobación explícita posterior.

## Consecuencias

- Positivo: Mejor descubrimiento, orquestación reproducible, menor riesgo al aplicar cambios por lotes.
- Requiere: pruebas, generación de ADR de ejecución, revisiones humanas y backups antes de cualquier movimiento.

## Plan de migración (resumen)

1. Fase de preparación: generar índices y `run.sh.propuesta` para cada servicio; crear `maestro.sh.propuesta` (no ejecutable por defecto).
2. Fase de validación: ejecutar `maestro.sh.propuesta --dry-run` para todos los flujos relevantes; generar reports y log.
3. Fase de aplicación (solo con aprobación ADR y checklist): ejecutar por sub‑lotes seguros con `apply_sub_lot.sh --confirm` y verificación posterior.
4. Rollback: restaurar desde `respaldo/renombrados/*.tar.gz` y revertir cambios en manifiesto si aplica.

## Validación

- Generar reportes automáticos (`reports/scripts_analysis.md`).
- Pruebas unitarias y de integración para cada `run.sh.propuesta` (no tocar producción hasta validar). 

## Checklist de aceptación (para aprobar ADR y avanzar a aplicación)

- [ ] Generar índices (`INDEX.md`) y `README.md` por servicio listando scripts y responsabilidades.
- [ ] Crear `run.sh.propuesta` skeleton en cada servicio con `--dry-run` y `--confirm` flags.
- [ ] Ejecutar `maestro.sh.propuesta --dry-run` cubriendo todos los servicios y registrar resultados en `reports/`.
- [ ] Ejecutar `scripts/herramientas/deep_investigate_batch.py` para los lotes pendientes y publicar `manifiesto_applied_proposals_batch_<n>.yml` en `reports/review_batches/`.
- [ ] Aprobar manifiesto provisional y revisar evidencia (backups + git history) antes de marcar `applied` en el manifiesto maestro.
- [ ] Añadir pruebas automatizadas que verifiquen integridad post-movimiento (verificar rutas en `estructura_manifiesto.yml`).
- [ ] Revisiones manuales aceptadas por al menos un revisor técnico (ownership asignado).

## Criterios de éxito

- Estructura centralizada con índices por servicio y un orquestador maestro que pasa `--dry-run` sin errores.
- 0 archivos `.md` modificados en el SSOT sin ADRs adicionales aprobados.
- Registro de respaldo y planes de rollback disponibles para cada sub-lote aplicado.


---

Autor: jhoavera
Fecha: 2025-12-15
