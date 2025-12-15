/* Bootstrap del servidor: inicializa DB, crea la app y arranca en modo local para pruebas.
 * Uso: llamar a `bootstrap()` desde script de desarrollo.
 */
import { crearApp } from './app';
import { inicializarBaseDeDatos } from '../base-de-datos/bootstrap-db';

export const bootstrap = async (cfg: { puerto?: number; dbUrl: string }) => {
  const pool = await inicializarBaseDeDatos({ url: cfg.dbUrl });
  const app = crearApp();

  const puerto = cfg.puerto ?? 3000;
  await app.listen({ port: puerto as number, host: '127.0.0.1' });
  app.log.info(`Servidor escuchando en http://127.0.0.1:${puerto}`);
  return { app, pool };
};
