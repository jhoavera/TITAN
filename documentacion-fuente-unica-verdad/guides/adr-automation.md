# ADRs Automatizadas — Guía rápida

Objetivo: explicar cómo generar, revisar y aplicar ADRs propuestas automáticamente por las herramientas del repositorio.

Flujo recomendado:
1. Ejecutar `bun run proponer:imports` o ejecutar `npm run revisar-idioma` para detectar propuestas automáticas.
2. Las propuestas generan archivos en `reports/` y borradores de ADR en `documentacion-fuente-unica-verdad/ad-rs/proposals/`.
3. Revisar propuestas y aprobar mediante el flujo `scripts/servicios/proponer-refactor-imports.ts --apply-changes` o usando `--force` cuando corresponda.

Reglas y garantías:
- Todas las propuestas generan ADRs (plantilla en `documentacion-fuente-unica-verdad/ad-rs/PLANTILLA-ADR.md`).
- Ningún cambio se aplica automáticamente sin ADR aprobado (dry-run por defecto).
- Todos los cambios aplicados crean un branch local y un commit, y no se hace push sin autorización explícita.

Ejemplo de uso:
- Detectar términos en inglés: `bun run revisar-idioma:bun` → genera ADRs de traducción y propuestas de glosario.
- Resumen de propuestas: `bun run preparar-pr-draft` → `reports/pr-draft.json` con resumen.

Próximos pasos:
- Integrar un endpoint o CLI que muestre el estado y el historial de ADRs (por autor, fecha, estado).
- Añadir pruebas E2E que validen flujo completo ADR → revisión → aplicación (sin push).
