PROPÓSITO: Documentar el uso del CLI `revisar-idioma` y las utilidades asociadas para automatizar la detección de términos en inglés, proponer traducciones, crear propuestas en el glosario y generar ADRs automáticas.

USO BÁSICO:

- Ejecutar desde la raíz del repositorio:
  - `npm run revisar-idioma` — escanea por defecto `process.cwd()` y genera propuestas (ADRs y entradas de glosario propuestas). Las ADRs creadas pasan por el hook de pre-validación y generan metadata `preValidacion` registrada en auditoría local.

Nuevas rutas disponibles en la API:
- `GET /api/v1/auditoria/prevalidacion?limit=N` — lista eventos de pre-validación (últimos N).
- `GET /metrics` — métricas Prometheus básicas sobre pre-validación.
- `POST /api/v1/ops/renombrar-por-adr` — acción opcional para aplicar renombrados en repo local basada en ADR aprobada (requiere autorización explícita y revisión humana antes de empujar).
  - `npm run revisar-idioma -- --raiz /ruta/a/proyecto` — escanear una ruta diferente.
  - `npm run revisar-idioma -- --fail-on-findings` — devuelve código de salida 2 si encuentra términos en inglés.

HERRAMIENTAS RELACIONADAS:

- `npm run validar-crear -- <nombre> [tipo]` — valida un nombre antes de crear un recurso y registra una propuesta en el glosario si es necesario.
- `scripts/revisar-todo.ts` — orquestador que integra `servicios/integridad-idioma` y otros chequeos globales (puede ampliarse para más servicios).

ESTRUCTURA SCRIPTS:

- `scripts/revisar-idioma.ts` — CLI principal para escaneo rápido por término.
  - `bun ./scripts/servicios/integridad-idioma-service.ts` — ejecutar el servicio de integridad de idioma directamente con Bun (preferido por el Stack Maestro).
- `scripts/revisar-todo.ts` — orquestador que invoca adaptadores para varios chequeos.
- `scripts/servicios/` — adaptadores por servicio (ej. `integridad-idioma.ts`, `glosario.ts`, `adrs.ts`) exportando funciones reutilizables para agentes o CI local.
- `scripts/validar-crear.ts` — herramienta de validación previa a crear elementos, pensada para integrarse en puertas de entrada de agentes o workflows locales.

COMPORTAMIENTO:

- Escanea nombres de archivos y contenidos para detectar términos en inglés.
- Crea propuestas de glosario (mediante `servicio-validacion-creacion`) y ADRs automáticas en `documentacion-fuente-unica-verdad/ad-rs/` describiendo la recomendación de traducción.
- No renombra automáticamente archivos/dirs por defecto; crea trazabilidad (ADR + propuesta) para revisión y aprobación humana.

INTEGRACIÓN CON AGENTES:

- Los agentes pueden invocar `npm run revisar-idioma` o `scripts/revisar-todo.ts` para obtener propuestas y agregarlas al flujo de trabajo local.

NOTA: Todas las propuestas y ADRs generadas siguen el requisito de "todo en español técnico empresarial" y están diseñadas para alimentar el proceso de revisión local, no para aplicar cambios automáticos sin ADR aprobado.
