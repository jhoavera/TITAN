import { ServicioADRCRUD, ADRMeta } from './adr-crud'
import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'

export class ServicioADR {
  private readonly crud: ServicioADRCRUD

  constructor(crud?: ServicioADRCRUD) {
    this.crud = crud ?? new ServicioADRCRUD()
  }

  crearYCommit(titulo: string, autor: string, contenido: string, opts?: { estado?: string; commitMsg?: string }): ADRMeta {
    const meta = this.crud.crear(titulo, autor, contenido, { estado: opts?.estado as any })
    // Add and commit to git for trazabilidad
    try {
      const repoRoot = path.resolve(process.cwd(), '..')
      // git add
      execSync(`git add "${meta.ruta}"`, { cwd: repoRoot })
      const msg = opts?.commitMsg ?? `docs(adr): crear ADR ${meta.id} - ${titulo}`
      execSync(`git commit -m "${msg}"`, { cwd: repoRoot })
    } catch (e) {
      // No hacer rollback de archivo; registrar en consola
      console.warn('No se pudo hacer commit git para la ADR (posible entorno sin git):', e)
    }
    return meta
  }
}

export default new ServicioADR()
