# ADR 0002 — Plantillas propuestas para `api/package.json` y `docker-compose.yml`

Fecha: 2025-12-14
Estado: Aprobada
Autor: Scripts / Equipo TITAN
AprobadoPor: jhoavera
AprobadoAt: '2025-12-14T05:00:00Z'
AplicadoPor: jhoavera
AplicadoAt: '2025-12-14T05:02:00Z'

## Contexto
En la verificación final de la estructura generada desde el SSOT, se detectaron dos advertencias: `api/package.json` y `docker-compose.yml` están presentes pero con contenido vacío o inválido. Para evitar problemas de reproducibilidad y permitir despliegue local mínimo, proponemos añadir plantillas mínimas que contengan los campos esenciales `name` y `version` en `package.json` y un `docker-compose.yml` válido con la configuración básica del servicio `api`.

## Decisión propuesta
- Añadir una plantilla mínima a `api/package.json` con `name`, `version`, `scripts` y metadatos mínimos.
- Añadir una plantilla válida a `docker-compose.yml` con la definición mínima del servicio `api` y variables de entorno de desarrollo.

Estas plantillas no se aplicarán directamente a la estructura generada hasta que se apruebe esta ADR y el owner/propietario de la pieza valide los cambios.

## Razonamiento
- Garantiza que las verificaciones y despliegues básicos funcionen out-of-the-box en entornos locales.
- Mantiene la trazabilidad: las plantillas se proponen para revisión en PR y sólo se aplicarán mediante ADR aprobada.
- Evita errores emergentes en fases de testing y recursos de infraestructura.

## Consecuencias
- Por defecto, las plantillas serán `required: true` en el manifiesto sólo si se aprueba su inclusión. Mientras tanto se mantienen como propuestas y no se alteran archivos reales del árbol ya creado.

## Plantilla de implementación
- Crear PR `PRs/0002-package-docker-plantilla` con:
  - `api/package.json` (plantilla)
  - `docker-compose.yml` (plantilla)
  - `reports/package_docker_proposals.csv` con dueños propuestos y justificación.

## Aprobaciones necesarias
- Owner: equipo `team-devops` (propuesto)
- Revisión: `team-api` (propuesto)
- Aprobación final: `AprobadoPor: <usuario>`
