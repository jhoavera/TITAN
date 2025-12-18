# Especificación API: CRUD Glosario y CRUD ADRs (TITÁN)

Versión: 0.1
Fecha: 2025-12-15
Autor: agente-automático (acciones realizadas con autorización del desarrollador)

---

## Objetivo

Definir la **API**, los **esquemas de validación (Zod)**, contratos de respuesta, reglas de negocio (estados y transición), requisitos de seguridad (JWT y contexto de inquilino), políticas de base de datos (RLS) y la estrategia de pruebas para los CRUDs de **Glosario** y **ADRs**.

Todo en **español técnico empresarial** y compatible con las herramientas y plantillas del repositorio (`documentacion-fuente-unica-verdad/ad-rs/PLANTILLA-ADR.md`).

---

## Principios clave
- Ningún cambio estructural sin ADR aprobado (norma del proyecto).  
- Validación estricta con Zod (TypeScript strict mode).  
- Aislamiento por inquilino: RLS en BD y middleware que inyecta `identificadorInquilino`.  
- Trazabilidad: al aprobar, registrar `git_ref` opcional.  
- Tests obligatorios: unitarios, integración y E2E para cada flujo crítico.

---

## Rutas principales (Resumen)

Glosario
- POST /api/v1/glosario — Crear término (201)
- GET /api/v1/glosario — Listar términos (200)
- GET /api/v1/glosario/:id — Obtener por id (200 / 404)
- PATCH /api/v1/glosario/:id — Actualizar (200)
- DELETE /api/v1/glosario/:id — Eliminar (204)

ADRs
- POST /api/v1/adrs — Crear ADR (201)
- GET /api/v1/adrs — Listar ADRs (200)
- GET /api/v1/adrs/:id — Obtener ADR por id (200 / 404)
- PATCH /api/v1/adrs/:id — Actualizar (200)
- DELETE /api/v1/adrs/:id — Eliminar (204)

Notas: Todas las rutas esperan que `middleware-contexto-inquilino` establezca `(request as any).identificadorInquilino` y `middleware-autenticacion-jwt` establezca `(request as any).usuario` con `id` y permisos.

---

## Esquemas de validación (Resumen Zod)

- Glosario: `esquemaCrearGlosario`, `esquemaActualizarGlosario`, `esquemaAprobarGlosario` (ya implementados en `src/nucleo/validadores/validador-glosario.ts`).
- ADRs: `esquemaCrearADR`, `esquemaActualizarADR`, `esquemaAprobarADR` (ya implementados en `src/nucleo/validadores/validador-adrs.ts`).

Incluir en la especificación completa: ejemplos de petición/respuesta JSON y mensajes de error estándar:

- 400 Bad Request: errores de validación Zod (campo + mensaje).
- 401 Unauthorized: token faltante o inválido.
- 403 Forbidden: permiso insuficiente para la operación (ej. aprobar sin rol).
- 404 Not Found: recurso no encontrado.
- 500 Internal Server Error: errores imprevistos (con correlación de request-id en headers).

---

## Estado y transiciones (normas de negocio)

Glosario: PENDIENTE → EN_REVISION → APROBADO / RECHAZADO.  
ADRs: BORRADOR → PENDIENTE → EN_REVISION → APROBADO / RECHAZADO.

Reglas:
- Solo usuarios con rol `REVIEWER`/`ADMIN` pueden mover a EN_REVISION/APROBADO/RECHAZADO.  
- Al aprobar se puede incluir `git_ref` en la petición de actualización para registrar la referencia de versión asociada.

---

## Persistencia y RLS (Notas)

- Tablas: `glosario_terminos`, `adrs`, `auditoria_cambios`.  
- RLS: políticas que filtran por `identificador_inquilino`. Antes de cualquier operación la conexión debe ejecutar `SET app.identificador_inquilino_actual = '<uuid>'` (documentar en bootstrap DB).  
- Auditoría: insertar en `auditoria_cambios` los eventos `CREAR`, `ACTUALIZAR`, `ELIMINAR`, con `usuario_id`, `git_ref` (si aplica), `ip`, `metadatos`. Se recomienda registrar auditoría a nivel de base de datos mediante triggers (`migraciones/0002_triggers_auditoria.sql`); los repositorios también intentan registrar auditoría explícita para entornos sin triggers. Para evitar duplicados, los repositorios detectan la presencia de triggers mediante `hayTriggersAuditoria(db)` y omiten inserciones explícitas cuando la BD ya registra la auditoría.

---

## Seguridad y permisos

- JWT obligatorio. Middleware `middleware-autenticacion-jwt` valida token y añade `usuario` al request.  
- Roles mínimos: `LECTOR`, `EDITOR`, `REVIEWER`, `ADMIN`.  
- Endpoints de aprobación requieren `REVIEWER` o `ADMIN`.

---

## Contratos y ejemplos (breve)

Ejemplo crear ADR (POST /api/v1/adrs) payload:
```
{
  "numero": 123,
  "titulo": "Elegir ORM",
  "objetivo": "Seleccionar ORM type-safe",
  "decision": "Se elige Drizzle",
  "tags": ["bd","drizzle"]
}
```

Ejemplo aprobar (PATCH /api/v1/adrs/:id):
```
{
  "estado": "APROBADO",
  "notas_revision": "Aprobado por comité",
  "git_ref": "refs/heads/main@{2025-12-15}"
}
```

Respuesta (200) devolverá la entidad actualizada incluyendo `id`, `estado`, `git_ref` si fue provisto.

---

## Pruebas requeridas (mínimo)

1. Unitarias (Vitest `.prueba.ts`): validadores Zod, utilitarios, repositorios mock.
2. Integración: endpoints con DB en memoria o mocks Drizzle; test de políticas RLS (simular diferentes `identificadorInquilino`).
3. E2E (Playwright o Fastify inject + Vitest): flujo crítico para ADRs (crear → enviar a revisión → aprobar con `git_ref`); flujo para Glosario (crear → aprobar).  

### Casos E2E concretos (recomendados)

- E2E - ADRs: flujo completo
  1. Crear ADR (POST /api/v1/adrs) con token `Bearer token-usuario-prueba` y header `x-identificador-inquilino: TNT-TEST-0001` → debe devolver 201 y `id` (ej. `stub-1`).
  2. Actualizar ADR a `EN_REVISION` (PATCH /api/v1/adrs/:id) por usuario revisor → devuelve 200 y `estado = EN_REVISION`.
  3. Aprobar ADR (PATCH /api/v1/adrs/:id) incluyendo `git_ref` en payload → devuelve 200 y `git_ref` reflejado; además, debe existir un registro en `auditoria_cambios` (cuando no hay triggers DB) con `operacion: 'ACTUALIZAR'` y `git_ref`.

- E2E - Glosario: flujo de propuesta y aprobación
  1. Crear término con nombre que contiene indicios de inglés (ej. `create-service-template`) → devuelve 201; el servicio `validarYRegistrarNombre` debe haber creado una propuesta en `documentacion-fuente-unica-verdad/glosario-biblioteca/propuestas`.
  2. Aprobar término vía PATCH que actualice `estado` a `APROBADO` → 200 y estado persistido.

Notas: Los tests E2E deberán inicializar un `StubDB` compartido mediante `inicializarDb()` para asegurar que las operaciones usan la misma instancia en memoria y permitan inspeccionar auditoría creada. Usar `crearApp()` y `app.inject()` para simular peticiones HTTP.

Casos de prueba automatizados a añadir cada vez que se modifique el flujo.

---

## Automatización con agentes y herramientas del repo

- Usar plantilla ADR (`documentacion-fuente-unica-verdad/ad-rs/PLANTILLA-ADR.md`) para documentar cambios.  
- Script/agent: `scripts/automatizar-commit-git-ref.sh` (propuesta) para que aprobadores locales puedan generar `git_ref` y registrar en la aprobación (manual, no automatizado en CI).
- Integración: la API sólo registra `git_ref` (no realiza commits por sí misma) para respetar política NO-NUBE y control humano.

---

## Tareas inmediatas (siguientes pasos)

1. Celebrar revisión del archivo de especificación y comentar cambios.  
2. Implementar repositorios Drizzle con esquemas y migraciones faltantes (marcar RLS + auditoría).  
3. Implementar pruebas unitarias/integration para repositorios y controladores.  
4. Añadir badge/report de cobertura local en `api/README.md`.

---

Archivo de referencia: `api/src/nucleo/validadores/validador-glosario.ts` y `validador-adrs.ts` (usar como fuente canónica de los esquemas iniciales).  

Fin de la especificación (resumen inicial). Para detalles de cada endpoint puedo expandir con OpenAPI / ejemplos completos y generar el archivo `api/doc/specs/crud-glosario-adrs.openapi.yaml` si lo autorizas.
