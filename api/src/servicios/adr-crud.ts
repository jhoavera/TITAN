import fs from 'fs'
import path from 'path'

export type EstadoADR = 'pendiente' | 'aprobado' | 'rechazado' | string

export type ADRMeta = {
  id: string
  ruta: string
  archivo: string
  estado: EstadoADR
  titulo: string
  autor: string
  fecha: string
}

export class ServicioADRCRUD {
  private readonly raiz: string
  private readonly adrsDir: string

  constructor(raiz?: string) {
    this.raiz = raiz ? path.resolve(raiz) : path.resolve(process.cwd(), '..')
    this.adrsDir = process.env.ADRS_DIR
      ? path.resolve(process.env.ADRS_DIR)
      : path.join(this.raiz, 'documentacion-fuente-unica-verdad', 'ad-rs')
  }

  private slug(titulo: string): string {
    return titulo
      .toLowerCase()
      .replace(/[^a-z0-9áéíóúñ\-\s]/g, '')
      .trim()
      .replace(/\s+/g, '-')
  }

  private ensureDir(): void {
    fs.mkdirSync(this.adrsDir, { recursive: true })
  }

  private construirDocumento(meta: { id: string; titulo: string; autor: string; fecha: string; estado: EstadoADR; cuerpo: string }): string {
    return `# ADR ${meta.id} - ${meta.titulo}\n\n**Autor:** ${meta.autor}\n**Fecha:** ${meta.fecha}\n**Estado:** ${meta.estado}\n\n${meta.cuerpo}`
  }

  private extraerTitulo(contenido: string): string | undefined {
    const m = contenido.match(/^#\s+ADR\s+[^\s]+\s+-\s+(.+)$/m)
    return m ? m[1].trim() : undefined
  }

  private extraerAutor(contenido: string): string | undefined {
    const m = contenido.match(/\*\*Autor:\*\*\s*([^\n]+)/)
    return m ? m[1].trim() : undefined
  }

  private extraerFecha(contenido: string): string | undefined {
    const m = contenido.match(/\*\*Fecha:\*\*\s*([^\n]+)/)
    return m ? m[1].trim() : undefined
  }

  private extraerEstado(contenido: string): EstadoADR | undefined {
    const m = contenido.match(/\*\*Estado:\*\*\s*([^\n]+)/)
    return m ? (m[1].trim() as EstadoADR) : undefined
  }

  private buscarArchivo(id: string): string | null {
    const archivos = fs.existsSync(this.adrsDir) ? fs.readdirSync(this.adrsDir) : []
    const encontrado = archivos.find((f) => f.includes(id) && f.endsWith('.md'))
    return encontrado ?? null
  }

  crear(titulo: string, autor: string, contenido: string, opts?: { estado?: EstadoADR }): ADRMeta {
    this.ensureDir()
    const baseId = `${Date.now()}-${this.slug(titulo) || 'adr'}`
    const id = baseId.replace(/-+/g, '-')
    const archivo = `${id}.md`
    const ruta = path.join(this.adrsDir, archivo)
    const estado = opts?.estado ?? 'pendiente'
    const fecha = new Date().toISOString()
    const documento = this.construirDocumento({ id, titulo, autor, fecha, estado, cuerpo: contenido })
    fs.writeFileSync(ruta, documento, 'utf8')
    return { id, ruta, archivo, estado, titulo, autor, fecha }
  }

  actualizar(id: string, cambios: { estado?: EstadoADR; contenido?: string }): ADRMeta {
    this.ensureDir()
    const archivo = this.buscarArchivo(id)
    if (!archivo) throw new Error(`ADR no encontrado: ${id}`)
    const ruta = path.join(this.adrsDir, archivo)
    const actual = fs.readFileSync(ruta, 'utf8')
    const titulo = this.extraerTitulo(actual) ?? id
    const autor = this.extraerAutor(actual) ?? 'desconocido'
    const fecha = this.extraerFecha(actual) ?? new Date().toISOString()
    const estado = cambios.estado ?? this.extraerEstado(actual) ?? 'pendiente'

    const cuerpo = cambios.contenido ?? actual.split('\n\n').slice(2).join('\n\n')
    const documento = this.construirDocumento({ id: archivo.replace(/\.md$/, ''), titulo, autor, fecha, estado, cuerpo })
    fs.writeFileSync(ruta, documento, 'utf8')

    return { id: archivo.replace(/\.md$/, ''), ruta, archivo, estado, titulo, autor, fecha }
  }
}

export default { ServicioADRCRUD }
