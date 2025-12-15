# ADR-00xx: Política para traducción y modificación de documentación (.md)

Estado: propuesta

Contexto
--------
El proyecto requiere homogeneizar nombres y documentación al Español Técnico Empresarial.
Por política de gobernanza, los archivos de documentación `.md` no se deben modificar automáticamente sin aprobación explícita mediante un ADR aprobado por el responsable del proyecto.

Decisión propuesta
------------------
- Crear un ADR que establezca el proceso para proponer, revisar y aprobar traducciones y cambios en archivos `.md`.
- Todos los cambios propuestos a `.md` deben ser preparados en un sub‑lote con manifest y checklist, y acompañados de un ADR de aprobación antes de aplicación real.
- Durante la fase de detección y refactorización se generarán propuestas automáticas (`.propuesta`) para `.md` y se mantendrán como artefactos de revisión.

Implicaciones
------------
- Ventajas: trazabilidad, control humano, evitar pérdida de contenido y revisiones semánticas.
- Coste: proceso de revisión adicional y pasos manuales para aprobar cambios en `.md`.

Proceso recomendado (resumen)
----------------------------
1. Ejecutar detector de inglés en docs (genera `reports/translation_proposals_docs.csv`).
2. Generar PR local con propuestas y checklist (`PRs/pr-XXXX-md-batch/`).
3. Aprobar ADR para la batch de `.md` específica.
4. Aplicar cambios con backups y logs locales.

Firmas
------
- Propuesto por: `jhoavera`
