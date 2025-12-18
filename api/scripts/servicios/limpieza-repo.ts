#!/usr/bin/env bun
import fs from 'fs'
import path from 'path'
import { shouldAutoApprove as sharedShouldAutoApprove } from '@servicios/limpieza-utils'

type Opciones = {
  dryRun: boolean
  olderThanDays: number
  apply: boolean
  autoApprove?: boolean
  gitCommit?: boolean
}

function listPropuestasDir(): string {
  return path.resolve(__dirname, '../../../documentacion-fuente-unica-verdad/glosario-biblioteca/propuestas')
}

function isMarkdownFile(name: string) {
  return name.endsWith('.md')
}

function fileAgeDays(filePath: string): number {
  const stat = fs.statSync(filePath)
  const ms = Date.now() - stat.mtime.getTime()
  return Math.floor(ms / (1000 * 60 * 60 * 24))
}

export async function run(opts: Opciones = { dryRun: true, olderThanDays: 30, apply: false }) {
  const dir = listPropuestasDir()
  if (!fs.existsSync(dir)) {
    console.log('Directorio de propuestas no existe:', dir)
    return { found: 0 }
  }

  const files = fs.readdirSync(dir).filter(isMarkdownFile)
  const candidates: Array<{ file: string; days: number }> = []

  // Fast-path: si hay MUCHÍSIMAS propuestas y hacemos sólo dry-run sin apply, devolver rápido
  const FAST_THRESHOLD = 5000
  if (opts.dryRun && !opts.apply && files.length > FAST_THRESHOLD) {
    console.log(`dry-run (sin apply) y > ${FAST_THRESHOLD} propuestas: atajo para evitar stat de cada archivo`)
    return { found: files.length }
  }

  for (const f of files) {
    try {
      const full = path.join(dir, f)
      const days = fileAgeDays(full)
      if (days >= opts.olderThanDays) candidates.push({ file: full, days })
    } catch (e) {
      // ignore errors
    }
  }

  // Use shared heuristic implementation to ensure consistent rules and metrics
  function shouldAutoApprove(filePath: string, opts: { maintainers: string[]; maxSizeForMaintainer: number; allowLongTermAuto: boolean; longTermDays: number }) {
    // delegate to shared implementation, passing through options
    const res = sharedShouldAutoApprove(filePath, { maintainers: opts.maintainers, maxSizeForMaintainer: opts.maxSizeForMaintainer, allowLongTermAuto: opts.allowLongTermAuto, longTermDays: opts.longTermDays })
    return res
  }
  
    console.log(`Propuestas encontradas (>= ${opts.olderThanDays}d): ${candidates.length}`)
    for (const c of candidates) console.log(` - ${path.basename(c.file)} (${c.days}d)`)

  // Optimización: en dry-run con autoApprove activado y muchos candidatos, devolver resumen rápido para evitar procesar miles de archivos
  if (opts.apply && opts.autoApprove && opts.dryRun && candidates.length > FAST_THRESHOLD) {
    console.log('dry-run + auto-approve: resumen rápido (no se procesan candidates)')
    return { found: candidates.length }
  }

  if (opts.apply && candidates.length > 0) {
    console.log('Aplicando acciones (modo seguro): mover archivos a carpeta `aplicadas/`')
    const aplicadoDir = path.join(dir, 'aplicadas')
    if (!fs.existsSync(aplicadoDir)) fs.mkdirSync(aplicadoDir)

    const autoApplied: string[] = []
    const needsManual: string[] = []

    for (const c of candidates) {
      const destino = path.join(aplicadoDir, path.basename(c.file))
      const evalResult = shouldAutoApprove(c.file, { maintainers: ['titan-admin','mantenedor','maintainer'], maxSizeForMaintainer: 800, allowLongTermAuto: true, longTermDays: 180 })
      const autoOk = Boolean(opts.autoApprove && evalResult.ok)

      if (autoOk) {
        autoApplied.push(c.file)
        if (opts.dryRun) {
          console.log(`[dry-run][auto-approve:${evalResult.reason}] mover ${c.file} -> ${destino}`)
        } else {
          fs.renameSync(c.file, destino)
          console.log(`auto-aplicado: ${c.file} -> ${destino}`)

          // crear ADR de registro básico
          try {
            const now = new Date().toISOString().replace(/[:.]/g, '-')
            const adrDir = path.resolve(__dirname, '../../../documentacion-fuente-unica-verdad/ad-rs/aplicadas')
            if (!fs.existsSync(adrDir)) fs.mkdirSync(adrDir, { recursive: true })
            const adrPath = path.join(adrDir, `aplicado-${now}-${path.basename(c.file)}`)
            const adrContent = `---\ntitulo: Aplicación automática de propuesta\norigen: ${path.basename(c.file)}\nfecha: ${new Date().toISOString()}\n---\n\nSe aplicó automáticamente la propuesta de glosario por regla de limpieza automática. Revisar la propuesta original en glosario-biblioteca/propuestas/\n`
            fs.writeFileSync(adrPath, adrContent, 'utf8')
            console.log(`ADR de aplicación generado: ${adrPath}`)
          } catch (e) {
            console.error('Error al crear ADR de aplicación:', e)
          }
        }
      } else {
        needsManual.push(c.file)
        console.log(`requiere revisión manual: ${c.file}`)
      }
    }

    // Si se pidió commit y no es dry-run, hacer commit de cambios
    if (opts.gitCommit && !opts.dryRun && (autoApplied.length > 0)) {
      try {
        const { execSync } = await import('child_process')
        execSync('git add -A', { stdio: 'inherit' })
        execSync(`git commit -m "chore(limpieza): aplicar ${autoApplied.length} propuestas antiguas"`, { stdio: 'inherit' })
        console.log('Cambios committeados a Git')
      } catch (e) {
        console.error('Error al ejecutar commit git:', e)
      }
    }

    console.log(`auto-aplicadas: ${autoApplied.length}, en espera revisión manual: ${needsManual.length}`)
  }

  return { found: candidates.length }
}

if (import.meta.main) {
  const argv = process.argv.slice(2)
  const dryRun = argv.includes('--dry-run') || !argv.includes('--apply')
  const apply = argv.includes('--apply')
  const olderArg = argv.find((a) => a.startsWith('--older-than='))
  const olderThanDays = olderArg ? Number(olderArg.split('=')[1]) : 30
  const autoApprove = argv.includes('--auto-approve')
  const gitCommit = argv.includes('--git-commit')

  run({ dryRun, olderThanDays, apply, autoApprove, gitCommit }).catch((e) => {
    // eslint-disable-next-line no-console
    console.error('Error en limpieza-repo:', e)
    process.exit(1)
  })
}
