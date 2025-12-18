import fs from 'fs'
import path from 'path'
import { validarYRegistrarNombre } from './servicio-validacion-creacion'

const palabrasIngles = new Set([
  'migrations','migration','migrations','template','create','service','test','spec','legacy','scripts','prompts'
])

export type Hallazgo = { tipo: 'archivo' | 'contenido'; ruta: string; termino: string }

export async function escanearRepositorioParaIngles(raiz: string): Promise<Hallazgo[]> {
  const hallazgos: Hallazgo[] = []

  async function escanearDir(dir: string) {
    const entradas = await fs.promises.readdir(dir, { withFileTypes: true })
    for (const e of entradas) {
      const nombre = e.name
      const ruta = path.join(dir, nombre)
      const lower = nombre.toLowerCase()
      for (const p of palabrasIngles) {
        if (lower.includes(p)) {
          hallazgos.push({ tipo: 'archivo', ruta, termino: p })
        }
      }
      if (e.isDirectory()) {
        // evitar node_modules por eficiencia
        if (nombre === 'node_modules' || nombre === '.git') continue
        await escanearDir(ruta)
      } else if (e.isFile()) {
        // comprobar contenido (primeras 2000 chars)
        try {
          const contenido = (await fs.promises.readFile(ruta, 'utf8')).slice(0, 2000).toLowerCase()
          for (const p of palabrasIngles) {
            if (contenido.includes(p)) hallazgos.push({ tipo: 'contenido', ruta, termino: p })
          }
        } catch (_err) {
          // ignorar ficheros binarios/lectura fallida
        }
      }
    }
  }

  await escanearDir(raiz)
  return hallazgos
}

export async function procesarHallazgosYGenerarPropuestas(raiz: string, hallazgos: Hallazgo[]) {
  const resultados: Array<{ termino: string; propuestaGlosario?: string; adr?: string }> = []
  for (const h of hallazgos) {
    const termino = h.termino
    // Normalizar término y proponer traducción básica (heurística)
    const traducciones: Record<string,string> = { migrations: 'migraciones', migration: 'migracion', template: 'plantilla', service: 'servicio', create: 'crear', test: 'prueba', spec: 'especificacion', legacy: 'legado', scripts: 'scripts', prompts: 'prompts' }
    const traduccion = traducciones[termino] ?? null

    // Crear propuesta en glosario (no bloqueante)
    const propuesta = `Automática: detectar uso de término en inglés '${termino}' en '${path.relative(raiz,h.ruta)}' - propuesto: '${traduccion ?? 'POR_TRADUCIR'}'`
    // usar servicio existente para insertar propuesta en glosario-biblioteca/propuestas
    const res = await validarYRegistrarNombre(termino, 'glosario')

    // Si validarYRegistrarNombre no creó propuesta (p.e. nombre válido), crear una propuesta explícita
    let propuestaRuta: string | undefined = res.propuesta ?? undefined
    if (!propuestaRuta) {
      try {
        const DOCS_ROOT = process.env.TITAN_DOCS_ROOT || path.resolve(__dirname, '../../../..')
        const propuestasDir = path.resolve(DOCS_ROOT, 'documentacion-fuente-unica-verdad', 'glosario-biblioteca', 'propuestas')
        await fs.promises.mkdir(propuestasDir, { recursive: true })
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
        const nombreArchivo = `${timestamp}-integridad-idioma-${termino.replace(/[\\/]/g, '_')}.md`
        const contenido = `---\norigen: integridad-idioma\ntermino: ${termino}\npropuesto: ${traduccion ?? 'POR_TRADUCIR'}\narchivo: ${path.relative(raiz,h.ruta)}\n---\n\n${propuesta}`
        const ruta = path.join(propuestasDir, nombreArchivo)
        await fs.promises.writeFile(ruta, contenido, 'utf8')
        propuestaRuta = ruta
      } catch (_e) {
        // ignore
      }
    }

    // Crear ADR describiendo la propuesta de cambio de nombre y justificación
    const fecha = new Date().toISOString().slice(0,10)
    const adrNombre = `000X-proponer-traduccion-${termino}-${fecha}.md`
    const contenidoADR = `---\ntitulo: "Propuesta: traducir '${termino}' a español"\nfecha: ${new Date().toISOString()}\nestado: propuesta\n---\n\nPropuesta automática: se detectó el término en inglés '${termino}' en el repositorio (ej. ${path.relative(raiz,h.ruta)}). Se propone usar '${traduccion ?? 'TRADUCCION-POR-DEFINIR'}' como término en español y registrar la entrada en el glosario con justificación técnica.`
    let adrRuta: string | undefined = undefined
    try {
      const crear = await import('./servicio-adrs')
      const creado = await crear.crearADR(raiz, adrNombre, contenidoADR)
      // crearADR ahora devuelve { ruta, preValidacion }
      adrRuta = typeof creado === 'string' ? creado : creado.ruta
    } catch (_err) {}

    resultados.push({ termino, propuestaGlosario: res.propuesta ?? undefined, adr: adrRuta })
  }
  return resultados
}

export default { escanearRepositorioParaIngles, procesarHallazgosYGenerarPropuestas }
