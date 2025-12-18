#!/usr/bin/env ts-node
import fs from 'fs'
import path from 'path'
import process from 'process'
import childProcess from 'child_process'
import { analizarScripts } from './analizar-node-compatibilidad'
import { escanearRepositorioParaIngles, procesarHallazgosYGenerarPropuestas } from '../../src/nucleo/servicios/servicio-integridad-idioma'
import path from 'path'

type Change = { scriptName: string; from: string; to: string }

export function planConversion(scripts: Record<string,string>): Change[] {
  const findings = analizarScripts(scripts)
  const changes: Change[] = []
  for (const f of findings) {
    if (f.suggestion && f.suggestion !== f.command) {
      changes.push({ scriptName: f.scriptName, from: f.command, to: f.suggestion })
    }
  }
  return changes
}

export function detectEnglishTerms(scripts: Record<string,string>): string[] {
  const candidates = new Set<string>()
  const keywords = ['migration', 'migrations', 'migrate']
  for (const cmd of Object.values(scripts)) {
    const lower = cmd.toLowerCase()
    for (const k of keywords) {
      if (lower.includes(k)) candidates.add(k)
    }
  }
  return Array.from(candidates)
}

export async function ejecutarConversion(options: { apply: boolean; createPR?: boolean; force?: boolean }): Promise<Change[]> {
  const pkgPath = path.resolve(process.cwd(), 'package.json')
  if (!fs.existsSync(pkgPath)) throw new Error('package.json no encontrado')
  const pkg = JSON.parse(await fs.promises.readFile(pkgPath, 'utf8')) as { scripts?: Record<string,string> }
  const scripts = pkg.scripts ?? {}
  const changes = planConversion(scripts)

  if (changes.length === 0) return []

  // detectar términos en inglés frecuentes y ejecutar flujo de integridad de idioma
  const englishTerms = detectEnglishTerms(scripts)
  let integridadResultados: Array<{ termino: string; propuestaGlosario?: string; adr?: string }> = []
  if (englishTerms.length) {
    console.warn('Se detectaron términos en inglés que podrían requerir traducción y una ADR (ej. migrations):', englishTerms.join(', '))
    console.warn("Ejecutando 'revisar-idioma' en modo automático para generar propuestas (ADRs / glosario)...")
    const hallazgos = await escanearRepositorioParaIngles(process.cwd())
    integridadResultados = await procesarHallazgosYGenerarPropuestas(process.cwd(), hallazgos)
    const adrsGeneradas = integridadResultados.filter(r => r.adr).map(r => r.adr as string)
    if (adrsGeneradas.length) {
      console.warn('Se generaron ADRs propuestas para traducciones:', adrsGeneradas.join(', '))
      if (!options.force) {
        console.error('ADRs propuestas detectadas. No se aplicarán cambios hasta que las ADRs sean revisadas/aprobadas. Usa --force para forzar la aplicación.')
        return changes
      }
    }
  }

  if (options.apply) {
    const date = new Date().toISOString().slice(0,10)
    const branch = `migracion/node-a-bun-${date}`
    try {
      childProcess.execSync(`git checkout -b ${branch}`, { stdio: 'inherit' })
    } catch (e) {
      // si falla, intentar continuar (branch puede existir)
    }

    for (const c of changes) {
      pkg.scripts = pkg.scripts ?? {}
      pkg.scripts[c.scriptName] = c.to
    }

    await fs.promises.writeFile(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8')

    try {
      childProcess.execSync('git add package.json', { stdio: 'inherit' })
      childProcess.execSync('git commit -m "chore(mig): convertir scripts Node→Bun (automático)"', { stdio: 'inherit' })
      console.log('Cambios aplicados y commit creado en branch:', branch)
    } catch (e) {
      console.error('Advertencia: no se pudo crear commit automáticamente. Revisa el estado de git manualmente.')
    }

    if (options.createPR) {
      try {
        const pr = await import('./abrir-pr-migracion')
        const title = `Mig: convertir scripts Node→Bun (${branch})`
        const listaCambios = changes.map(c => `- \`${c.scriptName}\`: \`${c.from}\` → \`${c.to}\``).join('\n')
        const listaADRs = integridadResultados.filter(r => r.adr).map(r => `- ${r.adr} (propuesta para '${r.termino}')`).join('\n') || 'Ninguna'
        const body = `PR automático generado por \`convertir-scripts-a-bun\`.\n\n**Cambios detectados:**\n${listaCambios}\n\n**ADRs / propuestas de glosario generadas:**\n${listaADRs}`
        const tpl = path.resolve(process.cwd(), '.github/PULL_REQUEST_TEMPLATE/pr-migracion.md')
        const vars = {
          lista_cambios: listaCambios,
          lista_adrs: listaADRs,
          git_refs: branch
        }
        const res = pr.crearPR(branch, title, body, { templatePath: tpl, vars })
        if (res.success) console.log('PR creada o branch empujado correctamente:', res.url ?? '(sin url)')
        else console.error('No se pudo crear PR automáticamente; revisa y crea PR manualmente. Detalle:', res.message)
      } catch (err) {
        console.error('Error al intentar crear PR automáticamente:', (err as Error).message)
      }
    }
  }

  return changes
}

async function main(): Promise<number> {
  const apply = process.argv.includes('--apply') || process.argv.includes('-a')
  try {
    const changes = await ejecutarConversion({ apply })
    if (changes.length === 0) {
      console.log('No se requieren cambios. ✅')
      return 0
    }
    console.log(`Se planificaron ${changes.length} cambios:`)
    for (const c of changes) console.log(`- ${c.scriptName}: \n    FROM: ${c.from}\n    TO:   ${c.to}`)
    if (!apply) console.log('\n(En modo dry-run. Ejecuta con --apply para aplicar cambios y crear commit)')
    return 0
  } catch (err) {
    console.error('Error al planificar/aplicar conversion:', (err as Error).message)
    return 1
  }
}

if (require.main === module) {
  main().then((c)=>process.exit(c)).catch(()=>process.exit(1))
}
