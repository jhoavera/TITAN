import { ServicioADR } from './servicio-adr'
import RepositorioADRsDrizzle from '@infraestructura/repositorios/repositorio-adrs-drizzle'
import path from 'path'
import fs from 'fs'

export class ServicioADRIntegrado {
  private fsService: ServicioADR
  private dbRepo: InstanceType<typeof RepositorioADRsDrizzle> | null = null

  constructor(basePath?: string, databaseUrl?: string) {
    this.fsService = new ServicioADR(basePath)
    const url = databaseUrl ?? process.env.TEST_DATABASE_URL ?? process.env.DATABASE_URL
    if (url) {
      try {
        this.dbRepo = new RepositorioADRsDrizzle(String(url))
      } catch (err) {
        // No bloquear en entornos sin DB; registrar advertencia
        // eslint-disable-next-line no-console
        console.warn('Advertencia: no se pudo inicializar RepositorioADRsDrizzle:', (err as Error).message)
        this.dbRepo = null
      }
    }
  }

  async crearADR(input: unknown, opts?: { commit?: boolean; force?: boolean; identificadorInquilino?: string; autorId?: string }) {
    // Si hay repo DB, usarlo cuando se pueda (traducción y validaciones siguen en fsService)
    if (this.dbRepo) {
      const datos = input as any
      // numero provisional: contar filas actuales + 1 (no 100% a prueba de race, suficiente para nuestro uso local)
      const existentes = await this.dbRepo.listar(datos.identificador_inquilino ?? 'default')
      const numero = (existentes?.length ?? 0) + 1
      const row = await this.dbRepo.crear({
        numero,
        titulo: datos.titulo,
        objetivo: datos.objetivo,
        decision: datos.decision,
        identificador_inquilino: datos.identificador_inquilino ?? 'default',
        autor_id: opts?.autorId ?? 'automatizado',
        archivo_markdown: datos.archivo_markdown ?? null,
        tags: datos.tags ?? [],
      })
      return row
    }

    // Fallback a FS
    return this.fsService.crearADR(input, opts)
  }

  async listarADR(opts?: { identificadorInquilino?: string }) {
    if (this.dbRepo) {
      return this.dbRepo.listar(opts?.identificadorInquilino ?? 'default')
    }
    return this.fsService.listarADR()
  }

  async leerADR(idOrFilename: string) {
    if (this.dbRepo) {
      const row = await this.dbRepo.obtenerPorId(idOrFilename, 'default')
      if (!row) throw new Error('ADR no encontrado')
      return row
    }
    return this.fsService.leerADR(idOrFilename)
  }

  async actualizarADR(idOrFilename: string, cambios: Record<string, unknown>, opts?: { autorCommit?: { nombre: string; email: string } }) {
    if (this.dbRepo) {
      const res = await this.dbRepo.actualizar(idOrFilename, cambios, 'default')
      if (!res) throw new Error('No se pudo actualizar ADR en DB')
      return res
    }
    return this.fsService.actualizarADR(idOrFilename, cambios, opts)
  }

  async eliminarADR(idOrFilename: string, opts?: { commit?: boolean }) {
    if (this.dbRepo) {
      return this.dbRepo.eliminar(idOrFilename, 'default')
    }
    return this.fsService.eliminarADR(idOrFilename, opts)
  }

  // Utility: migrar todos los ADRs de FS a DB (archiva los md a carpeta 'archivado')
  async migrarFSaDB(identificadorInquilino = 'default') {
    if (!this.dbRepo) throw new Error('BASE DE DATOS NO CONFIGURADA')
    await this.fsService.ensureBasePath()
    const archivos = await fs.promises.readdir(this.fsService['basePath'])
    const adrs = archivos.filter((f) => f.endsWith('.md'))
    const archivadosDir = path.join(this.fsService['basePath'], 'archivado')
    await fs.promises.mkdir(archivadosDir, { recursive: true })

    const migrados: string[] = []

    for (const archivo of adrs) {
      const ruta = path.join(this.fsService['basePath'], archivo)
      const contenido = await fs.promises.readFile(ruta, 'utf8')
      // extraer título, autor, objetivo, decision simple
      const tituloMatch = contenido.match(/^#\s+ADR\s+[^\s]+\s+-\s+(.+)$/m)
      const titulo = tituloMatch ? tituloMatch[1].trim() : archivo
      const autorMatch = contenido.match(/\*\*Autor:\*\*\s*([^\n]+)/)
      const autor = autorMatch ? autorMatch[1].trim() : 'desconocido'
      const objetivoMatch = contenido.match(/## Objetivo\n\n([\s\S]*?)\n\n## Decisión/)
      const objetivo = objetivoMatch ? objetivoMatch[1].trim() : ''
      const decisionMatch = contenido.match(/## Decisión\n\n([\s\S]*?)\n\n## Consecuencias/)
      const decision = decisionMatch ? decisionMatch[1].trim() : ''

      await this.dbRepo.crear({ numero: Date.now() % 100000, titulo, objetivo, decision, identificador_inquilino: identificadorInquilino, autor_id: autor, archivo_markdown: archivo })

      // mover archivo a archivado
      await fs.promises.rename(ruta, path.join(archivadosDir, archivo))
      migrados.push(archivo)
    }

    return migrados
  }
}

export default ServicioADRIntegrado
