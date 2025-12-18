# Guía de uso: Servicios y CLIs - API TITÁN

Este documento muestra ejemplos de uso (programático y CLI) para los servicios más relevantes.

## Ejemplos programáticos (Node/Bun, TypeScript)

1) Validación semántica (stub LLM)

```ts
import { validarSemantica } from '../src/servicios/servicio-validacion-semantica';

async function ejemplo() {
  const r = await validarSemantica('migrations', 'migraciones');
  console.log(r.score, r.valido, r.explicacion);
}
```

2) Validar propuesta y generar reporte de propuestas

```ts
import { revisarYProponerAprobaciones } from '../src/servicios/servicio-aprobacion-adrs';

async function ejemplo() {
  const res = await revisarYProponerAprobaciones();
  console.log(JSON.stringify(res, null, 2));
}
```

3) Uso del servicio de glosario (modo local con `tmp-glosario.json`)

```ts
import ServicioGlosario from '../src/servicios/glosario';

async function ejemploGlosario() {
  const svc = new ServicioGlosario();
  await svc.crear({ termino: 'migraciones', definicion: 'Traducción sugerida', autor: 'script' });
  console.log(await svc.listar());
}
```

---

## Ejemplos CLI (desde la raíz `api/`)

- Validar semántica:

  $ ./scripts/ci/validar-semantica.ts migrations migraciones

  Salida: JSON con fields `score`, `valido`, `explicacion`, `candidatos`.

- Escaneo de idioma (dry-run):

  $ ./scripts/revisar-idioma.ts

  Para aplicar propuestas en modo `--apply` (crea entradas pendientes en `tmp-glosario.json`):

  $ ./scripts/revisar-idioma.ts --apply

- Orquestar deduplicación + propuestas:

  Ejecutar las tareas en orden: `deduplicar-propuestas.ts` → `revisarYProponerAprobaciones()` → revisar `reports/propuestas-aprobacion-posible.json` manualmente.

---

## Notas para agentes y CI local
- Todos los CLIs deben ejecutarse localmente (prohibido uso cloud).
- Para integrar un LLM real, exponer variable de entorno y adaptar `servicio-validacion-semantica.ts`.
- Mantener trazabilidad: todos los cambios sugeridos deben aparecer en `reports/` y/o `tmp-glosario.json` antes de generar ADRs.

---

Si querés, puedo añadir `--help` a las CLIs y tests que verifiquen las salidas de los comandos en el siguiente paso.
