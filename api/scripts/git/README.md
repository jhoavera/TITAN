# Hooks de Git (local)

Este directorio contiene helpers para hooks locales de Git.

Para habilitar el `pre-push` en tu entorno local, ejecuta (opción simple):

```sh
# Preferir Bun sobre npm para la instalación de hooks
bunx npm run instal-hooks || npm run instal-hooks
```

Esto copiará el hook de ejemplo a `.git/hooks/pre-push` y le dará permiso de ejecución.

Alternativa (Husky): si prefieres usar Husky, instala dependencias e inicializa Husky:

```sh
# Preferir Bun cuando esté disponible
bunx npm install --no-audit --no-fund || npm install --no-audit --no-fund
npm run husky:install
```

También puedes ejecutar `npm run setup` que instala dependencias y activa los hooks automáticamente:

```sh
# Preferir Bun si está instalado
bunx npm run setup || npm run setup
```

El hook de Husky queda en `.husky/pre-push` y ejecutará `npm run prepush`.

El hook invocará `npm run prepush` (que a su vez ejecuta `npm run check-stack`). Si Bun no está disponible o la verificación falla, el push fallará con código de salida distinto de 0.

Verificación local completa:
- `make ci-verify` o `bunx npm run ci:verify` — corre la verificación ligera (`check-stack`) y además verifica la precondición para ejecutar workflows locales (`act` o `bunx`). Puedes desactivar temporalmente esta comprobación en entornos controlados exportando `CHECK_ACT_PRE=false`.
- `bunx npm run ci:check-act` — verifica explícitamente si `act` o `bunx` están instalados (devuelve código de error si no). Opcionalmente usa `CHECK_ACT_MIN_VERSION` para requerir una versión mínima semver (ej. `CHECK_ACT_MIN_VERSION=">=0.2.0"`).
- `make setup` — instala dependencias (prefiere Bun) y activa hooks locales.
- `scripts/ci/run-local-ci.sh` — wrapper ejecutable que realiza las comprobaciones locales (prefiere Bun cuando está disponible).

Puedes ejecutar el workflow localmente con `act`:
- `act -j ci-local` (requiere instalar `act` previamente). El job instala dependencias (prefiere Bun) y ejecuta la verificación.

También puedes usar el helper del Makefile:
- `make act-ci` — ejecuta `act -j ci-local` y fallará si `act` no está instalado; si no tienes `act` pero sí `bun` con `bunx`, se intentará `bunx act -j ci-local`.
- `make act-ci-skip` — ejecuta el mismo workflow (`ci-local`) pero **sin** la precondición de comprobación (`ci:check-act`). Útil en entornos controlados donde quieras forzar la ejecución.
- `make setup:full` — ejecuta `make setup` y luego una ejecución rápida de pruebas (`npm run pruebas`) como verificación post-instalación.
- `make ensure-tools` — verifica la presencia de `bun` y `act` e intentará instalarlos automáticamente si faltan (por ejemplo, descargando el instalador de Bun o el binario de `act`). Muestra un resumen final claro indicando si todo está bien o qué falló. `make setup` invoca `make ensure-tools` al inicio con auto-install activado y **reintentos con sudo permitidos** (`ENSURE_TOOLS_ALLOW_SUDO=1`) para ayudar a resolver errores por permisos; si la comprobación o instalación automática falla incluso tras reintentos con sudo, `make setup` abortará y te pedirá ejecutar `make ensure-tools` manualmente con privilegios o revisar los mensajes. Usa `make ensure-tools-skip` para solo comprobar sin intentar instalar (esta opción es usada por `ci:verify`).

**Advertencia:** permitir reintentos con sudo realizará operaciones con privilegios elevados (p. ej. `mv` a `/usr/local/bin` o `apt-get install` con `sudo`). Asegúrate de revisar los mensajes y las acciones realizadas.
- `npm run estado-servicios` — muestra el estado (disponible/no disponible + versión cuando aplica) de herramientas clave del stack: `bun`, `node`, `pnpm`, `docker`, `docker-compose`, `psql` y `act`. Úsalo para confirmar si el "stack moderno" está listo en tu máquina.
- `make estado-servicios` — alias Makefile que ejecuta `npm run estado-servicios` y deja un resumen visible. Útil para incluir en checklists de onboarding local.

Nota: antes de ejecutar `make setup` o `bunx npm run ci:verify` asegúrate de tener un repositorio Git inicializado (`.git`) y de ejecutar los comandos de setup preferidos por Bun.
