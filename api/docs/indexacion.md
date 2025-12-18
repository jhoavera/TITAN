# Indexación automática y alias (MCP)

Resumen: el proyecto incluye un generador de índices `api/src/nucleo/indexacion/generador-indices-mcp.ts` y un script CLI `api/scripts/indexar-aliases.ts` que recorre `src/` y genera `indice.ts` en subcarpetas con archivos TypeScript.

Comandos:
- `bun run index:generar` — generar índices automáticamente (dry-run si se desea revisar primero)
- `bun ./api/scripts/indexar-aliases.ts` — ejecuta el proceso y propone refactors de imports relativos

Buenas prácticas:
- Evitar importaciones relativas como `../../../archivo` y preferir alias en `bunfig.toml`.
- Regenerar índices después de mover/renombrar módulos.

Integración con MCP: el generador puede ser integrado con el MCP Server para recarga caliente y mapeo de alias.
