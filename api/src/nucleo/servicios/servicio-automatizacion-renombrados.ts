import { exec as _exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'

const exec = promisify(_exec)

export type OperacionRenombrado = { desde: string; hacia: string }

/**
 * Crea una rama local, aplica renombrados (fs.rename), hace git add/commit.
 * No hace push ni crea PRs por defecto. Devuelve metadata sobre la operación.
 */
export async function ejecutarRenombrados(raiz: string, ops: OperacionRenombrado[], opciones: { autor?: string; mensaje?: string; ramaPrefijo?: string } = {}) {
  const rama = `${opciones.ramaPrefijo ?? 'renombre-adr'}-${Date.now()}`
  const mensaje = opciones.mensaje ?? `Propuesta de renombrado automatizado (${ops.length} cambios)`

  // asegurar que es repo git
  try { await exec('git rev-parse --is-inside-work-tree', { cwd: raiz }) } catch (e) { throw new Error('No es un repositorio git válido') }

  await exec(`git checkout -b ${rama}`, { cwd: raiz })

  const aplicados: string[] = []
  for (const o of ops) {
    const desde = path.join(raiz, o.desde)
    const hacia = path.join(raiz, o.hacia)
    await fs.promises.mkdir(path.dirname(hacia), { recursive: true })
    await fs.promises.rename(desde, hacia)
    aplicados.push(`${o.desde} -> ${o.hacia}`)
  }

  await exec('git add -A', { cwd: raiz })
  await exec(`git commit -m "${mensaje}"`, { cwd: raiz })
  const { stdout: sha } = await exec('git rev-parse --short HEAD', { cwd: raiz })

  return { rama, commit: sha.trim(), aplicados }
}

export default { ejecutarRenombrados }
