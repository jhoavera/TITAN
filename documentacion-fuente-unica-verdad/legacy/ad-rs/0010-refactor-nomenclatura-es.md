---
adr: 0010
title: Refactorización de nomenclatura a Español Técnico Empresarial y consolidación de estructura
date: 2025-12-14
status: accepted
approvedBy: jhoavera
approvedAt: '2025-12-14T12:00:00Z'

Context:
- El proyecto requiere que la nomenclatura de carpetas y archivos se adecúe al Español Técnico Empresarial cuando sea posible, manteniendo los términos técnicos no traducibles en inglés y registrándolos en un glosario con su posible traducción y descripción de uso.
- La fuente de la verdad es `documento-maestro-parte-4.md` (PARTE 4). Actualmente hay diferencias menores entre manifiestos (canónico: 1048 entradas; propuesto: 1049 entradas). Se requiere reconciliar y garantizar cobertura 100%.
- Estado actual de comparación: el manifiesto propuesto mínimo contiene una entrada adicional `scripts/despliegue/verificar-estructura-completa.sh` que no está presente en el manifiesto canónico. Esta ADR propone incluirla en el manifiesto canónico como parte de la refactorización y normalización.

Decision:
- Se realizará una refactorización local y controlada que:
  - Traduce nombres de carpetas y archivos al Español Técnico Empresarial cuando sea seguro hacerlo.
  - Mantiene nombres técnicos en inglés cuando la traducción no sea adecuada; cada término no traducible se registrará en un glosario propuesto.
  - No modifica archivos `.md` existentes sin generar un ADR específico para esos cambios (esta ADR propone la creación o actualización del glosario, pero los cambios a `.md` se aplicarán únicamente tras aprobación explícita del autor).
  - Actualiza el `config/structure_manifest.yml` para reflejar la estructura final (incluirá la entrada faltante `scripts/despliegue/verificar-estructura-completa.sh`).
  - Todas las operaciones que muevan o renombren archivos serán ejecutadas como dry-run primero, generando un `move_manifest.csv`, respaldos en `reports/archive/<ts>/` y checksums SHA256.
  - Se ejecutarán pruebas locales (sin CI en nube) para verificar paridad 100% entre `documento-maestro-parte-4.md` y el manifiesto resultante.

Consequences:
- Se mantendrá trazabilidad mediante ADRs y `move_manifest.csv` con firmas SHA256.
- Las renombraciones sólo se aplicarán tras correr y verificar los pasos de dry-run y después de la aprobación final del responsable del proyecto.

Implementation notes:
- Se añadirá una plantilla ADR para cambios de nomenclatura menores para agilizar aprobaciones futuras.
- Se implementarán scripts de renombrado idempotentes y reversibles (modo dry-run y --apply) en `scripts/despliegue/utils/`.

---

