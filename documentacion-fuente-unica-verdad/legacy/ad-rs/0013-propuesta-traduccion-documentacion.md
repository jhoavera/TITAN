---
adr: 0013
title: Propuesta de traducción por lote: Documentación (.md)
date: 2025-12-14
status: proposed
proposedBy: jhoavera

Context:
- Se identificaron múltiples archivos de documentación; la mayoría están en español técnico. Este ADR propone auditar y, donde aplique, traducir o clarificar textos en inglés en archivos `.md`.

Scope (propuesto):
- Revisar y proponer traducciones/clarificaciones para los siguientes ficheros (lista inicial):
  - `README.md` (si existe)
  - `CONTRIBUTING.md`
  - `HOJA-DE-RUTA.md`
  - `CONTRIBUTING.md` (verificar estilo y ejemplos)
  - `documentacion/guias/*` (auditoría y propuestas por fichero)

Process:
- Generar CSV con propuestas por archivo (`reports/english_content_proposals.csv` y `reports/translation_proposal.csv`).
- Para cada fichero con contenido en inglés o anglicismos, generar un archivo `.md.propuesta` que contenga la traducción recomendada y una explicación técnica empresarial del cambio.
- No aplicar cambios a los `.md` originales hasta obtener aprobación explícita en un ADR por fichero o lote. Los `.md.propuesta` se adjuntarán al PR para revisión.

Testing & Reversibility:
- Cada propuesta incluirá una prueba simple de consistencia (p.ej., linting, verificación de enlaces) y una instrucción clara para revertir (git revert o aplicar el `.md.propuesta` manualmente).

---

- Generadas propuestas `.md.propuesta` para los archivos de documentación detectados en el repositorio.
- Índice de propuestas: `reports/md_propuestas_fs_index.csv` (propuestas creadas junto a cada `.md`).
- Detector de contenido en inglés ejecutado: `reports/english_content_proposals.csv` (actualmente: 1 archivo con contenido en inglés mínimo -- `scripts/despliegue/verificar-estructura-completa.sh`).
- Estado actual: propuestas generadas localmente; no se aplicaron cambios a los `.md` originales.

Additional artifacts:
- Propuestas de glosario generadas automáticamente para términos técnicos detectados: `documentacion/glosario/propuestas/Dockerfile.propuesta.md`, `documentacion/glosario/propuestas/Makefile.propuesta.md`.
- Generadas propuestas `.md.propuesta` para los archivos de documentación detectados en el repositorio.
- Índice de propuestas: `reports/md_propuestas_fs_index.csv` (propuestas creadas junto a cada `.md`).
- Detector de contenido en inglés ejecutado: `reports/english_content_proposals.csv` (actualmente: 1 archivo con contenido en inglés mínimo -- `scripts/despliegue/verificar-estructura-completa.sh`).
- Estado actual: propuestas generadas localmente; no se aplicaron cambios a los `.md` originales.

Recommended Next Steps:
- Revisar y aprobar ADR-0013 para proceder por lotes (o por fichero) con revisión humana y pruebas (lint/links). Cada fichero aprobado recibirá su `*.md.applied` y se registrará en `reports/archive/` con checksums.
- Si aprueban, preparar PR con los `.md.propuesta` y checklist de pruebas por fichero.

