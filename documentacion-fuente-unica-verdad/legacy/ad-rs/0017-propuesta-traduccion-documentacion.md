---
adr: 0017
title: Propuesta de proceso para traducción y revisión de documentación (.md)
date: 2025-12-14
status: accepted
proposedBy: jhoavera
approvedBy: jhoavera
approvedAt: '2025-12-14T16:50:00Z'

Context:
- Se requiere migrar la documentación a Español Técnico Empresarial sin perder trazabilidad ni contenido.
- Ya se han generado propuestas automáticas: `reports/md_propuestas_fs_index.csv` (propuestas desde FS) y `reports/translation_proposal.csv` (manifiesto).
- Detector de contenido en inglés ejecutado: `reports/english_content_proposals.csv` (1 fila encontrada para revisar).

Decision:
- Establecer un proceso controlado para revisar y aplicar cambios a archivos `.md` solo tras aprobación de este ADR y validación humana por reviewers asignados.

Scope:
- Archivos `.md` del repositorio; las propuestas generadas se usarán como entrada para revisión humana.
- No se aplicarán cambios automáticos sin ADR aprobado y checklist de verificación.

Process (resumen):
1. Revisar `reports/md_propuestas_fs_index.csv` y `reports/translation_proposal.csv` para priorizar archivos.
2. Ejecutar detector inglés y priorizar archivos con score alto (`reports/english_content_proposals.csv`).
3. Para cada archivo: generar `.md.propuesta` (hecho) y asignar revisor técnico y revisor de documentación.
4. Realizar PRs por lotes pequeños (ej.: `documentacion/verticales/`), ejecutar pruebas de links y formateo, y revisar por QA.
5. Aplicar cambios tras aprobación, archivar evidencia en `reports/archive/<ts>/` y actualizar `config/structure_manifest.yml` si aplica.

Execution Evidence (actual):
- `reports/md_propuestas_fs_index.csv` — index de propuestas creadas desde FS.
- `reports/translation_proposal.csv` — propuestas derivadas del manifiesto.
- `reports/english_content_proposals.csv` — detector inglés (1 fila).

Status Update (2025-12-14):
- Ejecutadas generación de `.md.propuesta` y detector inglés; propuestas creadas en `reports/md_propuestas_fs_index.csv`.
- Recomendación: priorizar 5-10 `.md.propuesta` para revisión humana y preparar PR por lote una vez aprobado este ADR.

Recommended Next Steps:
1. ADR-0017: Aprobado (por `jhoavera`) — iniciar batch piloto de traducción.
2. Priorizar 5–10 archivos con mayor impacto y preparar PRs por lote con `.md.propuesta` adjuntas para revisión.

Pilot Batch 1 (prioridad - 10 archivos):
- documentacion-ssot/documento-maestro-parte-4.md.propuesta
- documentacion-ssot/documento-maestro-ssot.md.propuesta
- documentacion/glosario.md.propuesta
- scripts/despliegue/TITAN-MSP-v13.0/README.md.propuesta
- scripts/despliegue/TITAN-MSP-v13.0/CONTRIBUTING.md.propuesta
- scripts/despliegue/TITAN-MSP-v13.0/HOJA-DE-RUTA.md.propuesta
- scripts/despliegue/TITAN-MSP-v13.0/documentacion/arquitectura/decisiones-arquitectonicas.md.propuesta
- scripts/despliegue/TITAN-MSP-v13.0/documentacion/operaciones/procedimientos-backup.md.propuesta
- reports/README.md.propuesta
- reports/rename_proposals_summary.md.propuesta

Notes:
- Crear PR local por lote: `pr/0009-traduccion-documentacion-batch-1`.
- NO pushear sin tu revisión final; todo local hasta aprobación remota.

---
