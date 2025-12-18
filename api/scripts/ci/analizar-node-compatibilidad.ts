#!/usr/bin/env ts-node
import fs from 'fs'
import path from 'path'
import process from 'process'

type ReportItem = {
  scriptName: string
  command: string
  issues: string[]
  suggestion?: string
}

export function analizarScripts(scripts: Record<string,string>): ReportItem[] {
  const findings: ReportItem[] = []
  const nodePatterns: Array<{re: RegExp, issue: string, suggest: (cmd: string)=>string}> = [
    { re: /node\s+-r\s*ts-node\/register/i, issue: 'Uso de node con ts-node/register', suggest: (c)=>c.replace(/node\s+-r\s*ts-node\/register/i, 'bun') },
    { re: /ts-node/i, issue: 'Uso de ts-node', suggest: (c)=>c.replace(/ts-node/i, 'bun') },
    { re: /node\s+/i, issue: 'Invocación explícita a node', suggest: (c)=>c.replace(/node\s+/i, 'bun ') },
    { re: /npx\s+/i, issue: 'Uso de npx (puede requerir conversión)', suggest: (c)=>c.replace(/npx\s+/i, 'bunx ') },
    { re: /\.\/node_modules\/\.bin\//i, issue: 'Uso de binarios vía node_modules/.bin', suggest: (c)=>c.replace(/\.\/node_modules\/\.bin\//i, '') }
  ]

  for (const [name, cmd] of Object.entries(scripts)) {
    const issues: string[] = []
    let suggestion: string | undefined = undefined
    for (const p of nodePatterns) {
      if (p.re.test(cmd)) {
        issues.push(p.issue)
        suggestion = p.suggest(cmd)
      }
    }
    if (issues.length) findings.push({ scriptName: name, command: cmd, issues, suggestion })
  }
  return findings
}

async function main(): Promise<number> {
  const pkgPath = path.resolve(process.cwd(), 'package.json')
  if (!fs.existsSync(pkgPath)) {
    console.error('package.json no encontrado en el directorio actual')
    return 2
  }
  const pkg = JSON.parse(await fs.promises.readFile(pkgPath, 'utf8')) as {scripts?: Record<string,string>} 
  const scripts = pkg.scripts ?? {}
  const findings = analizarScripts(scripts)

  if (findings.length === 0) {
    console.log('No se detectaron invocaciones Node específicas. ✅')
    return 0
  }

  console.log(`Se detectaron ${findings.length} scripts que podrían necesitar migración a Bun:`)
  for (const f of findings) {
    console.log(`- ${f.scriptName}: ${f.command}`)
    for (const i of f.issues) console.log(`    · Issue: ${i}`)
    if (f.suggestion) console.log(`    · Sugerencia: ${f.suggestion}`)
  }

  if (process.argv.includes('--fail-on-findings') || process.argv.includes('-f')) {
    console.error('Fallando por --fail-on-findings')
    return 3
  }

  return 0
}

const __isMain = (() => {
  try {
    const g = globalThis as unknown as { require?: { main?: unknown } }
    if (typeof g.require === 'function') {
      return (g.require as { main?: unknown }).main === module
    }
  } catch (e) {
    // ignore
  }
  try {
    const script = process.argv[1] || ''
    return script.includes('analizar-node-compatibilidad') && (script.endsWith('.ts') || script.endsWith('.js'))
  } catch (e) {
    return false
  }
})()

if (__isMain) {
  main().then((code)=>process.exit(code)).catch((err)=>{ console.error('Error:', err); process.exit(1) })
}
