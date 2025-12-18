# CLI `crear-adr`

Descripción

Crea un ADR (Architectural Decision Record) en `documentacion-fuente-unica-verdad/ad-rs` y, opcionalmente, hace commit en Git.

Flags útiles:
- `--no-commit`: crea el archivo ADR pero no realiza commit.
- `--force`: fuerza la creación incluso si se detectan indicios de inglés en el título, objetivo o decisión.

Política de idioma

El sistema valida que el título, objetivo y la decisión estén en **español técnico empresarial**. Si detecta términos en inglés, se rechazará la creación y se generará una propuesta en `glosario-biblioteca/propuestas`. Para forzar (riesgoso) use `--force`.

Ejemplos

$ bun ./scripts/crear-adr.ts --titulo="Propuesta cambio nombres" --autor="autor" --objetivo="Normalizar nombres" --decision="Usar español técnico"

$ bun ./scripts/crear-adr.ts --no-commit --titulo="Prueba" --autor="autor" --objetivo="..." --decision="..." --force  # fuerza creación

Notas
- Use `bun ./scripts/revisar-idioma.ts --dry-run` para generar automáticamente propuestas si necesita traducir términos antes de aprobar ADRs.
