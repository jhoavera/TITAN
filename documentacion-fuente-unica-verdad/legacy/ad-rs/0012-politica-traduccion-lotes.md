---
adr: 0012
title: Política de traducción por lotes y revisión continua
date: 2025-12-14
status: proposed
proposedBy: jhoavera

Context:
- Tras análisis automático, la mayoría de paths y archivos ya están en Español Técnico Empresarial. Pocos archivos contienen texto en inglés o banderas/ayuda en inglés.
- Reglas de proyecto: no tocar archivos `.md` sin ADR aprobado; todo cambio debe ser local, con dry-run, backups y pruebas que verifiquen cobertura del `documento-maestro-parte-4.md`.

Decision:
- Adoptar una política de traducción por lotes controlada:
  - Crear ADRs por lotes (ej. documentación, scripts, infra/monitoring) que describan los cambios propuestos, impacto, pruebas y revertibilidad.
  - No aplicar renombres automáticos; los renombres deben ser aprobados por ADRs por lote y aplicados con scripts en `scripts/despliegue/utils/` en modo `--dry-run` antes de `--apply`.
  - Mantener nombres técnicos y flags en inglés si su traducción puede romper compatibilidad o reducir claridad; en esos casos documentarlos en `documentacion/glosario.md` con traducción y descripción de uso.

Consequences:
- El primer pase automático arrojó 1 archivo con texto en inglés mínimo (`scripts/despliegue/verificar-estructura-completa.sh`) y 0 renombres automáticos propuestos para los paths.
- Se seguirá un proceso conservador: crear ADRs por lote, revisar propuestas en CSV (`reports/translation_proposal.csv`, `reports/english_content_proposals.csv`) y aplicar cambios sólo tras aprobación.

Implementation notes:
- Scripts de utilidad disponibles: `generate_translation_proposal.py`, `apply_rename_mapping.py`, `find_english_content.py`.
- El siguiente paso propuesto es crear ADRs por lote para documentación y scripts (propuesta inicial: ADR-0013: documentación, ADR-0014: scripts y mensajes de ayuda).

---
