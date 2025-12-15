/* Cliente de base de datos (placeholder).
 * Implementación mínima y segura: proporciona `obtenerDb()` que lanzará si no se ha inicializado.
 * Se recomienda inicializar Drizzle en el bootstrap de la aplicación.
 */
import type { Pool } from 'pg';

let _db: unknown = null;

export type DB = unknown;

export const inicializarDb = (cliente: DB) => {
  _db = cliente;
};

export const obtenerDb = (): DB => {
  if (!_db) throw new Error('Cliente de base de datos no inicializado. Llamar a inicializarDb() en el bootstrap.');
  return _db as DB;
};
