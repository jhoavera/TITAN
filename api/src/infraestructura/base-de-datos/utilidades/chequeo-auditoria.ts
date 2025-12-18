/*
 * Utilidad para detectar si la base de datos tiene implementados los triggers/funciones
 * de auditoría (ej. `fn_registrar_auditoria` y triggers `tg_auditar_*`).
 * Devuelve un booleano; resultado cacheado en proceso para evitar consultas repetidas.
 */
import type { DB } from '@infraestructura/base-de-datos/cliente';

let _cacheResultado: boolean | null = null;

export const limpiarCacheChequeoAuditoria = () => { _cacheResultado = null; };

export const hayTriggersAuditoria = async (db: DB): Promise<boolean> => {
  if (_cacheResultado !== null) return _cacheResultado;

  try {
    // Consulta simple: verifica existencia de la función y/o triggers específicos
    const sql = `
      SELECT
        (SELECT COUNT(*) FROM pg_proc WHERE proname = 'fn_registrar_auditoria') AS funciones,
        (SELECT COUNT(*) FROM pg_trigger WHERE tgname IN ('tg_auditar_glosario','tg_auditar_adrs')) AS triggers
    `;
    // Asumir que `db` expone método `.query(sql)` o similar; en caso contrario el repo mockea.
    const res: any = await (db as any).query?.(sql);
    if (!res) {
      // Intentar alternativa con Drizzle: raw SQL execution
      const alt: any = await (db as any).execute?.(sql);
      if (!alt) return (_cacheResultado = false);
      const row = alt[0] ?? alt?.rows?.[0];
      _cacheResultado = Boolean(Number(row?.funciones || row?.funciones) + Number(row?.triggers || row?.triggers));
      return _cacheResultado;
    }

    const row = Array.isArray(res) ? res[0] : res.rows?.[0] ?? res[0];
    _cacheResultado = Boolean(Number(row.funciones ?? 0) + Number(row.triggers ?? 0));
    return _cacheResultado;
  } catch (_err) {
    // Si ocurre cualquier error, asumimos que no hay triggers (modo seguro)
    _cacheResultado = false;
    return _cacheResultado;
  }
};
