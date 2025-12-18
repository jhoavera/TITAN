---
# Plantilla PR: Migración Node → Bun

## Resumen
Breve descripción de los cambios: migración de scripts que usan Node/ts-node/npx a Bun.

## Checklist obligatorio (marcar antes de solicitar revisión)
- [ ] Se generó reporte de migración (scripts/ci/generar-reporte-migracion.ts).
- [ ] Todas las propuestas de traducción/terminología (glosario/ADRs) están listadas abajo.
- [ ] Se creó ADR si hay cambios de nomenclatura que impacten API/DB/infra.
- [ ] Tests unitarios y de integración relevantes pasan localmente.
- [ ] Se ha documentado cualquier cambio de comportamiento.

## Cambios propuestos
{{lista_cambios}}

## Propuestas ADR / Glosario generadas automáticamente
{{lista_adrs}}

## Notas de despliegue / rollback
- Branch: {{branch}}
- Tags/References: {{git_refs}}

---
*Plantilla generada automáticamente por `scripts/ci/convertir-scripts-a-bun`.*
