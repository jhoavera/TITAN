import path from 'path'
import { validarYRegistrarNombre } from '@nucleo/servicios/servicio-validacion-creacion'

export async function crearPropuestaGlosario(nombre: string, tipo: string = 'termino') {
  return validarYRegistrarNombre(nombre, 'glosario')
}

export default { crearPropuestaGlosario }
