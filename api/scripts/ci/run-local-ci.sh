#!/usr/bin/env sh
# Ejecuta las comprobaciones locales que replican el job de CI ligero del repo.
# Saldrá con código distinto de 0 si alguna verificación falla.
set -e
printf "Iniciando verificación local (ci:verify)...\n"

# Preferir Bun si está disponible (ejecuta script Bun si existe)
if command -v bun >/dev/null 2>&1; then
  printf "Bun detectado: ejecutando verificación con Bun...\n"
  bun run check-stack:bun || exit 1
  printf "Check-stack (Bun) OK.\n"
else
  printf "Bun no detectado: ejecutando verificación con Node (ts-node)...\n"
  npm run check-stack || exit 1
  printf "Check-stack (Node) OK.\n"
fi

# Verificar si existe 'act' o 'bunx' — precondición opcional para workflows locales
printf "Verificando precondición: 'act' o 'bunx'...\n"
npm run ci:check-act || (printf "Precondición fallida: 'act' ni 'bunx' detectados.\n" && exit 1)

# Puedes descomentar la siguiente línea si quieres ejecutar la suite de pruebas localmente
# npm run pruebas

printf "Verificación local completada con éxito.\n"
