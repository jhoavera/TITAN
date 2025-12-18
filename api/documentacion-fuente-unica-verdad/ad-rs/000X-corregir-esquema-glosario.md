---
fecha: 2025-12-15
estado: "registrado"
titulo: "000X - Corregir placeholders en esquema-glosario para evitar errores de build"
---

## Contexto

Al ejecutar la suite de pruebas en entornos donde `drizzle-orm/pg-core` no está instalado, la transformación del archivo `src/infraestructura/base-de-datos/esquemas/esquema-glosario.ts` fallaba debido a anotaciones de tipo en funciones placeholder (p. ej. `(/* name */: string)`). Esto impedía la ejecución E2E y el desarrollo local sin instalar la dependencia.

## Decisión

Sustituir las firmas de placeholder por versiones sin anotaciones de tipo (uso controlado de `any`) y documentar la razón. Esto mantiene la compatibilidad en entornos sin Drizzle y no afecta la funcionalidad cuando Drizzle está presente.

## Plan de Aplicación

1. Aplicar el cambio en el archivo mencionado.
2. Ejecutar la suite de tests localmente.
3. Crear PR con descripción en español técnico empresarial y solicitar revisión.

## Reversión

Revertir el commit si surge evidencia que el cambio introduce regresiones en entornos con Drizzle.
