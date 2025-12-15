# ADR 0027 — Propuesta: Política de Pre‑población y Curación del Glosario (AUTOMATIC_ADD)

Estado: propuesta (pendiente aprobación humana)

Fecha: 2025-12-15

Contexto
-------
Los detectores automáticos añadieron múltiples entradas marcadas `AUTOMATIC_ADD - revisar` en `documentacion-ssot/glosario_proyecto.yml`. Para acelerar la revisión se desarrolló `scripts/herramientas/prepopulate_glossary.py`, que añade definiciones sugeridas y marca las entradas como `AUTOMATIC_ADD - pre-poblado` (backup creado `glosario_proyecto.yml.prepopulated.bak`).

Decisión Propuesta
------------------
1. Aceptar el uso controlado de la herramienta de pre‑población como ayuda de curación.
2. Reglas operativas:
   - Las definiciones añadidas automáticamente deberán ser revisadas y validadas por un revisor humano antes de considerarse definitivas.
   - Cualquier término que permanezca en inglés por necesidad técnica deberá incluirse en el glosario con: término en inglés, posible traducción (si aplica), justificación de preservación, y una descripción clara de su propósito.
   - El glosario `documentacion-ssot/glosario_proyecto.yml` será la única fuente oficial (SSOT) para ilos términos del proyecto.

Archivos de referencia
---------------------
- `documentacion-ssot/glosario_proyecto.yml` (pre‑poblado automático; backup `.prepopulated.bak`).
- `scripts/herramientas/prepopulate_glossary.py` (herramienta de pre‑población).

Firma / Aprobación
------------------
Revisor responsable: ____________________
