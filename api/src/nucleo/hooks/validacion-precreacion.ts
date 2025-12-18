import { validarYRegistrarNombre } from '../servicios/servicio-validacion-creacion'

export type ResultadoValidacionPreCreacion = {
  propuestaCreada?: string | null
  mensaje?: string
}

/**
 * Valida un nombre antes de crear un recurso (archivo, carpeta, término, ADR).
 * Llama a `validarYRegistrarNombre` (no bloqueante) y devuelve un resumen.
 */
export async function validarPreCreacion(nombre: string, tipo: 'glosario' | 'adr' | 'otro' = 'otro'): Promise<ResultadoValidacionPreCreacion> {
  if (!nombre || typeof nombre !== 'string') return { mensaje: 'Nombre inválido' }
  try {
    const res = await validarYRegistrarNombre(nombre, tipo)
    return { propuestaCreada: res.propuesta ?? null, mensaje: res.mensaje ?? 'validación realizada' }
  } catch (e: any) {
    return { mensaje: `error validando nombre: ${e?.message ?? String(e)}` }
  }
}

export default { validarPreCreacion }
