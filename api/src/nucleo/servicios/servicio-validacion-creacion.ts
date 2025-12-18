import { validarNombre, detectarInglesBasico } from '@nucleo/utilidades/validar-nombre-archivo'
import fs from 'fs'
import path from 'path'

import { registrarEvento } from '@nucleo/servicios/servicio-auditoria-prevalidacion'
import { rutaPropuestasGlosario } from '@nucleo/rutas/rutas-docs'

export async function validarYRegistrarNombre(nombre: string, tipo: 'glosario' | 'adr' | 'otro' = 'otro') {
  const resultado = validarNombre(nombre)
  const hayIngles = detectarInglesBasico(nombre)
  let propuesta: string | null = null

  if (!resultado.valido || hayIngles) {
    // crear propuesta en glosario-biblioteca/propuestas
    const propuestasDir = rutaPropuestasGlosario()
    await fs.promises.mkdir(propuestasDir, { recursive: true })
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const nombreArchivo = `${timestamp}-${tipo}-${nombre.replace(/[\\/]/g, '_')}.md`
    const contenido = `---\norigen: validador-nombres\ntipo: ${tipo}\nnombre-original: ${nombre}\nvalido: ${resultado.valido}\nrazones: ${JSON.stringify(resultado.razones)}\nhayIngles: ${hayIngles}\n---\n\nPropuesta automática generada por el validador de nombres.`
    const ruta = path.join(propuestasDir, nombreArchivo)
    await fs.promises.writeFile(ruta, contenido, 'utf8')
    propuesta = ruta

    // registrar evento de pre-validacion para auditoría y métricas
    try {
      await registrarEvento({ nombre, tipo, valido: resultado.valido, hayIngles, propuesta: ruta })
    } catch (_e) {
      // no detener el flujo por fallo en auditoría local
    }
  } else {
    // registrar intento válido también para trazabilidad
    try {
      await registrarEvento({ nombre, tipo, valido: resultado.valido, hayIngles, propuesta: null })
    } catch (_e) {}
  }

  return { valido: resultado.valido, hayIngles, razones: resultado.razones, propuesta }
}

export function detectarIngles(nombre: string) {
  return detectarInglesBasico(nombre)
}

export default validarYRegistrarNombre
