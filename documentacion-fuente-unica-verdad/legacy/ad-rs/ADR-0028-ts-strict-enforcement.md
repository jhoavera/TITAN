# ADR 0028 — Política: Enforzamiento de `TypeScript` en modo `strict` y prohibición de `any`/`undefined` en código de producción

Estado: propuesta (pendiente aprobación humana)

Fecha: 2025-12-15

Contexto
-------
El proyecto utiliza TypeScript en la capa `api`. Para garantizar calidad, mantenibilidad y seguridad tipada se propone la adopción obligatoria de `compilerOptions.strict: true` y la política de **prohibición** de tipos `any` y `undefined` en código fuente del proyecto (excluyendo dependencias y ejemplos temporales).

Decisión Propuesta
------------------
1. Requerir `strict: true` en todos los `tsconfig.json` relevantes del repositorio (ya inicializados en varios sub‑proyectos).
2. Prohibir usos de `any` o variables/retornos que efectivamente puedan ser `undefined` sin control explícito.
3. Mantener y ejecutar reportes automáticos (`scripts/herramientas` y `reports/ts_strict_report.csv`) que identifiquen incumplimientos y generen listas de priorización para corrección.
4. Implementar plan de migración: corregir librerías internas primero, agregar tipos explícitos, añadir tests unitarios donde la inferencia no sea suficiente.

Verificaciones
-------------
- `npx tsc --noEmit` se ejecutará como verificación post‑apply en cambios que afecten TypeScript.
- `reports/ts_strict_enforcement.csv` y `reports/ts_strict_report.csv` son los artefactos de seguimiento.

Consecuencias
-------------
- Aumento inicial del esfuerzo para corregir firmas y tipos; ganancia a largo plazo en robustez y seguridad de cambios.

Firma / Aprobación
------------------
Responsable técnico: ____________________
