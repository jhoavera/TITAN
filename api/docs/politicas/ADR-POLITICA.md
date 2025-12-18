# Política ADR - Flujo y Control de Cambios

Objetivo

Asegurar trazabilidad, revisión humana y cumplimiento del idioma español técnico empresarial para todos los cambios de nomenclatura y decisiones arquitectónicas.

Estados de un ADR
- `pendiente`: propuesta creada y en revisión.
- `en revisión`: revisión en curso por el equipo.
- `aprobado`: decisión aprobada y lista para aplicar cambios.
- `rechazado`: propuesta denegada.

Flujo de propuestas automáticas

1. Detección: los scripts automáticos (`revisar-idioma.ts`, `limpiar-repo.ts --auto-approve` en modo no-aplicar) generan hallazgos.
2. Propuesta en glosario: se crea entrada en `documentacion-fuente-unica-verdad/glosario-biblioteca/propuestas` con justificación técnica.
3. Creación ADR: se crea un ADR en `documentacion-fuente-unica-verdad/ad-rs` en estado `pendiente` para revisión humana.
4. Revisión: equipo revisa ADR y propuesta de glosario, solicita cambios o aprueba.
5. Aplicación: al aprobar, se aplica el cambio (renombrado, refactorizado, migración) con nuevo ADR en estado `aprobado` y commit que referencia el ADR.

Excepciones y auto-aprobación

- Cambios que no afectan nombres visibles al usuario (archivos temporales, duplicados idénticos, artefactos) pueden auto-aprobarse mediante heurísticas (flag `--auto-approve`).
- Cambios de nomenclatura, migraciones, renombrados o cualquier acción que afecta funcionalidad o documentación **no** auto-aprueban y requieren ADR humana.

Validación de idioma

- Se rechaza la creación de ADRs cuyo título, objetivo o decisión contengan indicios de términos en inglés. Use `bun ./scripts/revisar-idioma.ts --dry-run` para generar propuestas automáticas antes de reintentar.

Auditoría

- Todas las decisiones y propuestas quedan registradas en logs y en eventos de pre-validación para auditoría y métricas.

Notas finales

- No se aplican cambios en remoto automáticamente; los PRs/commits locales quedan a la espera de su revisión y push manual cuando la revisión haya concluido.
