import fs from 'fs'
import path from 'path'

import { validarPreCreacion } from '@nucleo/hooks/validacion-precreacion'

export async function crearADR(raiz: string, nombre: string, contenido: string) {
  // ejecutar pre-validacion antes de crear (no bloquear creación por fallos), y devolver metadata
  const pre = await validarPreCreacion(nombre, 'adr')
  const ruta = path.join(raiz, 'documentacion-fuente-unica-verdad', 'ad-rs', nombre)
  await fs.promises.mkdir(path.dirname(ruta), { recursive: true })
  await fs.promises.writeFile(ruta, contenido, 'utf8')
  // Registrar en índice ADR (si el Servicio ADR está disponible)
  try {
    // Importar dinámicamente usando una variable para evitar que TypeScript intente resolver el módulo en compilación
    const svcModulePath = '@servicios/adr-crud'
    const mod: any = await import(svcModulePath).catch(() => null)
    const ServicioADRCRUD = mod && mod.ServicioADRCRUD
    if (ServicioADRCRUD) {
      // Extraer título y autor desde front-matter simple
      const tituloMatch = contenido.match(/titulo:\s*"?([^"]+)"?/i)
      const title = tituloMatch ? tituloMatch[1].trim() : nombre.replace(/\.md$/i, '')
      const autorMatch = contenido.match(/autor:\s*([a-zA-Z0-9-_@\.]+)/i)
      const autor = autorMatch ? autorMatch[1].trim() : 'auto'
      const svc = new ServicioADRCRUD(raiz)
      await svc.crear(title, autor, contenido)
    }
  } catch (e) {
    // no bloquear la creación si algo falla en el registro
    console.error('No se pudo registrar ADR en índice:', (e as Error).message)
  }
  return { ruta, preValidacion: pre }
}

export default { crearADR }
