# ADR 0025 — Política y Propuesta: Traducción y Renombrado de Documentación (.md)

Estado: propuesta (pendiente aprobación humana)

Fecha: 2025-12-15

Contexto
-------
El repositorio contiene documentación y archivos de texto (.md) con terminología y nombres en inglés que deben adaptarse al Español Técnico Empresarial. Se han ejecutado detecciones automáticas que identificaron 149 archivos candidatos para revisión y propuesta de renombrado/ traducción (ver `reports/translation_proposals_docs_strict.csv`).

Motivación
----------
- Asegurar consistencia terminológica en Español Técnico Empresarial en todo el workspace.
- Mantener trazabilidad (SSOT) y evitar cambios automáticos no aprobados por humano.
- Proteger integridad: ningún `.md` será modificado hasta aprobación formal del ADR correspondiente.

Alcance
-------
Aplica a todos los archivos `.md` del repositorio y a las propuestas de nombres de archivos y rutas contenidas en `reports/translation_proposals_docs_strict.csv` y sus sidecars `*.md.propuesta`.

Decisión Propuesta
------------------
1. Adoptar este ADR como política de trabajo para traducciones y renombrados de documentación.
2. Proceso operativo:
   - Ejecutar detectores y generar `*.md.propuesta` (hecho).
   - Agrupar propuestas en ADRs por lotes para revisión (ej.: ADR por lotes y ADR-0026 para aplicar renombres por lotes).
   - No aplicar cambios directos a `.md` hasta que el ADR de lote sea aprobado explícitamente por el responsable del proyecto.
   - Toda traducción que implique cambio de nombre físico de archivo requerirá:
     - Backup completo del archivo/árbol afectado (tar.gz en `respaldo/renombrados/`).
     - Actualización del manifiesto si corresponde.
     - Generación de informe de verificación post‑aplicación y `npx tsc --noEmit` para validar integridad.

3. Criterios para aceptar una propuesta automatizada:
   - Score heurístico ≥ configurable (recomendación inicial: 2 para docs; se puede ajustar).
   - Revisión humana de la propuesta `.md.propuesta` y confirmación de la equivalencia de contenido.
   - Inclusión en glosario si el término se mantiene en inglés por necesidad técnica.

Riesgos y mitigaciones
----------------------
- Riesgo: pérdida de referencias o enlaces rotos. Mitigación: backups + verificación + búsqueda de referencias.
- Riesgo: inconsistencias terminológicas. Mitigación: usar `documentacion-ssot/glosario_proyecto.yml` como SSOT y pre‑poblado automático para revisión.

Archivos de referencia
---------------------
- `reports/translation_proposals_docs_strict.csv` — listado y puntuaciones detectadas (149 candidatos).
- `documentacion-ssot/ad-rs/ADR-00xx-propuesta-traduccion-md.propuesta` — borrador generado automáticamente.

Firma / Aprobación
------------------
Responsable del proyecto: ____________________ (aprobación manual requerida)
