---
adr: 0011
title: Revisión de traducciones - Resultado y plan siguiente
date: 2025-12-14
status: accepted
approvedBy: jhoavera
approvedAt: '2025-12-14T14:30:00Z'

Context:
- Tras ejecutar un análisis exhaustivo del contenido de `documento-maestro-parte-4.md` y del manifiesto canónico (`config/structure_manifest.yml`), se requiere validar si procede renombrar elementos a Español Técnico Empresarial.

Decision:
- Se realizó un pase automático de propuesta de traducción sobre las 1.049 entradas del manifiesto (incluye la entrada añadida `scripts/despliegue/verificar-estructura-completa.sh`).
- Resultado: no se proponen cambios automáticos de nombres (0 renombres sugeridos). Las entradas están ya en español técnico o se consideran términos técnicos estándar (registrados en el glosario).
- Se crea y actualiza el glosario (`documentacion/glosario.md`) con términos no traducibles y su descripción y posible traducción.

Consequences:
- No se aplicarán renombrados masivos automáticos. Si se desea renombrar carpetas/archivos para adaptar terminología, cada grupo de cambios requerirá un ADR específico y aprobación previa.

Next steps:
- Si el responsable solicita renombrados, crearé ADRs por lotes (p. ej. `ADR-0012-refactor-top-level`, `ADR-0013-refactor-scripts`) describiendo cambios, pruebas (apply + verify) y respaldos archivados.
- Continuar con revisión de contenido (archivos que contienen texto en inglés que podrían requerir traducción), respetando la regla: nunca tocar `.md` sin un ADR aprobado.

---
