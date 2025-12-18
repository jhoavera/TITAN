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

// Stub de BD en memoria para entornos de desarrollo y pruebas locales cuando no se inicializa un cliente real.
class StubDB {
  store: Record<string, any> = {};
  lastId = 0;

  insert(table: any) {
    const self = this;
    return {
      values(obj: any) {
        return {
          returning() {
            // Simulate DB unique constraint for glosario_terminos: identificador_inquilino + LOWER(termino)
            if (obj && typeof obj.termino === 'string' && obj.identificador_inquilino) {
              const exists = Object.values(self.store).some((r: any) => r.identificador_inquilino === obj.identificador_inquilino && String(r.termino).toLowerCase() === String(obj.termino).toLowerCase())
              if (exists) {
                // Simulate DB unique violation error
                throw new Error('unique_violation: duplicate key value violates unique constraint "uk_glosario_inquilino_termino"')
              }
            }

            const id = `stub-${++self.lastId}`;
            const row = { id, ...obj };
            self.store[id] = row;
            // Return a promise that resolves to the rows and also provide an execute() for compatibility
            const promise: any = (async () => [row])();
            promise.execute = async () => [row];
            return promise;
          },
          async execute() {
            // Same unique constraint logic for execute
            if (obj && typeof obj.termino === 'string' && obj.identificador_inquilino) {
              const exists = Object.values(self.store).some((r: any) => r.identificador_inquilino === obj.identificador_inquilino && String(r.termino).toLowerCase() === String(obj.termino).toLowerCase())
              if (exists) {
                throw new Error('unique_violation: duplicate key value violates unique constraint "uk_glosario_inquilino_termino"')
              }
            }
            const id = `stub-${++self.lastId}`;
            const row = { id, ...obj };
            self.store[id] = row;
            return [row];
          }
        };
      }
    };
  }

  select() {
    const self = this;
    return {
      from(_table: any) {
        return {
          where(_cond: any) {
            return {
              limit() { return { execute: async () => Object.values(self.store).filter((r: any) => {
                if (!_cond) return true
                return Object.keys(_cond).every((k) => (r as any)[k] === _cond[k])
              }) }; },
              execute: async () => Object.values(self.store).filter((r: any) => {
                if (!_cond) return true
                return Object.keys(_cond).every((k) => (r as any)[k] === _cond[k])
              }),
            };
          }
        };
      }
    };
  }

  update(_table: any) {
    const self = this;
    return {
      set(_obj: any) {
        return {
          where(_cond: any) {
            return {
              returning() {
                const promise: any = (async () => {
                  const id = _cond?.id
                  if (id && self.store[id]) {
                    const actualizado = { ...self.store[id], ..._obj }
                    self.store[id] = actualizado
                    return [actualizado]
                  }
                  return []
                })();
                promise.execute = async () => [];
                return promise;
              },
            };
          },
        };
      },
    };
  }

  delete(_table: any) {
    const self = this;
    return {
      where(_cond: any) {
        return {
          returning() {
            const promise: any = (async () => {
              // Simulate delete: if id provided, remove from store and return deleted id
              const id = _cond?.id
              if (id && self.store[id]) {
                const prev = self.store[id]
                delete self.store[id]
                return [{ id: prev.id }]
              }
              // Otherwise try naive match by fields (not exhaustive)
              const keys = Object.keys(_cond || {})
              if (keys.length) {
                const deleted: any[] = []
                for (const k of Object.keys(self.store)) {
                  const row = self.store[k]
                  let match = true
                  for (const f of keys) {
                    if (row[f] !== _cond[f]) { match = false; break }
                  }
                  if (match) {
                    deleted.push({ id: row.id })
                    delete self.store[k]
                  }
                }
                return deleted
              }
              return []
            })();
            promise.execute = async () => [];
            return promise;
          },
        };
      },
    };
  }
}

export const obtenerDb = (): DB => {
  if (!_db) {
    // Retornar stub local en vez de lanzar, facilita E2E locales y entornos de pruebas sin inicializar
    // Mantener instancia única para que los datos persistan durante la ejecución del proceso de pruebas
    _db = new StubDB();
    return _db as any;
  }
  return _db as DB;
};
