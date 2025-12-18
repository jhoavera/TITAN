SHELL := /bin/sh

.PHONY: all setup install ci-verify run-local-ci act-help ensure-tools ensure-tools-skip

all: ci-verify

# Preferir Bun cuando esté disponible
setup:
	@echo "Preparando entorno (prefiere Bun si está instalado)..."
	@echo "Verificando herramientas requeridas antes del setup (auto-install activado, reintentos SUDO permitidos)..."
	@ENSURE_TOOLS_AUTO_INSTALL=1 ENSURE_TOOLS_ALLOW_SUDO=1 $(MAKE) ensure-tools || (echo "ERROR: Falló la verificación/instalación automática de herramientas. Ejecuta 'make ensure-tools' con privilegios o revisa los mensajes." && exit 1)
	@if command -v bun >/dev/null 2>&1; then \
		echo "Bun detectado, ejecutando 'bun install'..."; \
		bun install; \
	else \
		echo "Bun no detectado, ejecutando 'bun install' (fallback)..."; \
		bun install; \
	fi
	@echo "Instalando hooks locales..."
	bun run instal-hooks || true
	bun run husky:install || true

install: setup

ci-verify:
	@echo "Ejecutando verificación local ligera (ci:verify)..."
	@ENSURE_TOOLS_AUTO_INSTALL=0 npm run ensure-tools || (echo "ERROR: Falta alguna herramienta" && exit 1)
	@echo "Generando reporte de migración Node→Bun (modo check-only)..."
	@bun run migrar-node-a-bun:report || true
	@./scripts/ci/run-local-ci.sh

run-local-ci: ci-verify

act-help:
	@echo "Para ejecutar localmente el workflow con 'act' (si lo tienes instalado):"
	@echo "  act -j ci-local"

ensure-tools:
	@echo "Verificando e intentando instalar herramientas necesarias (act, bun)..."
	@ENSURE_TOOLS_AUTO_INSTALL=1 npm run ensure-tools; RET=$$?; if [ $$RET -eq 0 ]; then \
		echo "✅ Resumen: Verificación completada correctamente. Todas las herramientas están disponibles o fueron instaladas."; \
	else \
		echo "⚠️ Resumen: Falló la verificación. Revisa los mensajes anteriores para ver qué herramientas faltan o no pudieron instalarse."; exit $$RET; \
	fi

ensure-tools-skip:
	@echo "Verificación de herramientas (sin intento de instalación automática)..."
	@ENSURE_TOOLS_AUTO_INSTALL=0 npm run ensure-tools || (echo "ERROR: Falta alguna herramienta" && exit 1)

act-ci:
	@echo "Ejecutando workflow 'ci-local' con act (soporta act, bunx)..."
	@npm run ci:check-act || (echo "ERROR: Precondición fallida: 'act' ni 'bunx' detectados." && exit 1)
	@if command -v act >/dev/null 2>&1; then \
		act -j ci-local; \
	elif command -v bun >/dev/null 2>&1 && command -v bunx >/dev/null 2>&1; then \
		bunx act -j ci-local; \
	else \
		echo "ERROR: 'act' no está instalado y 'bunx' no está disponible."; \
		echo "Instala 'act' (https://github.com/nektos/act) o 'bun' con 'bunx'."; exit 1; \
	fi

act-ci-skip:
	@echo "Ejecutando workflow 'ci-local' con act (skipping pre-check)..."
	@if command -v act >/dev/null 2>&1; then \
		act -j ci-local; \
	elif command -v bun >/dev/null 2>&1 && command -v bunx >/dev/null 2>&1; then \
		bunx act -j ci-local; \
	else \
		echo "ERROR: 'act' no está instalado y 'bunx' no está disponible."; \
		echo "Instala 'act' (https://github.com/nektos/act) o 'bun' con 'bunx'."; exit 1; \
	fi

setup-full:
	@echo "Setup completo: instalar dependencias y ejecutar pruebas mínimas..."
	@$(MAKE) setup
	@echo "Ejecutando pruebas mínimas..."
	@bun run pruebas || (echo "Algunas pruebas fallaron en setup:full" && exit 1)

estado-servicios:
	@echo "Comprobando estado del stack moderno..."
	@bun run estado-servicios || true

migrar-node-a-bun:
	@echo "Generando reporte de migración Node → Bun (dry-run)..."
	@bun run migrar-node-a-bun:report || (echo "ERROR: Falló la generación del reporte" && exit 1)

migrar-node-a-bun-apply:
	@echo "Aplicando migración Node → Bun (modo SOLO si ADR aprobado y con --apply)..."
	@bun run migrar-node-a-bun:apply || (echo "ERROR: Falló la aplicación de la migración" && exit 1)
