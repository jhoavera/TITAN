# ADR - Habilitar `strict` en TypeScript para todo el monorepo (propuesta)

Estado: propuesta

Contexto:
- El proyecto requiere garantías de tipado y "clean code"; habilitar `strict` evita `any` silenciosos.
- Revisión humana y un plan de corrección son necesarios antes de aplicar cambios de configuración.

Propuesta:
- Habilitar `"strict": true` en `tsconfig.json` de `api` y otros paquetes TypeScript.
- Ejecutar un escaneo previo (`scripts/herramientas/detect_ts_any_undefined.py`) y generar `reports/ts_any_undefined.csv`.
- Corregir o añadir anotaciones precisas para eliminar `any`/`undefined` donde sea posible; documentar las excepciones y anotarlas en el glosario si corresponden.
- Integrar verificación local (`npx tsc --noEmit`) como paso obligatorio en la verificación post-apply.

Plan de aplicación:
1. Aprobar ADR.
2. Crear rama de trabajo y cambiar `tsconfig.json` (solo configuración) y abrir PR que liste los errores de `tsc`.
3. Corregir los errores incrementalmente por módulo; cada cambio debe incluir tests o verificación local `npx tsc --noEmit`.
4. Marcar completado en ADR y cerrar PR.

Riesgos:
- La activación de `strict` puede generar múltiples errores por corregir; se recomienda aplicar por módulos y con cobertura de pruebas.

Referencias: `reports/ts_any_undefined.csv`

Firma: pendiente
