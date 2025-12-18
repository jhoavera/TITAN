# Makefile para tareas de entorno (TITAN)

.PHONY: ensure-tools ensure-tools-local help

help:
	@echo "Objetivos disponibles:"
	@echo "  ensure-tools        - Ejecuta verificación/instalación de Bun, gh y otros (usa api/scripts/ci/ensure-tools.ts)"
	@echo "  ensure-tools-local  - Ejecuta ensure-tools dentro de la carpeta api (usa npm run ensure-tools:bun)"
	@echo "  ci-local            - Ejecuta el pipeline CI local en /api (levanta DB, migra, corre tests, indexa y revisa idioma)"

ensure-tools: ensure-tools-local

ensure-tools-local:
	@echo "Ejecutando ensure-tools en /api..."
	@cd api && npm run ensure-tools:bun || (echo "ensure-tools falló; revisa salida" && exit 1)
	@echo "Hecho. Revisa el resumen anterior para ver estado de herramientas."

ci-local:
	@echo "Ejecutando pipeline CI local en /api..."
	@cd api && bun run ci:local:drizzle || (echo "ci:local:drizzle falló; revisa salida" && exit 1)
	@echo "Pipeline local ejecutado correctamente. Revisa los reports en /api/reports o tmp-*.json"