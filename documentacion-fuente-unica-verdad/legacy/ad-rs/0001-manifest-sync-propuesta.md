# ADR 0001 — Sincronizar manifiesto con el Documento Maestro SSOT

Fecha: 2025-12-13
Estado: Aprobada
Autor: Scripts (automático) / Equipo TITAN
AprobadoPor: jhoavera
AprobadoAt: '2025-12-14T02:15:00Z'

## Contexto
Actualmente existe un manifiesto en `config/structure_manifest_fixed_proposed.yml` generado automáticamente. Tras revisar los archivos `documento-maestro-parte-4.md` y `documento-maestro-ssot.md`, se detectaron discrepancias entre las rutas y tipos definidos en el manifiesto y las rutas exactas descritas en la documentación maestro (SSOT). El objetivo es garantizar que el manifiesto refleje exactamente la estructura descrita en el MD sin pérdida de información.

## Decisión
Reemplazar o generar un manifiesto exacto a partir del SSOT (MD) en `config/structure_manifest_exact_from_md.yml` que contenga 1:1 las rutas y tipos (dir/file) que aparecen en el MD, preservando `owner: unassigned` y otras metadatas con valor por defecto. No modificar los archivos MD.

## Razonamiento
- Asegura reproducibilidad 1:1 del árbol descrito en la documentación (SSOT) con la infraestructura de scaffolding.
- Facilita auditabilidad y trazabilidad: cualquier cambio en la estructura documental debe reflejarse por la política del ADR y validaciones previas.
- Evita la pérdida de información ni la normalización arbitraria sin validación humana y aprobación de dueños de área.

## Implicaciones
- Cambios localmente aplicables una vez aprobado: creación de `config/structure_manifest_exact_from_md.yml` y pruebas en dry-run con `--manifest` y `--dry-run`.
- No se ejecutará `--apply` sin aprobación explícita y `SUDO_ALLOWED` si fuera necesario.
- Se añadirá un CSV de control `reports/manifest_owner_template.csv` con `path,owner,template,required` para revisión de dueños.
- Se añadirá test que compara MD vs manifest en CI local.

## Plantilla de revisión y aprobación
- Dueño (owner): [Asignar responsable de la área relacionada] 
- Revisión de unidad: [Sí/No]
- Comentarios: [campo libre]
- Aprobación: [Sí/No] — Firma digital/usuario

## Estado actual de la propuesta
- Manifiesto desde MD generado: `config/structure_manifest_from_md_proposed.yml` (1,048 entradas) — pendiente revisión y ajuste si es necesario.
- Dos archivos MD originaron la lista: `documento-maestro-parte-4.md` y `documento-maestro-ssot.md`.

---

Acciones siguientes recomendadas después de aprobar la ADR:
- Validar que el manifiesto exacto incluya todas las rutas y tipos del MD (conteo y diff por path).
- Ejecutar `verificar-estructura-completa.sh --manifest config/structure_manifest_exact_from_md.yml --dry-run --verbose`.
- Generar CSV y asignar owners; crear PR/ADR con aprobaciones para promover `config/structure_manifest.yml`.
