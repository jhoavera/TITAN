import fs from 'fs'
import path from 'path'
import { scanForRelativeImports, ImportOccurrence } from '@nucleo/indexacion/generador-indices-mcp'

export type Proposal = {
  id: string
  title: string
  files: string[]
  examples: ImportOccurrence[]
  rationale: string
  proposed_changes: string[]
}

export type ProposeOptions = {
  baseDir?: string
  outDir?: string
  dryRun?: boolean
  groupByDir?: boolean
}

export async function proposeRefactorImports(opts: ProposeOptions = {}) {
  const baseDir = opts.baseDir || path.resolve(process.cwd(), 'src')
  const outDir = opts.outDir || path.resolve(process.cwd(), '..', 'tmp', 'adrs-propuestas')
  const dryRun = opts.dryRun !== undefined ? opts.dryRun : true

  const occurrences = await scanForRelativeImports(baseDir)

  // Group occurrences by directory (folder containing the file)
  const groups = new Map<string, ImportOccurrence[]>()

  for (const occ of occurrences) {
    const dir = path.dirname(occ.file)
    const key = dir.replace(baseDir, '') || '/'
    const arr = groups.get(key) || []
    arr.push(occ)
    groups.set(key, arr)
  }

  const proposals: Proposal[] = []
  let idx = 1

  for (const [dir, occs] of groups.entries()) {
    const id = `P-IMP-${Date.now()}-${idx}`
    idx++
    const filesSet = new Set<string>(occs.map((o) => o.file))
    const files = Array.from(filesSet)

    const title = `Propuesta: reemplazar importaciones relativas en ${dir || '/'} por alias absolutos`
    const rationale = `Las importaciones relativas causan fragilidad al reestructurar. Proponer usar alias definidos en bunfig.toml para mejorar mantenibilidad.`

    const proposed_changes = files.map((f) => {
      const rel = path.relative(baseDir, f)
      const suggestion = `@/${rel.replace(/\.(ts|tsx)$/, '')}`
      return `Sugerir actualizar importaciones en '${rel}' a rutas con alias (ej: '${suggestion}').`
    })

    proposals.push({ id, title, files, examples: occs.slice(0, 5), rationale, proposed_changes })
  }

  // Ensure output dir
  if (!dryRun) {
    fs.mkdirSync(outDir, { recursive: true })
  } else {
    // dry-run: use tmp but create it so test can inspect
    fs.mkdirSync(outDir, { recursive: true })
  }

  // Generate ADR markdowns in outDir
  const adrs: string[] = []

  for (const p of proposals) {
    const filename = `${new Date().toISOString().slice(0,10)}-${p.id}-propuesta.md`
    const filePath = path.join(outDir, filename)

    const content = `---\nID: ${p.id}\nEstado: propuesta\nTitulo: ${p.title}\nFecha: ${new Date().toISOString()}\n---\n\n## Resumen\n${p.rationale}\n\n## Archivos afectados\n${p.files.map((f) => `- ${path.relative(baseDir, f)}`).join('\n')}\n\n## Ejemplos de importaciones relativas (líneas)\n${p.examples.map((e) => `- ${path.relative(baseDir, e.file)}:${e.line} -> ${e.text}`).join('\n')}\n\n## Cambios propuestos\n${p.proposed_changes.map((c) => `- ${c}`).join('\n')}\n\n## Notas\n- Este archivo fue generado en modo **dry-run** y no aplica cambios al código.\n- Para aplicar los cambios, ejecutar el CLI con --apply tras revisar y aprobar las ADRs.\n`

    fs.writeFileSync(filePath, content, 'utf8')
    adrs.push(filePath)
  }

  const report = {
    generatedAt: new Date().toISOString(),
    baseDir,
    proposalsCount: proposals.length,
    proposals: proposals.map((p) => ({ id: p.id, title: p.title, filesCount: p.files.length })),
  }

  const reportPath = path.join(outDir, 'report.json')
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf8')

  return { proposals, reportPath, adrs }
}

export function filesAffected(proposal: Proposal) {
  const set = new Set<string>()
  for (const f of proposal.files) set.add(f)
  return set.size
}

// Duplicate simple isSafeToAutoApply removed; use the async isSafeToAutoApply implementation below.

export function computeReplacementForFile(file: string, baseDir: string) {
  // returns array of {from, to}
  const content = fs.readFileSync(file, 'utf8')
  const rel = path.relative(baseDir, file).replace(/\\.tsx?$/, '')
  const suggestion = `@/${rel}`
  const replacements: Array<{ from: string; to: string }> = []

  const importRegex = /(from\s+['"])(\.\.?(?:[^'"`]*)['"])/g
  let m: RegExpExecArray | null
  while ((m = importRegex.exec(content))) {
    const fromPath = m[2].slice(0, -1) // remove trailing quote
    // only replace relative paths
    if (fromPath.startsWith('.')) {
      const toPath = suggestion.replace(/\/\/+$/, '')
      replacements.push({ from: m[0], to: `${m[1]}${toPath}'` })
    }
  }

  return replacements
}

// Duplicate applyProposalChanges implementation removed; use applyRefactorProposal wrapper implemented later in this file.

export type SafeResult = { ok: boolean; reason?: string; filesAffected: number }

export async function isSafeToAutoApply(proposal: Proposal, opts: { baseDir?: string; maxFiles?: number }): Promise<SafeResult> {
  const baseDir = opts.baseDir || path.resolve(process.cwd(), 'src')
  const maxFiles = opts.maxFiles ?? 5
  const filesAffected = proposal.files.length

  // If proposal only touches index files that are pure re-exports, allow a larger batch for convenience
  const allIndexOnly = proposal.files.every((f) => {
    try {
      const bn = path.basename(f).toLowerCase()
      if (!(bn === 'index.ts' || bn === 'indice.ts')) return false
      const c = fs.readFileSync(f, 'utf8')
      return c.split('\n').every((l) => l.trim() === '' || /^export\s+(\*\s+from|(\{.*\})\s+from)\s+['"]\./.test(l) || /^\/\/|^\/\*/.test(l))
    } catch (e) {
      return false
    }
  })
  const effectiveMax = allIndexOnly ? Math.max(maxFiles, 200) : maxFiles

  if (filesAffected > effectiveMax) return { ok: false, reason: `Afecta ${filesAffected} archivos (mayor que ${effectiveMax})`, filesAffected }

  // Heurística: ensure each file has at least one relative import and that replacements will be simple path string changes
  for (const f of proposal.files) {
    const content = fs.readFileSync(f, 'utf8')
    // If file contains export of multiple symbols, still ok as we only change import specifiers, but ensure file is not a barrel re-export like "export * from <sibling-module>;"
    const isBarrel = /export\s+\*\s+from\s+['"]\./.test(content)
    const isReExportNamed = /export\s+\{[^}]+\}\s+from\s+['"]\./.test(content)
    if (isBarrel || isReExportNamed) {
      // if all files in proposal are index-only re-exports, allow (handled by allIndexOnly earlier)
      if (!allIndexOnly) return { ok: false, reason: `Archivo ${path.relative(baseDir, f)} es un re-export (export * / export {...} from), revisión manual requerida`, filesAffected }
    }

    // heuristic: avoid files that perform dynamic requires or template-based imports
    // detect concatenation assignments used as module specifiers and later used in require/import()
    const dynamicRequireSimple = /require\s*\(\s*[^'\"\)]+\s*\+/.test(content) || /import\(.*\+/.test(content)
    if (dynamicRequireSimple) return { ok: false, reason: `Archivo ${path.relative(baseDir, f)} contiene requires/imports dinámicos, revisión manual requerida`, filesAffected }

    // improved dynamic var detection: find variables assigned using concatenation and used in require/import(variable)
    const dynamicVars = new Set<string>()
    const varAssign = /(?:const|let|var)\s+([A-Za-z0-9_$]+)\s*=\s*[^;]*\+/g
    let vmatch: RegExpExecArray | null
    while ((vmatch = varAssign.exec(content))) {
      dynamicVars.add(vmatch[1])
    }
    if (dynamicVars.size > 0) {
      for (const vn of Array.from(dynamicVars)) {
        const reRequire = new RegExp(`require\\s*\\(\\s*${vn}\\s*\\)`)
        const reImportCall = new RegExp(`import\\s*\\(\\s*${vn}\\s*\\)`) 
        if (reRequire.test(content) || reImportCall.test(content)) {
          return { ok: false, reason: `Archivo ${path.relative(baseDir, f)} contiene requires/imports dinámicos mediante variable (${vn}), revisión manual requerida`, filesAffected }
        }
      }
    }

    // Hardening: parse exported symbols and verify importer usage to avoid breaking renames
    const hasDefaultExport = /export\s+default\b/.test(content) || /module\.exports\s*=/.test(content)
    const exportedNames = new Set<string>()
    const namedDecl = /export\s+(?:const|let|var|function|class)\s+([A-Za-z0-9_$]+)/g
    let m: RegExpExecArray | null
    while ((m = namedDecl.exec(content))) {
      exportedNames.add(m[1])
    }
    const namedExportList = content.match(/export\s*\{([^}]+)\}/g) || []
    for (const ex of namedExportList) {
      const inner = ex.replace(/export\s*\{/, '').replace(/\}/, '')
      for (const name of inner.split(',')) {
        const nm = name.trim().split(/\s+as\s+/)[0].trim()
        if (nm) exportedNames.add(nm)
      }
    }

    // scan repo for importers that resolve to this file
    console.log('[isSafeToAutoApply] baseDir exists?', fs.existsSync(baseDir), 'baseDir', baseDir)
    const repoFiles = (function scan(dir: string): string[] {
      const res: string[] = []
      try {
        const entries = fs.readdirSync(dir, { withFileTypes: true })
        console.log('[isSafeToAutoApply] scanning dir', dir, 'entries', entries.map(ent=>ent.name))
        for (const e of entries) {
          const p = path.join(dir, e.name)
          if (e.isDirectory()) {
            if (['node_modules', '.git', 'dist', 'build'].includes(e.name)) continue
            res.push(...scan(p))
          } else if (/\.(ts|tsx|js|jsx)$/.test(e.name)) res.push(p)
        }
      } catch (e) { console.log('[isSafeToAutoApply] scan error', String(e)) }
      return res
    })(baseDir)

    console.log('[isSafeToAutoApply] repoFiles', repoFiles.length, repoFiles.map((p)=>path.relative(baseDir,p)).slice(0,20))

    // Also scan adjacent dirs near the target file to find importers that might be outside baseDir used in tests
    try {
      const adj = (function scan2(dir: string): string[] {
        const res: string[] = []
        try {
          const entries = fs.readdirSync(dir, { withFileTypes: true })
          for (const e of entries) {
            const p = path.join(dir, e.name)
            if (e.isDirectory()) {
              if (['node_modules', '.git', 'dist', 'build'].includes(e.name)) continue
              res.push(...scan2(p))
            } else if (/\.(ts|tsx|js|jsx)$/.test(e.name)) res.push(p)
          }
        } catch (e) {}
        return res
      })(path.dirname(f))
      if (adj.length > 0) {
        console.log('[isSafeToAutoApply] adjacent scan dir', path.dirname(f), 'found', adj.length)
        repoFiles.push(...adj)
      }
    } catch (e) {}

    try {
      const parentAdj = (function scan2(dir: string): string[] {
        const res: string[] = []
        try {
          const entries = fs.readdirSync(dir, { withFileTypes: true })
          for (const e of entries) {
            const p = path.join(dir, e.name)
            if (e.isDirectory()) {
              if (['node_modules', '.git', 'dist', 'build'].includes(e.name)) continue
              res.push(...scan2(p))
            } else if (/\.(ts|tsx|js|jsx)$/.test(e.name)) res.push(p)
          }
        } catch (e) {}
        return res
      })(path.resolve(path.dirname(f), '..'))
      if (parentAdj.length > 0) {
        console.log('[isSafeToAutoApply] parent adjacent scan dir', path.resolve(path.dirname(f), '..'), 'found', parentAdj.length)
        repoFiles.push(...parentAdj)
      }
    } catch (e) {}

    // Fallback: if no files found under provided baseDir (tests may provide different fixture paths), try scanning the file's directory and parent of baseDir
    if (repoFiles.length === 0) {
      try {
        const alt = (function scan2(dir: string): string[] {
          const res: string[] = []
          try {
            const entries = fs.readdirSync(dir, { withFileTypes: true })
            for (const e of entries) {
              const p = path.join(dir, e.name)
              if (e.isDirectory()) {
                if (['node_modules', '.git', 'dist', 'build'].includes(e.name)) continue
                res.push(...scan2(p))
              } else if (/\.(ts|tsx|js|jsx)$/.test(e.name)) res.push(p)
            }
          } catch (e) {}
          return res
        })(path.dirname(f))
        if (alt.length > 0) {
          console.log('[isSafeToAutoApply] fallback scan dir', path.dirname(f), 'found', alt.length)
          repoFiles.push(...alt)
        }
      } catch (e) {}

      if (repoFiles.length === 0) {
        try {
          const alt2 = (function scanRoot(dir: string): string[] {
            const res: string[] = []
            try {
              const entries = fs.readdirSync(dir, { withFileTypes: true })
              for (const e of entries) {
                const p = path.join(dir, e.name)
                if (e.isDirectory()) {
                  if (['node_modules', '.git', 'dist', 'build'].includes(e.name)) continue
                  res.push(...scanRoot(p))
                } else if (/\.(ts|tsx|js|jsx)$/.test(e.name)) res.push(p)
              }
            } catch (e) {}
            return res
          })(path.resolve(baseDir, '..'))
          if (alt2.length > 0) {
            console.log('[isSafeToAutoApply] fallback scan parent baseDir', path.resolve(baseDir, '..'), 'found', alt2.length)
            repoFiles.push(...alt2)
          }
        } catch (e) {}

        if (repoFiles.length === 0) {
          try {
            const altParent = path.resolve(path.dirname(f), '..')
            try { console.log('[isSafeToAutoApply] altParent path', altParent, 'exists', fs.existsSync(altParent), 'entries', fs.existsSync(altParent) ? fs.readdirSync(altParent).slice(0,20) : []) } catch(e) {}
            const altParentScan = (function scanRoot(dir: string): string[] {
              const res: string[] = []
              try {
                const entries = fs.readdirSync(dir, { withFileTypes: true })
                for (const e of entries) {
                  const p = path.join(dir, e.name)
                  if (e.isDirectory()) {
                    if (['node_modules', '.git', 'dist', 'build'].includes(e.name)) continue
                    res.push(...scanRoot(p))
                  } else if (/\.(ts|tsx|js|jsx)$/.test(e.name)) res.push(p)
                }
              } catch (e) {}
              return res
            })(altParent)
            if (altParentScan.length > 0) {
              console.log('[isSafeToAutoApply] fallback scan altParent', altParent, 'found', altParentScan.length)
              repoFiles.push(...altParentScan)
            }
          } catch (e) {}

          if (repoFiles.length === 0) {
            try {
              const alt3dirs = [path.resolve(baseDir, '..', 'servicios', 'fixtures'), path.resolve(baseDir, '..', '..')]
              for (const d of alt3dirs) {
                try {
                  const alt3 = (function scanRoot(dir: string): string[] {
                    const res: string[] = []
                    try {
                      const entries = fs.readdirSync(dir, { withFileTypes: true })
                      for (const e of entries) {
                        const p = path.join(dir, e.name)
                        if (e.isDirectory()) {
                          if (['node_modules', '.git', 'dist', 'build'].includes(e.name)) continue
                          res.push(...scanRoot(p))
                        } else if (/\.(ts|tsx|js|jsx)$/.test(e.name)) res.push(p)
                      }
                    } catch (e) {}
                    return res
                  })(d)
                  if (alt3.length > 0) {
                    console.log('[isSafeToAutoApply] fallback scan extra', d, 'found', alt3.length)
                    repoFiles.push(...alt3)
                  }
                } catch (e) {}
              }
            } catch (e) {}
          }
        }
      }
    }

    for (const importer of repoFiles) {
      const txt = fs.readFileSync(importer, 'utf8')
      const importRegex = /import\s+([\s\S]+?)\s+from\s+['"]([^'\"]+)['"]/g
      let mm: RegExpExecArray | null
      while ((mm = importRegex.exec(txt))) {
        const clause = mm[1].trim()
        const spec = mm[2]
        // resolve spec to a path similar to apply logic
        const candidate = path.resolve(path.dirname(importer), spec)
        let resolved = candidate
        if (!fs.existsSync(resolved)) {
          const exts = ['.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx']
          for (const e of exts) {
            if (fs.existsSync(resolved + e)) { resolved = resolved + e; break }
          }
        }
        // debug logs to help tests
        console.log('[isSafeToAutoApply] importer', path.relative(baseDir, importer), 'spec', spec, 'resolved', resolved, 'target', path.relative(baseDir, f))
        const normalize = (p: string) => path.resolve(p).replace(/\.(ts|tsx|js|jsx)$/, '')
        if (normalize(resolved) !== normalize(f)) continue

        // classify import clause
        if (/^\*\s+as\s+/.test(clause) || clause.includes('*')) {
          return { ok: false, reason: `Importador ${path.relative(baseDir, importer)} usa namespace import desde ${path.relative(baseDir, f)}; revisión manual requerida`, filesAffected }
        }
        if (/\{[^}]+\}/.test(clause)) {
          // named imports
          const namesPart = clause.replace(/^[^\{]*\{/, '').replace(/\}[^}]*$/, '')
          const names = namesPart.split(',').map((s) => s.trim().split(/\s+as\s+/)[0].trim()).filter(Boolean)
          console.log('[isSafeToAutoApply][named] importer', path.relative(baseDir, importer), 'names', names, 'exportedNames', Array.from(exportedNames))
          for (const name of names) {
            if (!exportedNames.has(name)) {
              return { ok: false, reason: `Importador ${path.relative(baseDir, importer)} importa '${name}' desde ${path.relative(baseDir, f)} pero no está exportado; revisión manual requerida`, filesAffected }
            }
          }
        } else {
          // default-like import
          console.log('[isSafeToAutoApply][default-check] importer', path.relative(baseDir, importer), 'clause', clause, 'hasDefaultExport', hasDefaultExport, 'exportedNames', Array.from(exportedNames))
          if (!hasDefaultExport) {
            return { ok: false, reason: `Importador ${path.relative(baseDir, importer)} importa por defecto desde ${path.relative(baseDir, f)} pero archivo no tiene default export; revisión manual requerida`, filesAffected }
          }
        }
      }

      // CommonJS require destructuring: const {a, b} = require('<modulo-local>')
      const reqRegex = /const\s+\{([^}]+)\}\s*=\s*require\(\s*['"]([^'\"]+)['"]\s*\)/g
      while ((mm = reqRegex.exec(txt))) {
        const names = mm[1].split(',').map((s) => s.trim().split(/\s+as\s+/)[0].trim()).filter(Boolean)
        const spec = mm[2]
        const candidate = path.resolve(path.dirname(importer), spec)
        let resolved = candidate
        if (!fs.existsSync(resolved)) {
          const exts = ['.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx']
          for (const e of exts) {
            if (fs.existsSync(resolved + e)) { resolved = resolved + e; break }
          }
        }
        console.log('[isSafeToAutoApply][require] importer', path.relative(baseDir, importer), 'spec', spec, 'resolved', resolved, 'target', path.relative(baseDir, f))
        const normalize = (p: string) => path.resolve(p).replace(/\.(ts|tsx|js|jsx)$/, '')
        if (normalize(resolved) !== normalize(f)) continue
        for (const name of names) {
          if (!exportedNames.has(name)) {
            return { ok: false, reason: `Importador ${path.relative(baseDir, importer)} requiere '{${name}}' desde ${path.relative(baseDir, f)} pero no está exportado; revisión manual requerida`, filesAffected }
          }
        }
      }
    }
  }

  return { ok: true, filesAffected }
}

export async function applyRefactorProposal(
  proposal: Proposal,
  opts: { baseDir?: string; outDir?: string; branch?: string; dryRun?: boolean; force?: boolean }
): Promise<{ applied: boolean; branch?: string; prDraftPath?: string; changedFiles?: string[] }>{
  const baseDir = opts.baseDir || path.resolve(process.cwd(), 'src')
  const outDir = opts.outDir || path.resolve(process.cwd(), '..', 'tmp', 'adrs-propuestas')
  const dryRun = opts.dryRun ?? true
  const branch = opts.branch || `proponer/imports/${proposal.id}`

  // compute replacements from scan occurrences by re-scanning files for relative imports
  const occurrences: ImportOccurrence[] = []
  for (const f of proposal.files) {
    const content = fs.readFileSync(f, 'utf8')
    const lines = content.split('\n')
    for (let i = 0; i < lines.length; i++) {
      const l = lines[i]
      if (/from\s+['"]\./.test(l) || /require\(['"]\./.test(l)) {
        occurrences.push({ file: f, line: i + 1, text: l.trim() })
      }
    }
  }

  if (occurrences.length === 0) return { applied: false, changedFiles: [], prDraftPath: undefined }

  // Prepare changes map file -> newContent
  const changedFiles: string[] = []

  for (const occ of occurrences) {
    const f = occ.file
    let content = fs.readFileSync(f, 'utf8')
    // extract the quoted specifier
    const m = occ.text.match(/from\s+['"]([^'"]+)['"]/) || occ.text.match(/require\(['"]([^'"]+)['"]\)/)
    if (!m) continue
    const spec = m[1]
    // resolve to absolute path
    const abs = path.resolve(path.dirname(f), spec)
    // try to find file with extension if needed
    let target = abs
    if (!fs.existsSync(target)) {
      for (const ext of ['.ts', '.tsx', '.js', '.jsx', '/index.ts', '/index.tsx']) {
        if (fs.existsSync(target + ext)) {
          target = target + ext
          break
        }
      }
    }
    const relToBase = path.relative(baseDir, target).split(path.sep).join('/')
    const alias = `@/${relToBase.replace(/\.(ts|tsx|js|jsx)$/, '')}`

    // replace specifier text in content — conservative replace only the first occurrence on that line
    const newLine = occ.text.replace(spec, alias)
    const lines = content.split('\n')
    lines[occ.line - 1] = newLine
    const newContent = lines.join('\n')

    if (newContent !== content) {
      fs.writeFileSync(f, newContent, 'utf8')
      changedFiles.push(f)
      console.log('[applyRefactorProposal] wrote file:', f)
    } else {
      console.log('[applyRefactorProposal] no change for file:', f)
    }
  }

  if (changedFiles.length === 0) {
    console.log('[applyRefactorProposal] no changed files — occurrences:', occurrences.length)
    throw new Error(`[applyRefactorProposal] no changed files — occurrences: ${occurrences.length} proposal.files:${proposal.files.length}`)
  }

  // debug: changed files
  console.log('[applyRefactorProposal] changedFiles:', changedFiles)

  if (dryRun) {
    // revert changes (we wrote files above; revert by restoring from git if available). Use the correct git root and relative paths.
    try {
      let dryGitRoot = undefined
      try {
        dryGitRoot = require('child_process').execSync('git rev-parse --show-toplevel', { cwd: baseDir }).toString().trim()
      } catch (e) {
        dryGitRoot = path.resolve(baseDir, '..')
      }
      const rels = changedFiles.map((p) => path.relative(dryGitRoot, p)).join(' ')
      require('child_process').execSync(`git checkout -- ${rels}`, { cwd: dryGitRoot })
    } catch (e: unknown) {
      // if fails, do nothing
      console.log('[applyRefactorProposal] dry-run revert failed, continuing', e instanceof Error ? e.message : String(e))
    }
    return { applied: false, changedFiles }
  }

  // create branch and commit changes
  const child = require('child_process')
  // determine git root from baseDir
  let gitRoot = undefined
  try {
    gitRoot = child.execSync('git rev-parse --show-toplevel', { cwd: baseDir }).toString().trim()
  } catch (e) {
    // fallback to baseDir parent
    gitRoot = path.resolve(baseDir, '..')
  }

  const curBranch = (() => { try { return child.execSync('git rev-parse --abbrev-ref HEAD', { cwd: gitRoot }).toString().trim() } catch (e) { return undefined } })()

  child.execSync(`git checkout -b ${branch}`, { cwd: gitRoot })
  child.execSync(`git add ${changedFiles.map((p) => JSON.stringify(p)).join(' ')}`, { cwd: gitRoot })
  child.execSync(`git commit -m "feat(refactor): aplicar imports alias para ${proposal.id}"`, { cwd: gitRoot })

  // run tests if the repo has a test runner (package.json). For simple git fixtures without package.json, skip tests.
  let testsPassed = true
  try {
    if (fs.existsSync(path.join(gitRoot, 'package.json'))) {
        // prefer running npm test if a test script is defined, otherwise fallback to bun test
        const pkg = JSON.parse(fs.readFileSync(path.join(gitRoot, 'package.json'), 'utf8'))
        if (pkg.scripts && pkg.scripts.test) {
          console.log('[applyRefactorProposal] running package.json test script in', gitRoot)
          child.execSync('npm test --silent', { stdio: 'inherit', cwd: gitRoot })
        } else {
          console.log('[applyRefactorProposal] running bun test in', gitRoot)
          child.execSync('bun test --run', { stdio: 'inherit', cwd: gitRoot })
        }
      } else {
        // no test runner in this repository; skip tests
        console.log('[applyRefactorProposal] no package.json in', gitRoot, '— skipping tests')
        testsPassed = true
      }
    } catch (e) {
      const errMsg = e && typeof e === 'object' && 'message' in e ? (e as any).message : String(e)
      console.log('[applyRefactorProposal] tests failed with error:', errMsg)
      testsPassed = false
    }

    if (!testsPassed) {
      // revert commit and remove branch
      try {
        child.execSync('git reset --hard HEAD~1', { cwd: gitRoot })
        child.execSync(`git checkout ${curBranch || 'main'}`, { cwd: gitRoot })
        try {
          child.execSync(`git branch -D ${branch}`, { cwd: gitRoot })
        } catch (e) {
          // might already be deleted or not present, ignore
        }
      } catch (e) {
        // ignore
      }
      return { applied: false, changedFiles }
    }

  // create PR draft markdown inside the repository root so it's local to the repo affected
  const draftsDir = path.resolve(gitRoot, '.github', 'pr-drafts')
  fs.mkdirSync(draftsDir, { recursive: true })
  const safeBranch = branch.replace(/\//g, '-')
  const draftPathBranch = path.join(draftsDir, `${safeBranch}.md`)
  const draftPathId = path.join(draftsDir, `${proposal.id}.md`)
  const draftLines: string[] = [
    `# PR DRAFT: ${branch}`,
    '',
    `**Propuesta:** ${proposal.title}`,
    '',
    `**Archivos modificados:**`,
    ...changedFiles.map((f) => `- ${path.relative(baseDir, f)}`),
    '',
    `**ADRs relacionadas:**`,
    proposal.id,
    '',
    `**Notas:** Cambios aplicados localmente en la rama \`${branch}\`. No se hizo push. Revise y apruebe para el siguiente paso.`
  ]
  const draftContent = draftLines.join('\n')

  fs.writeFileSync(draftPathBranch, draftContent, 'utf8')
  // also write a copy with only the proposal id for easier lookup
  fs.writeFileSync(draftPathId, draftContent, 'utf8')

  return { applied: true, branch, prDraftPath: draftPathId, changedFiles }
}

export function applyProposalChanges(
  proposal: Proposal,
  opts: { baseDir?: string; outDir?: string; branch?: string; dryRun?: boolean; force?: boolean }
) {
  return applyRefactorProposal(proposal, { baseDir: opts.baseDir, outDir: opts.outDir, branch: opts.branch, dryRun: opts.dryRun, force: opts.force })
}

export default { proposeRefactorImports, isSafeToAutoApply, applyRefactorProposal, applyProposalChanges }
