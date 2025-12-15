---
adr: 0014
title: Propuesta de traducción por lote: Scripts y mensajes de ayuda
date: 2025-12-14
status: accepted
approvedBy: jhoavera
approvedAt: '2025-12-14T15:20:00Z'
proposedBy: jhoavera

Context:
- Algunos scripts contienen banderas, mensajes y comentarios en inglés que podrían documentarse o traducirse al Español Técnico Empresarial sin romper compatibilidad.

Scope (propuesto):
- Revisar scripts en `scripts/despliegue/` y `scripts/` para:
  - Documentar banderas y mensajes en español en comentarios y `--help` impresos.
  - Mantener CLI flags estándar en inglés si son convenciones (documentarlas en el glosario).

Process:
- Crear propuestas `.sh.propuesta` que muestren las líneas a traducir y la versión en español técnico empresarial.
- Usar `find_english_content.py` para identificar candidatos y generar `reports/english_content_proposals.csv`.
- Aplicar cambios sólo después de aprobación mediante ADR y prueba `--dry-run` + `test_create_manifest_apply_and_verify_local_tempdir.sh`.

---
