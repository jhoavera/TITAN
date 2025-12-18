/* Bootstrap del servidor con Hono: inicializa DB y expone instancia Hono para servir con Bun. */
import app from '@infraestructura/servidor/servidor-hono';
import { inicializarBaseDeDatos } from '@infraestructura/base-de-datos/bootstrap-db';

export const bootstrap = async (cfg: { puerto?: number; dbUrl: string }) => {
  const pool = await inicializarBaseDeDatos({ url: cfg.dbUrl });
  const puerto = cfg.puerto ?? 3000;

  // Arranque opcional con Bun.serve; si no está disponible (tests), solo devolvemos la app.
  let server: any = null;
  if (typeof Bun !== 'undefined' && typeof Bun.serve === 'function') {
    server = Bun.serve({ port: puerto, fetch: app.fetch });
    // eslint-disable-next-line no-console
    console.log(`Servidor Hono escuchando en http://127.0.0.1:${puerto}`);
  }

  return { app, pool, server };
};
