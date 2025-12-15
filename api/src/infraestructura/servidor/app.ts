/* Aplicación Fastify mínima para registro de rutas del CRUD (glosario, adrs).
 * Este archivo exporta un plugin que puede ser usado por el bootstrap del servidor.
 */
import fastify from 'fastify';
import rutas from './rutas';
import middlewareAutenticacion from '../../../nucleo/middleware/middleware-autenticacion-jwt';
import middlewareContextoInquilino from '../../../nucleo/middleware/middleware-contexto-inquilino';

export const crearApp = () => {
  const app = fastify({ logger: true });
  // Registrar middlewares globales (autenticación y contexto inquilino)
  app.register(middlewareAutenticacion);
  app.register(middlewareContextoInquilino);
  app.register(rutas);
  return app;
};

// Nota: no arrancamos servidor aquí; el bootstrap local debe llamar a `crearApp()` y a `inicializarBaseDeDatos()`.
