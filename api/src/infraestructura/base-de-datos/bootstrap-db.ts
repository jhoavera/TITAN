/* Inicialización de la base de datos (Drizzle + PostgreSQL)
 * - Archivo en español técnico empresarial
 * - Funciones: inicializarBaseDeDatos(cfg), retorna cliente Drizzle (placeholder)
 * - En desarrollo, asegúrese de instalar y configurar Drizzle y pg.
 */
import { Pool } from 'pg';
// import { drizzle } from 'drizzle-orm/node-postgres'; // descomentar cuando esté instalada la dependencia
import { inicializarDb } from '@infraestructura/base-de-datos/cliente';

export type ConfiguracionBD = {
  url: string;
};

export const inicializarBaseDeDatos = async (cfg: ConfiguracionBD) => {
  const pool = new Pool({ connectionString: cfg.url });

  // Ejemplo de inicialización con Drizzle (comentar si la dependencia no está instalada)
  // const db = drizzle(pool);
  // inicializarDb(db);

  // Placeholder: guardamos el pool para uso básico
  inicializarDb(pool as any);

  // Probar conexión
  await pool.query('SELECT 1');

  return pool;
};
