# PR: Corrección de `esquema-glosario`

**Resumen**

Se corrige la definición de *placeholders* en `src/infraestructura/base-de-datos/esquemas/esquema-glosario.ts` para evitar errores de transformación en entornos donde `drizzle-orm/pg-core` no está instalado. El cambio sustituye parámetros anotados con tipos TS en placeholders (p. ej. `(/* name */: string)`) por firmas sin anotaciones (`name: any`) y añade comentarios que explican la razón.

**Motivación**

Durante la ejecución de la suite de pruebas se detectó un error `Transform failed` originado por anotaciones de tipo en funciones placeholder que se transpilan en entornos ESM/CJS con herramientas de bundling (esbuild/vite). Esto impedía ejecutar E2E y unitarias en entornos sin Drizzle.

**Qué se hizo**

- Reemplazo de firmas de placeholders por versiones sin anotaciones TypeScript (uso controlado de `any` y supresión puntual de regla ESLint).
- Comentarios explicativos añadidos en el código.
- Verificación: suite de tests local pasa (69/69).

**Impacto**

- Mejora de robustez en entornos sin Drizzle/DB durante la construcción y ejecución de tests.
- No cambia comportamiento en producción cuando Drizzle está disponible.

**Pruebas**

- Vitest: todos los tests pasan localmente (35 archivos, 69 tests).

**Notas**

Si deseas que empuje la rama y abra el PR en GitHub, añade el remoto `origin` o proporciona los detalles del repositorio (owner/repo) y permisos para poder crear el PR automáticamente.