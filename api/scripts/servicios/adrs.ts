import fs from 'fs'
import path from 'path'

import { validarPreCreacion } from '../../src/nucleo/hooks/validacion-precreacion'

export async function crearADR(raiz: string, nombre: string, contenido: string) {
  // ejecutar pre-validacion antes de crear (no bloquear creación por fallos), y devolver metadata
  const pre = await validarPreCreacion(nombre, 'adr')
  const ruta = path.join(raiz, 'documentacion-fuente-unica-verdad', 'ad-rs', nombre)
  await fs.promises.mkdir(path.dirname(ruta), { recursive: true })
  await fs.promises.writeFile(ruta, contenido, 'utf8')
  return { ruta, preValidacion: pre }
}

export default { crearADR }
