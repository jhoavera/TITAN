# ensure-tools

Herramienta para comprobar y (opcionalmente) instalar herramientas necesarias para el desarrollo local en TITÁN.

Funcionalidades:
- Verifica presencia de: bun, act, gh (GitHub CLI), y opcionalmente psql y qdrant (modo agresivo).
- Intenta instalaciones automáticas cuando `ENSURE_TOOLS_AUTO_INSTALL=true` (por defecto true).
- Para operaciones que requieren privilegios (por ejemplo instalar paquetes del sistema o purgar nodejs) deben establecerse `ENSURE_TOOLS_ALLOW_SUDO=1`.
- Integra ejecución de `integridad-idioma` y, si `ENSURE_TOOLS_AUTO_CREATE_ADR=1`, creará ADRs automáticas usando `scripts/cli/gestionar-adr.ts` cuando se detecten términos en inglés.

Uso recomendado (local):

$ cd /ruta/al/proyecto
$ make ensure-tools

Para una ejecución más controlada:

$ ENSURE_TOOLS_AUTO_INSTALL=false npm run ensure-tools:bun

Variables de entorno relevantes:
- ENSURE_TOOLS_AUTO_INSTALL (1/0)
- ENSURE_TOOLS_ALLOW_SUDO (1/0)
- ENSURE_TOOLS_AGGRESSIVE (1/0)
- ENSURE_TOOLS_AUTO_CREATE_ADR (1/0)

## Validación semántica (CLI)

Se dispone de un CLI para validar propuestas semánticas localmente usando el stub LLM:

$ ./scripts/ci/validar-semantica.ts <termino> [sugerencia]

Ejemplo:

$ ./scripts/ci/validar-semantica.ts migraciones migraciones

La salida es JSON con la estructura `ResultadoSemantico` (score, razon, explicacion, candidatos, ejemplos).
