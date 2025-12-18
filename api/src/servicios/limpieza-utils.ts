import fs from 'fs'

export type AutoApproveOptions = {
  maintainers?: string[]
  maxSizeForMaintainer?: number // chars
  allowLongTermAuto?: boolean
  longTermDays?: number
}

import { recordAutoApproveMetric } from '@nucleo/telemetria/auto-approve-metrics'
import path from 'path'

export function parseFrontMatter(content: string): Record<string, string> {
  const fmRegex = /^---\n([\s\S]*?)\n---/m
  const m = content.match(fmRegex)
  if (!m) return {}
  const fm: Record<string, string> = {}
  const body = m[1]
  for (const line of body.split('\n')) {
    const kv = line.split(':')
    if (kv.length >= 2) {
      const key = kv[0].trim().toLowerCase()
      const val = kv.slice(1).join(':').trim()
      fm[key] = val
    }
  }
  return fm
}

export function shouldAutoApprove(filePath: string, opts: AutoApproveOptions = {}): { ok: boolean; reason?: string; rule?: string } {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    const contentLower = content.toLowerCase()
    const fm = parseFrontMatter(content)

    // Explicit approval in frontmatter or content
    if ((fm['aprobado'] && fm['aprobado'].toLowerCase() === 'true') || contentLower.includes('estado: aprobado') || contentLower.includes('aprobado: true')) {
      const reason = 'aprobación explícita'
      try { recordAutoApproveMetric({ ts: new Date().toISOString(), file: filePath, ok: true, reason, rule: 'explicit-approval' }) } catch (e) {}
      return { ok: true, reason, rule: 'explicit-approval' }
    }

    // Explicit auto-approve marker
    if ((fm['auto-approve'] && ['yes', 'true', 'si'].includes(fm['auto-approve'].toLowerCase())) || contentLower.includes('auto-approve:') || contentLower.includes('autoaprobar')) {
      const reason = 'marca automática'
      try { recordAutoApproveMetric({ ts: new Date().toISOString(), file: filePath, ok: true, reason, rule: 'explicit-mark' }) } catch(e) {}
      return { ok: true, reason, rule: 'explicit-mark' }
    }

    // Maintainer shortcut: autor en lista de maintainers y contenido pequeño
    const author = fm['autor'] || fm['author'] || ''
    const maintainers = (opts.maintainers ?? []).map((s) => s.toLowerCase())
    const maxSize = opts.maxSizeForMaintainer ?? 800
    if (author && maintainers.includes(author.toLowerCase()) && content.length <= maxSize) {
      const reason = 'autor es maintainer y cambio pequeño'
      try { recordAutoApproveMetric({ ts: new Date().toISOString(), file: filePath, ok: true, reason, rule: 'maintainer-shortcut' }) } catch(e) {}
      return { ok: true, reason, rule: 'maintainer-shortcut' }
    }

    // Long-term proposal auto-apply (conservador): muy antiguo y allowLongTermAuto
    if (opts.allowLongTermAuto && typeof opts.longTermDays === 'number') {
      try {
        const stat = fs.statSync(filePath)
        const days = Math.floor((Date.now() - stat.mtime.getTime()) / (1000 * 60 * 60 * 24))
        if (days >= opts.longTermDays && content.length < 2000) {
          try { recordAutoApproveMetric({ ts: new Date().toISOString(), file: filePath, ok: true, reason: 'propuesta antigua y auto-allow', rule: 'long-term' }) } catch(e) {}
          return { ok: true, reason: 'propuesta antigua y auto-allow', rule: 'long-term' }
        }
      } catch {
        // noop
      }
    }

    // Nueva heurística conservadora: confianza explícita en frontmatter (confianza: alta)
    if (fm['confianza'] && fm['confianza'].toLowerCase() === 'alta') {
      try { recordAutoApproveMetric({ ts: new Date().toISOString(), file: filePath, ok: true, reason: 'confianza alta en frontmatter', rule: 'frontmatter-confidence' }) } catch(e) {}
      return { ok: true, reason: 'confianza alta en frontmatter', rule: 'frontmatter-confidence' }
    }

    // If maintainers option not passed, try to read from package.json maintainers
    if (!opts.maintainers) {
      try {
        const pkg = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json'), 'utf8'))
        if (Array.isArray(pkg.maintainers)) opts.maintainers = pkg.maintainers
      } catch (e) {
        // noop
      }
    }

    // Additional heuristics:
    // - allow docs and also auto-generated index files that only re-export (index.ts / indice.ts)
    const ext = filePath.split('.').pop()?.toLowerCase() || ''
    const baseName = filePath.split('/').pop()?.toLowerCase() || ''
    const allowedExts = ['md', 'propuesta', 'json', 'yml', 'yaml']

    // Reject package.json changes from auto-approve for safety
    if (baseName === 'package.json') {
      try { recordAutoApproveMetric({ ts: new Date().toISOString(), file: filePath, ok: false, reason: 'package.json no apto para auto-approve', rule: 'package-json' }) } catch(e) {}
      return { ok: false, reason: 'package.json no apto para auto-approve', rule: 'package-json' }
    }

    // Allow TypeScript index files that only contain re-exports (safe for auto-approve)
    if (ext === 'ts' && (baseName === 'index.ts' || baseName === 'indice.ts')) {
      const onlyReExports = content
        .split('\n')
        .every((l) => l.trim() === '' || /^export\s+(\*\s+from|(\{.*\})\s+from)\s+['"]\./.test(l) || /^\/\/|^\/\*/.test(l))
      if (onlyReExports) {
        try { recordAutoApproveMetric({ ts: new Date().toISOString(), file: filePath, ok: true, reason: 'archivo índice re-export (auto-aprobado)', rule: 'index-reexport' }) } catch(e) {}
        return { ok: true, reason: 'archivo índice re-export (auto-aprobado)', rule: 'index-reexport' }
      }
    }

    // - only allow auto-approve for content types that are non-code (md, propuesta, json, yml)
    if (!allowedExts.includes(ext)) {
      try { recordAutoApproveMetric({ ts: new Date().toISOString(), file: filePath, ok: false, reason: 'extensión no segura para auto-approve', rule: 'extensión' }) } catch(e) {}
      return { ok: false, reason: 'extensión no segura para auto-approve', rule: 'extensión' }
    }

    // - avoid approving files containing code blocks
    if (content.includes('```')) {
      try { recordAutoApproveMetric({ ts: new Date().toISOString(), file: filePath, ok: false, reason: 'contiene bloques de código', rule: 'code-block' }) } catch(e) {}
      return { ok: false, reason: 'contiene bloques de código', rule: 'code-block' }
    }

    // Nota: la regla "md corto" se desactivó por seguridad para evitar aprobar
    // cambios de markdown genéricos sin una marca explícita (auto-approve/aprobado).
    // Si en el futuro se desea una política más permisiva, introducir una opción
    // de configuración o requerir un frontmatter explícito.

    // - avoid approving files that look like source code (imports/exports)
    if (/^\s*(import|export|require)\s+/m.test(content)) {
      try { recordAutoApproveMetric({ ts: new Date().toISOString(), file: filePath, ok: false, reason: 'archivo contiene código o imports/exports', rule: 'code-imports' }) } catch(e) {}
      return { ok: false, reason: 'archivo contiene código o imports/exports', rule: 'code-imports' }
    }

    // Default: no auto-approve
    try { recordAutoApproveMetric({ ts: new Date().toISOString(), file: filePath, ok: false, reason: 'no cumple heurísticas seguras', rule: 'default' }) } catch(e) {}
    return { ok: false, reason: 'no cumple heurísticas seguras', rule: 'default' }
  } catch (e) {
    return { ok: false, reason: 'error al evaluar auto-approve', rule: 'error' }
  }
}
