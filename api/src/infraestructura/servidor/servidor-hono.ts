#!/usr/bin/env bun
import { Hono } from 'hono';
import { adaptarHandlerHono } from '@infraestructura/servidor/adaptadores/hono-handler';
import { middlewareAutenticacionJWTHono } from '@nucleo/middleware/hono/middleware-autenticacion-jwt.ts';
import { middlewareRateLimitInquilino } from '@nucleo/middleware/hono/middleware-rate-limit-inquilino.ts';
import { generateOpenApiYAML } from '@infraestructura/documentacion/generador-openapi';

// Importar controladores existentes y envolverlos en adaptador
import * as glosarioCtl from '@infraestructura/servidor/controladores/glosario-controlador';
import * as adrsCtl from '@infraestructura/servidor/controladores/adrs-controlador';
import * as opsCtl from '@infraestructura/servidor/controladores/ops-controlador';
import * as auditoriaCtl from '@infraestructura/servidor/controladores/auditoria-controlador';

const app = new Hono();

// Middlewares globales Hono
app.use('*', middlewareAutenticacionJWTHono());
// Aplicar limitación de tasa por inquilino a rutas API
app.use('/api/*', middlewareRateLimitInquilino());

// Rutas Glosario
app.post('/api/v1/glosario', adaptarHandlerHono(glosarioCtl.crear));
app.get('/api/v1/glosario', adaptarHandlerHono(glosarioCtl.listar));
app.get('/api/v1/glosario/:id', adaptarHandlerHono(glosarioCtl.obtenerPorId));
app.patch('/api/v1/glosario/:id', adaptarHandlerHono(glosarioCtl.actualizar));
app.delete('/api/v1/glosario/:id', adaptarHandlerHono(glosarioCtl.eliminar));

// Rutas ADRs
app.post('/api/v1/adrs', adaptarHandlerHono(adrsCtl.crear));
app.get('/api/v1/adrs', adaptarHandlerHono(adrsCtl.listar));
app.get('/api/v1/adrs/:id', adaptarHandlerHono(adrsCtl.obtenerPorId));
app.patch('/api/v1/adrs/:id', adaptarHandlerHono(adrsCtl.actualizar));
app.delete('/api/v1/adrs/:id', adaptarHandlerHono(adrsCtl.eliminar));

// Rutas Ops y Auditoria
app.post('/api/v1/ops/renombrar-por-adr', adaptarHandlerHono(opsCtl.renombrarPorADR as any));
app.get('/api/v1/auditoria/prevalidacion', adaptarHandlerHono(auditoriaCtl.listarPreValidacion));
app.get('/metrics', adaptarHandlerHono(auditoriaCtl.metrics));

// Health
app.get('/.well-known/health', (c) => c.text('ok'));

// Documentación OpenAPI mínima generada localmente desde especificaciones internas
app.get('/api/docs/openapi.yaml', async (c) => {
  const yaml = generateOpenApiYAML();
  return c.text(yaml, 200, { 'content-type': 'text/vnd.yaml' });
});

// UI mínima para documentación (redoc)
app.get('/api/docs', async (c) => {
  const redoc = `<!doctype html><html><head><meta charset="utf-8"><title>Docs</title></head><body><redoc spec-url='/api/docs/openapi.yaml'></redoc><script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script></body></html>`
  return c.html(redoc)
})

const PORT = Number(process.env.PORT || 3000);

async function start() {
  // Hono en Bun usa app.fire si se usa el std:server
  // En Bun, es suficiente con app.fire() pero para compatibilidad sencilla:
  // eslint-disable-next-line no-console
  console.log(`Iniciando servidor Hono en puerto ${PORT}`);
  // Pasar el puerto vía variable de entorno para que app.fire() (sin args) lo utilice
  process.env.PORT = String(PORT);
  await app.fire();
}

if (import.meta.main) {
  start().catch((err) => {
    // eslint-disable-next-line no-console
    console.error('Error iniciando servidor Hono:', err);
    process.exit(1);
  });
}

export default app;
