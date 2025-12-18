## Auditoría de stack (2025-12-16)

Resumen: comparar `package.json` y `scripts/instalar-stack.ts` versus la lista objetivo en `documentacion-fuente-unica-verdad/documento-maestro-parte-1.2.md`.

Tecnologías objetivo (selección representativa del documento):
- Bun (runtime) ✅ (scripts ya usan Bun)
- MCP Server (arquitectura) ⚠️ (no como dependencia JS explícita)
- Hono ✅
- Bun.fetch ✅ (built-in)
- Drizzle ✅
- Zod ✅
- Qdrant ⚠️ (docker service referenced in `instalar-stack.ts`) 
- DragonflyDB / KeyDB ❌ (no referencia en repo, plan: añadir servicio)
- llama/llamafile + vLLM ❌ (no servicio de inference definido; plan: añadir placeholder `inference` con imagen o instrucción)
- Traefik ❌ (no servicio en `instalar-stack.ts`; plan: añadir)
- Pino + Vector ✅ / ⚠️ (pino presente; vector logs no configurado)
- VictoriaMetrics ❌ (no servicio configurado; plan: añadir)
- Grafana ✅ (present in installer)
- Loki ❌ (no servicio; plan: añadir)
- NATS JetStream ❌ (no servicio; plan: añadir)
- MinIO ❌ (no servicio; plan: añadir)
- Flyway / migraciones ❌ (scripts de migración existen para tests; plan: integrar Flyway docker or CLI)
- Playwright (E2E) ❌ (no dep; plan: agregar como devDependency si se requiere)

Conclusión breve: el repositorio ya contiene las herramientas necesarias para gestión e instalación (script `instalar-stack.ts`) y varios servicios básicos (postgres, redis, qdrant, prometheus, grafana). Falta añadir servicios y configuraciones para Dragonfly, Traefik, VictoriaMetrics, Loki, NATS, MinIO, y un servicio de inference (llamafile/vLLM). Próximo paso: actualizar `scripts/instalar-stack.ts` para incluir nuevos servicios y crear archivos de configuración asociados (`traefik.yml`, `victoria-metrics-config`, `loki-config`, etc.) en modo dry-run y generar PR-draft listo para revisión local. 

Autores: GitHub Copilot (ejecuciones locales hechas con autorización del propietario). 
