#!/usr/bin/env ts-node
import fs from 'fs'
import path from 'path'
import os from 'os'
import process from 'process'
import { analizarScripts } from './analizar-node-compatibilidad'

type ReportResult = {
  path: string
  content: string
}

export async function generarReporte(scripts?: Record<string,string>): Promise<ReportResult> {
  const pkgPath = path.resolve(process.cwd(), 'package.json')
  let localScripts: Record<string,string> = {}
  if (scripts) {
    localScripts = scripts
  } else {
    if (!fs.existsSync(pkgPath)) throw new Error('package.json no encontrado')
    const pkg = JSON.parse(await fs.promises.readFile(pkgPath, 'utf8')) as {scripts?: Record<string,string>}
    localScripts = pkg.scripts ?? {}
  }

  const findings = analizarScripts(localScripts)

  const now = new Date()
  const date = now.toISOString().slice(0,10)
  const reportsDir = path.resolve(process.cwd(), 'reports')
  if (!fs.existsSync(reportsDir)) await fs.promises.mkdir(reportsDir, { recursive: true })
  const reportPath = path.join(reportsDir, `migracion-node-a-bun-${date}.md`)

  const lines: string[] = []
  lines.push('# Informe de migración Node → Bun')
  lines.push(`Fecha: ${now.toISOString()}`)
  lines.push('')
  if (findings.length === 0) {
    lines.push('No se detectaron invocaciones específicas de Node/ts-node/npx. ✅')
  } else {
    lines.push(`Se detectaron ${findings.length} scripts que podrían necesitar migración a Bun:`)
    lines.push('')
    lines.push('| Script | Comando actual | Issues detectadas | Sugerencia |')
    lines.push('|---|---|---|---|')
    for (const f of findings) {
      const issues = f.issues.map((s)=>s.replace(/\|/g, '\\|')).join('; ')
      const suggestion = f.suggestion ? f.suggestion.replace(/\|/g, '\\|') : ''
      const safeCmd = f.command.replace(/\|/g, '\\|').replace(/\n/g, ' ')
      lines.push(`| ${f.scriptName} | ${safeCmd} | ${issues} | ${suggestion} |`)
    }
  }

  const content = lines.join(os.EOL)
  await fs.promises.writeFile(reportPath, content, 'utf8')
  return { path: reportPath, content }
}

async function main(): Promise<number> {
  try {
    const res = await generarReporte()
    console.log('Reporte generado:', res.path)
    return 0
  } catch (err) {
    console.error('Error generando reporte:', (err as Error).message)
    return 1
  }
}

if (require.main === module) {
  main().then((c)=>process.exit(c)).catch(()=>process.exit(1))
}
