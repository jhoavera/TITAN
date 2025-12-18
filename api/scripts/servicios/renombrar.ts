#!/usr/bin/env node
import fs from 'fs'
import path from 'path'
import { spawnSync } from 'child_process'
import { escanearRepositorioParaIngles, procesarHallazgosYGenerarPropuestas } from '../../src/nucleo/servicios/servicio-integridad-idioma'
import { crearADR } from './adrs'
import { crearPR } from '../ci/abrir-pr-migracion'

export type PlanRenombrado = {
  origen: string
  destino: string
  archivos: string[]
}

export async function planRenombrados(raiz: string): Promise<PlanRenombrado[]> {
  const r = path.resolve(raiz)
  const hallazgos = await escanearRepositorioParaIngles(r)
  const propuestas = await procesarHallazgosYGenerarPropuestas(r, hallazgos)
  const planes: PlanRenombrado[] = []
  for (const p of propuestas) {
    if (!p.propuestaGlosario || !p.sugerenciaTraduccion) continue
    // buscar archivos que contengan el término original
    const matches: string[] = []
    const walk = (dir: string) => {
      for (const f of fs.readdirSync(dir)) {
        const full = path.join(dir, f)
        const stat = fs.statSync(full)
        if (stat.isDirectory()) walk(full)
        else {
          const txt = fs.readFileSync(full, 'utf8')
          if (txt.includes(p.termino)) matches.push(full)
        }
      }
    }
    walk(r)
    planes.push({ origen: p.termino, destino: p.sugerenciaTraduccion, archivos: matches })
  }
  return planes
}

export type ResultadoAplicacion = { branch?: string; prUrl?: string; applied: boolean; message?: string }

export async function aplicarRenombrados(raiz: string, opciones?: { fuerza?: boolean; autor?: string; titulo?: string }): Promise<ResultadoAplicacion> {
  const r = path.resolve(raiz)
  const planes = await planRenombrados(r)
  if (planes.length === 0) return { applied: false, message: 'No hay renombrados detectados' }

  // crear ADR propuesta por cada renombrado si no existe
  const adrs: string[] = []
  for (const p of planes) {
    const nombre = `${new Date().toISOString().slice(0,10)}-propuesta-traducir-${p.origen.replace(/[^a-z0-9-]/gi,'-')}.md`
    const contenido = `---\ntitulo: "Propuesta: traducir ${p.origen} → ${p.destino}"\nautor: renombrar-guiado\nfecha: ${new Date().toISOString()}\nestado: propuesta\n---\n\nPropuesta automática: sugerir reemplazo de ${p.origen} por ${p.destino}.`;
    const created = await crearADR(process.cwd(), nombre, contenido)
    adrs.push(created.ruta ?? nombre)
  }

  // Si no se fuerza y hay ADRs pendientes, bloquear aplicación
  if (!opciones?.fuerza) {
    return { applied: false, message: `ADRs creadas: ${adrs.join(', ')} — aplica sólo después de aprobar ADR o usando --fuerza` }
  }

  // aplicar cambios en branch
  const branch = `renombrado/automático-${new Date().toISOString().slice(0,10)}`
  const gitInit = spawnSync('git', ['checkout', '-b', branch], { cwd: r })
  if (gitInit.status !== 0) return { applied: false, message: 'No se pudo crear branch para renombrados' }

  // reemplazos simples (contenido de archivos)
  for (const p of planes) {
    for (const file of p.archivos) {
      const txt = fs.readFileSync(file, 'utf8')
      const replaced = txt.split(p.origen).join(p.destino)
      fs.writeFileSync(file, replaced, 'utf8')
    }
  }

  spawnSync('git', ['add', '.'], { cwd: r })
  spawnSync('git', ['commit', '-m', 'chore(mig): renombrados automáticos guiados por ADR'], { cwd: r })

  // crear PR usando helper (intenta gh o token fallback interno)
  const prBody = `Renombrados automáticos propuestos:\n\n${planes.map((p) => `- ${p.origen} → ${p.destino} (archivos: ${p.archivos.length})`).join('\n') }\n\nADRs relacionadas:\n${adrs.join('\n')}`
  const pr = crearPR(branch, opciones?.titulo ?? `Renombrados: ${planes[0].origen} → ${planes[0].destino}`, prBody)

  return { branch, prUrl: pr.url, applied: true }
}

export default { planRenombrados, aplicarRenombrados }
