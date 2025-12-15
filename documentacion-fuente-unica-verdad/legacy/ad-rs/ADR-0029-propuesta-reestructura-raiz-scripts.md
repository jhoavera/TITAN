# ADR 0029 — Propuesta: Reestructuración de raíz y modularización de scripts

Estado: propuesta (pendiente aprobación humana)

Fecha: 2025-12-15

Contexto
-------
Se detectó dispersión ("regado") de scripts y recursos en la raíz y subcarpetas (`scripts/`, `pruebas/`, `reportes/`) que dificulta la trazabilidad y la adopción de convenciones empresariales en Español Técnico. Se propone una reestructuración modular que centralice scripts por propósito (despliegue, respaldo, mantenimiento, pruebas) y un índice trazable.

Decisión Propuesta
------------------
1. Reubicar scripts en una estructura modular bajo `scripts/despliegue/titan-msp-v-13-0/` (o equivalente por entorno) y documentos relacionados en `documentacion/` y `reportes/` `reportes/`.
2. Generar archivos `index` (TXT/MD) en cada módulo que liste los scripts y su propósito (trazabilidad).
3. Proceso de ejecución (si se aprueba):
   - Ejecutar `apply_rename_batch.py --batch 1 --apply --manifest configuracion/estructura_manifiesto.yml` para aplicar renombres aprobados en lote 1 (incluye raíz y scripts propuestos).
   - El script creará backup en `respaldo/renombrados/` y actualizará el manifiesto donde aplique coincidencias exactas.
   - Después de aplicar, ejecutar `scripts/despliegue/verificar-estructura-completa.sh --fix` y `npx tsc --noEmit`.
   - Generar `reportes/` con logs, informe de cambios y `index` de los módulos.

3. Criterios: no mover `.md` y no borrar archivos sin respaldo; cualquier término que se preserve en inglés debe añadirse al glosario con justificación.

Archivos de referencia
---------------------
- `reports/manifest_replacements_applied.csv`
- `reports/placeholders_created_*.csv` (scripts list)
- `scripts/herramientas/apply_rename_batch.py`

Firma / Aprobación
------------------
Responsable del proyecto: ____________________
