import fs from 'fs'
import path from 'path'

export async function crearADR(raiz: string, nombre: string, contenido: string) {
  const ruta = path.join(raiz, 'documentacion-fuente-unica-verdad', 'ad-rs', nombre)
  await fs.promises.mkdir(path.dirname(ruta), { recursive: true })
  await fs.promises.writeFile(ruta, contenido, 'utf8')
  return ruta
}

export default { crearADR }
