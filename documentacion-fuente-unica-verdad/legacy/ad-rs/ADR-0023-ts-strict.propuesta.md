# ADR-0023: Política de TypeScript - modo `strict` obligatorio

## Estado: propuesta

### Resumen
Establecer `compilerOptions.strict = true` y reglas relacionadas (`noImplicitAny`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `exactOptionalPropertyTypes`) en los `tsconfig.json` del workspace. Para `tsconfig.json` vacíos o ausentes, crear un `tsconfig.base.json` estándar *sujeto a aprobación* y aplicar por sub‑lotes.

### Motivación
Garantizar tipado estricto y evitar `any`/`undefined` implícitos en el código TypeScript, mejorando calidad, seguridad y mantenibilidad en proyectos empresariales.

### Alcance
- Todos los paquetes TypeScript del workspace (API, frontends, librerías internas).
- No aplicar cambios automáticos a archivos vacíos sin aprobación ADR.

### Propuesta
1. Crear `tsconfig.base.json` aprobado por ADR. 2. Añadir `extends` en `tsconfig.json` de cada paquete o actualizar `compilerOptions` existente. 3. Ejecutar linters y correcciones en sub‑lotes revisados.

### Artefactos
- `reports/ts_strict_report.csv` (diagnóstico actual)
- Plantilla `tsconfig.base.json` (generada tras aprobación)
