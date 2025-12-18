PROPÓSITO

stack solicitado en UBICADO en documentacion-fuente-unica-verad/documento-maestro-parte-1.2.md 

Crear un instalador local del "stack" definido en `documento-maestro.md` que priorice Bun como runtime para las tareas JS/TS y ofrezca una composición de servicios Docker para infraestructura local (Postgres, Redis, Qdrant, Prometheus, Grafana).

USO BÁSICO
- `npm run instalar-stack` — ejecuta el instalador con ts-node (recomendado para entornos donde Bun no esté global).
- `npm run instalar-stack:node -- --with-docker-compose --start` — escribe `docker-compose.titan.yml` y arranca los servicios si Docker está presente. Antes de escribir archivos críticos (ej. `docker-compose.titan.yml`) ejecuta la pre-validación (`validarPreCreacion`) y registra la `preValidacion` en auditoría local.
- Opciones relevantes:
  - `--auto-bun-install` / `-a` — intenta instalar Bun automáticamente (ejecuta script oficial). Use con precaución.
  - `--with-docker-compose` / `-d` — genera `docker-compose.titan.yml` en la raíz.
  - `--start` / `-s` — intentará arrancar servicios por `docker compose` (verifica Docker).
  - `--dry-run` / `-n` — no ejecuta comandos de instalación; imprime lo que haría.

CONSIDERACIONES
- El script no renombra automáticamente archivos; tras la instalación ejecuta `revisar-todo` para detectar inglés y generar propuestas/ADR.
- Se diseñó para seguridad: si no quieres instalación automática de Bun, no pases `--auto-bun-install`.

INTEGRACIÓN CON AGENTES
- Agentes o scripts CI/locally pueden invocar `npm run instalar-stack:node -- <ruta> --with-docker-compose --start` para preparar un entorno reproduci- ble en máquina local TITAN.
