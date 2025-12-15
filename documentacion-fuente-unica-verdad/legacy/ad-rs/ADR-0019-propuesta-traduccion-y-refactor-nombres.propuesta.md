---
adr: ADR-0019
title: Propuesta: Traducción y normalización de nombres al Español Técnico Empresarial
status: propuesta
date: 2025-12-14
authors: [jhoavera]
---

## Contexto
El repositorio contiene gran cantidad de rutas, archivos y documentación con nombres en inglés. Para garantizar consistencia empresarial y técnica, se propone normalizar todos los nombres a Español Técnico Empresarial cuando sea posible.

## Decisión propuesta
- Traducir sistemáticamente nombres de carpetas y archivos al Español Técnico Empresarial.
- No modificar contenidos de archivos `.md` hasta aprobación explícita del ADR: en su lugar generar archivos `.propuesta` para revisión humana.
- Mantener los términos en inglés únicamente cuando no exista una traducción técnica adecuada; dichos términos se registrarán en `documentacion-ssot/glosario_proyecto.yml` con: término, traducción sugerida (si aplica), y justificación técnica.

## Alcance
- Todo el workspace local (carpetas y archivos), incluyendo la raíz fuera de `TITAN-MSP-v13.0`.
- No incluye cambios automáticos en código fuente que requieran cambios funcionales sin evaluación (p.ej., imports de módulos) hasta revisión.

## Reglas y criterios
- Preferir traducción literal técnica (ej.: template → plantilla, manifest → manifiesto, reports → reportes).
- Uso de nombres en minúsculas y guion medio (`-`) para separar palabras en rutas (ej.: `configuracion/parametros-globales.json`).
- Evitar jergas; usar terminología empresarial formal.
- Todos los artefactos y scripts nuevos deben incluir `TS_STRICT=ON` o `--strict` en `tsconfig.json` donde aplique; TypeScript estricto obligatorio para nuevos módulos.

## Proceso propuesto
1. Ejecutar detector mejorado (local) que genere: `reports/translation_proposals_files.csv`, `reports/translation_proposals_docs.csv`, `reports/move_manifest_*.csv` (dry‑run) y actualice `documentacion-ssot/glosario_proyecto.yml` con términos sin traducción.
2. Crear paquete de revisión por lotes con `.propuesta` y checklists (local).
3. Revisión humana y aprobación del ADR; al aprobarse, aplicar renombrados por sub‑lotes con backups, pruebas y verificación local.

## Artefactos
- `documentacion-ssot/glosario_proyecto.yml` (diccionario maestro)
- reportes CSV en `reports/`
- `.propuesta` files para `.md`

## Riesgos
- Roturas por imports o rutas relativas en código: mitigar con pruebas, búsqueda y refactor controlado.
- Pérdida de trazabilidad: se exige backup previo y manifiesto de cambios.

## Aprobación
No aplicar cambios hasta que esta ADR sea aprobada por los responsables.
