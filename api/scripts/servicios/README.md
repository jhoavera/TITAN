README - Adaptadores de servicios

Carpeta: `scripts/servicios/`

Propósito: centralizar puntos de entrada (adapters) para que agentes y scripts orquestadores puedan invocar funcionalidades concretas (integridad de idioma, generación de ADRs, registro de propuestas de glosario) desde un único lugar.

Arquitectura:

- `integridad-idioma.ts` — expone `runIntegridadIdioma(raiz)` que devuelve hallazgos y propuestas.
- `glosario.ts` — expone `crearPropuestaGlosario(nombre)` que reutiliza `servicio-validacion-creacion`.
- `adrs.ts` — expone `crearADR(raiz, nombre, contenido)` para crear archivos ADR en el formato estándar.
- `index.ts` — orquesta todos los chequeos (función `runAllChecks`).

Uso recomendado por agentes: importar `scripts/servicios/index.ts` y llamar `runAllChecks` con la ruta del proyecto a revisar.

Referencia de uso y ejemplos: `api/doc/specs/servicios-usage.md` contiene ejemplos programáticos y comandos CLI para los servicios más usados.
