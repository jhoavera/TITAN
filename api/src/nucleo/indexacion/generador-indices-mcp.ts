import fs from 'fs'
import path from 'path'

export type ImportOccurrence = {
  file: string
  line: number
  text: string
}

export async function scanForRelativeImports(startDir: string): Promise<ImportOccurrence[]> {
  const results: ImportOccurrence[] = []

  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        // skip node_modules, .git y directorios de fixtures/tmp generados
        if (entry.name === 'node_modules' || entry.name === '.git' || entry.name === 'fixtures' || entry.name === '__fixtures__' || entry.name === 'tmp') continue
        walk(full)
      } else if (entry.isFile() && (full.endsWith('.ts') || full.endsWith('.tsx') || full.endsWith('.js') || full.endsWith('.jsx'))) {
        const content = fs.readFileSync(full, 'utf8')
        const lines = content.split('\n')
        const relativeImport = /^\s*(import|export)\s+.*from\s+['"]\.\.?/;
        const relativeRequire = /^\s*[^/]*require\(\s*['"]\.\.?/;
        for (let i = 0; i < lines.length; i++) {
          const l = lines[i]
          // detectar imports/exports/require con segmentos relativos (../ o ./) reales, evitando strings de pruebas
          if (relativeImport.test(l) || relativeRequire.test(l)) {
            results.push({ file: full, line: i + 1, text: l.trim() })
          }
        }
      }
    }
  }

  walk(startDir)
  return results
}

export function generateIndexForType(typeDir: string): void {
  const files = fs.readdirSync(typeDir).filter((f) => {
    // exclude generated indexes, declaration files and non-ts files
    if (!f.endsWith('.ts') && !f.endsWith('.tsx')) return false
    if (/^indice(\.|$)/.test(f)) return false
    if (f.endsWith('.d.ts')) return false
    return true
  })

  // Derivar alias absoluto usando la ruta relativa a src
  const srcMarker = `${path.sep}src${path.sep}`
  const idx = typeDir.indexOf(srcMarker)
  if (idx === -1) {
    throw new Error(`[indexer] No se pudo derivar alias porque typeDir no contiene /src/: ${typeDir}`)
  }
  const subPath = typeDir.slice(idx + srcMarker.length) // ej: "nucleo/middleware"
  const [aliasBase, ...rest] = subPath.split(path.sep)
  const aliasPrefix = rest.length > 0 ? `@${aliasBase}/${rest.join('/')}` : `@${aliasBase}`

  const exports = files.sort().map((f) => {
    const base = f.replace(/\.(ts|tsx)$/, '')
    return `export * from '${aliasPrefix}/${base}'`
  })

  const header = `// _indice generado automáticamente - ${new Date().toISOString()}\n// No editar a mano, usar scripts/indexar-aliases.ts para regenerar\n`
  const content = `${header}${exports.join('\n')}\n`
  fs.writeFileSync(path.join(typeDir, 'indice.ts'), content, 'utf8')
}

export function updateBunAliases(bunfigPath = path.resolve(process.cwd(), '..', '..', '..', 'bunfig.toml'), srcDir = path.resolve(process.cwd(), '..')): void {
  try {
    // read bunfig.toml (keep existing content)
    const content = fs.existsSync(bunfigPath) ? fs.readFileSync(bunfigPath, 'utf8') : ''

    // collect candidate directories under srcDir (names only)
    const entries = fs.readdirSync(srcDir, { withFileTypes: true })
    const dirs = entries.filter((e) => e.isDirectory()).map((d) => d.name)

    // build alias lines for directories that contain TS files or are common folders
    const candidates = dirs.filter((d) => {
      const full = path.join(srcDir, d)
      try {
        const files = fs.readdirSync(full)
        return files.some((f) => /\.(ts|tsx)$/.test(f))
      } catch {
        return false
      }
    })

    // ensure [alias] section exists and append missing alias entries
    let out = content
    if (!/\[alias\]/.test(out)) {
      out = `[alias]\n` + out
    }

    for (const d of candidates) {
      const key = `"@${d}/*"`
      const val = `"./src/${d}/*"`
      const line = `${key} = ${val}`
      if (!new RegExp(`^\s*${key}\s*=`, 'm').test(out)) {
        // insert after [alias] header
        out = out.replace(/\[alias\]\s*/m, `[alias]\n${line}\n`)
      }
    }

    fs.writeFileSync(bunfigPath, out, 'utf8')
  } catch (e) {
    console.error('[indexer] failed to update bunfig aliases', e instanceof Error ? e.message : String(e))
  }
}

export default { scanForRelativeImports, generateIndexForType }
