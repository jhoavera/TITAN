# Helpers de tests

## `withTempAudit`

Este helper (ubicado en `test/helpers/auditoria.ts`) crea un fichero de auditoría temporal y exporta la función `withTempAudit(fn)` que:

- Crea un directorio temporal y un fichero `auditoria.log` dentro.
- Setea `process.env.TITAN_AUDIT_PREVALIDACION_PATH` para que el servicio de auditoría lo use.
- Ejecuta la función `fn(logPath)` y garantiza limpieza (fichero y directorio) al finalizar.

Uso rápido:

```ts
import { withTempAudit } from './helpers/auditoria'

await withTempAudit(async (logPath) => {
  // ejecutar código que registra en la auditoría
})
```

Si necesitas tests deterministas que interactúen con la auditoría, usa esta utilidad para aislar archivos y evitar interferencia entre tests.
