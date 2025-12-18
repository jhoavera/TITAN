/**
 * Servicio para validar nombres conforme a las reglas de Español Técnico Empresarial.
 * - Rechaza términos en inglés comunes que deben traducirse (p.ej. migrations -> migraciones)
 * - Ofrece sugerencias simples para traducción o normalización
 */
export type ResultadoValidacion = {
  nombre: string;
  valido: boolean;
  razones: string[];
  sugerencia?: string;
};

type Regla = {
  patron: RegExp;
  sugerencia: string;
  etiqueta: string;
};

// Reglas de términos en inglés o restringidos que deben traducirse o justificarse.
const reglas: Regla[] = [
  { patron: /migration(s)?/i, sugerencia: 'migración / migraciones', etiqueta: 'migration' },
  { patron: /migrate/i, sugerencia: 'migrar', etiqueta: 'migrate' },
  { patron: /create(_table)?/i, sugerencia: 'crear / crear_tabla', etiqueta: 'create' },
  { patron: /template/i, sugerencia: 'plantilla', etiqueta: 'template' },
];

/**
 * Valida un nombre y retorna resultado con explicaciones y sugerencia.
 */
export function validarNombre(nombre: string): ResultadoValidacion {
  const razones: string[] = [];
  const minus = nombre.toLowerCase();
  let sugerenciaDetectada: string | undefined;

  for (const regla of reglas) {
    const match = minus.match(regla.patron);
    if (match) {
      razones.push(`Contiene término en inglés o restringido: "${match[0]}" (sugerido: ${regla.sugerencia})`);
      sugerenciaDetectada = sugerenciaDetectada ?? regla.sugerencia;
    }
  }

  // Regla adicional: no usar espacios, usar guiones bajos o kebab-case
  if (/\s/.test(nombre)) {
    razones.push('No usar espacios en nombres; use guiones bajos o kebab-case');
  }

  const resultado: ResultadoValidacion = {
    nombre,
    valido: razones.length === 0,
    razones,
    sugerencia: sugerenciaDetectada,
  };

  return resultado;
}

/**
 * Valida múltiples nombres y retorna lista de resultados.
 */
export function validarNombres(nombres: string[]): ResultadoValidacion[] {
  return nombres.map(validarNombre);
}

export default {
  validarNombre,
  validarNombres,
};

/**
 * Versión asíncrona que permite consultar un repositorio de glosario para
 * validar excepciones (p. ej. términos aprobados en el glosario).
 */
export async function validarNombreConGlosario(
  nombre: string,
  servicioGlosario?: { buscar: (termino: string) => Promise<Array<{ estado: string }>> },
): Promise<ResultadoValidacion> {
  const base = validarNombre(nombre);
  if (!servicioGlosario) return base;

  // Si ya es válido por reglas locales, no forzamos consulta.
  if (base.valido) return base;

  try {
    const entradas = await servicioGlosario.buscar(nombre);
    if (entradas && entradas.length > 0) {
      const aprobada = entradas.some((e) => e.estado === 'aprobado');
      if (aprobada) {
        return { ...base, valido: true, razones: [] };
      }
    }
  } catch (_e) {
    // Si falla la consulta, retornamos el resultado base
  }

  return base;
}
