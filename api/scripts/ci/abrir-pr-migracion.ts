#!/usr/bin/env ts-node
import childProcess from 'child_process'
import process from 'process'
import fs from 'fs'
import path from 'path'
import { validarYRegistrarNombre } from '../../src/nucleo/servicios/servicio-validacion-creacion'

export type CrearPRResultado = { success: boolean; url?: string; message?: string }

function safeEscape(s: string): string {
  return s.replace(/"/g, '\\"')
}

function applyTemplate(templatePath: string, vars: Record<string, string>): string {
  let content = fs.existsSync(templatePath) ? fs.readFileSync(templatePath, 'utf8') : ''
  for (const [k, v] of Object.entries(vars)) {
    const placeholder = new RegExp(`{{\\s*${k}\\s*}}`, 'g')
    content = content.replace(placeholder, v)
  }
  return content
}

export function crearPR(branch: string, title: string, body: string, opts?: { templatePath?: string, vars?: Record<string,string>, child?: { execSync?: typeof childProcess.execSync, spawnSync?: typeof childProcess.spawnSync } }): CrearPRResultado {
  // permitir inyectar funciones de childProcess para facilitar tests aislados
  const execSyncFn = opts?.child?.execSync ?? childProcess.execSync;
  const spawnSyncFn = opts?.child?.spawnSync ?? childProcess.spawnSync;

  // Validar títulos y branch en español (evitar inglés no justificado)
  try {
    // validarYRegistrarNombre registra propuestas si detecta inglés
    void validarYRegistrarNombre(title, 'otro')
    void validarYRegistrarNombre(branch, 'otro')
  } catch (_e) {
    // No bloquear si el validador falla; el validador registra propuestas internamente
  }

  // Si existe plantilla, aplicar reemplazos
  if (opts?.templatePath && fs.existsSync(opts.templatePath)) {
    const tplBody = applyTemplate(opts.templatePath, { branch, lista_cambios: opts.vars?.lista_cambios ?? '', lista_adrs: opts.vars?.lista_adrs ?? '', git_refs: opts.vars?.git_refs ?? '' })
    body = `${tplBody}\n\n${body}`
  }

  // 1) Intentar usar gh CLI con verificación de autenticación
  if (process.env.TITAN_DEBUG_PR === '1') {
    // eslint-disable-next-line no-console
    console.error('crearPR:start', { branch, title });
  }
  try {
    const ghPath = execSyncFn('which gh').toString().trim()
    if (ghPath) {
      if (process.env.TITAN_DEBUG_PR === '1') {
        // eslint-disable-next-line no-console
        console.error('crearPR:detected gh at', ghPath)
      }
      try {
        const authRes = spawnSyncFn('gh', ['auth', 'status', '--hostname', 'github.com'], { encoding: 'utf8' })
        const authOut = (authRes.stdout || '') + (authRes.stderr || '')
        if (authRes.status !== 0 || /You are not logged in|Not logged in/i.test(String(authOut))) {
          if (process.env.TITAN_DEBUG_PR === '1') {
            // eslint-disable-next-line no-console
            console.error('crearPR:gh not authenticated', { status: authRes.status, out: authOut })
          }
          return { success: false, message: 'gh CLI no autenticado. Ejecuta `gh auth login` y reintenta.' }
        }
      } catch (_e) {
        if (process.env.TITAN_DEBUG_PR === '1') {
          // eslint-disable-next-line no-console
          console.error('crearPR:gh auth check threw', String(_e))
        }
        return { success: false, message: 'gh CLI no autenticado o falló verificación de auth.' }
      }

      // Intentar crear PR con gh y parsear respuesta
      try {
        const cmd = `gh pr create --title "${safeEscape(title)}" --body "${safeEscape(body)}" --base main --head ${branch} --draft --json url`
        const outRaw = execSyncFn(cmd, { stdio: 'pipe' })
        const out = outRaw && typeof outRaw === 'object' && typeof outRaw.toString === 'function' ? outRaw.toString() : String(outRaw)
        if (process.env.TITAN_DEBUG_PR === '1') {
          // eslint-disable-next-line no-console
          console.error('crearPR: gh pr create output:', out)
        }
        try {
          const parsed = JSON.parse(out)
          if (parsed && parsed.url) {
            if (process.env.TITAN_DEBUG_PR === '1') {
              // eslint-disable-next-line no-console
              console.error('crearPR:gh returned url', parsed.url)
            }
            return { success: true, url: parsed.url }
          }
        } catch (_e) {
          const match = out.match(/https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/pull\/\d+/)
          if (match) return { success: true, url: match[0] }
          return { success: true, message: out.trim() }
        }
      } catch (_e) {
        if (process.env.TITAN_DEBUG_PR === '1') {
          // eslint-disable-next-line no-console
          console.error('crearPR: gh pr create falló:', _e && _e.message ? _e.message : String(_e))
        }
      }
    }
  } catch (e: any) {
    // gh no disponible o falló; continuar a fallback
      if (process.env.TITAN_DEBUG_PR === '1') {
        // eslint-disable-next-line no-console
        console.error('crearPR:which gh threw', String(e))
      }
  }

  // 2) Fallback con token GITHUB_TOKEN -> curl API
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN
  if (token) {
    try {
      const remote = execSyncFn('git remote get-url origin').toString().trim()
      const m = remote.match(/[:/]([^/]+)\/([^/.]+)(?:.git)?$/)
      if (m) {
        const owner = m[1]
        const repo = m[2]
        const payload = JSON.stringify({ title, head: branch, base: 'main', body })
        const curl = `curl -s -X POST -H "Authorization: token ${token}" -H "Accept: application/vnd.github+json" -H "Content-Type: application/json" -d '${payload}' https://api.github.com/repos/${owner}/${repo}/pulls`
        const out = execSyncFn(curl, { stdio: 'pipe' }).toString()
        try {
          const parsed = JSON.parse(out)
          if (parsed && parsed.html_url) return { success: true, url: parsed.html_url }
        } catch (_e) {
          // continuar a push fallback
        }
      }
    } catch (_e) {
      // ignore and continue to push fallback
    }
  }

  // 3) Fallback final: empujar branch y pedir creación manual
  try {
    execSyncFn(`git push -u origin ${branch}`, { stdio: 'inherit' })
    return { success: true, message: 'Branch empujado; crea PR manualmente en GitHub.' }
  } catch (e: any) {
    return { success: false, message: e?.message ?? 'Error desconocido al empujar branch' }
  }
}

if (require.main === module) {
  const argv = process.argv.slice(2)
  const branch = argv[0]
  const title = argv[1] ?? `Migración Node→Bun: ${branch}`
  const body = argv.slice(2).join('\n') || 'PR de migración automática generada por scripts/ci'
  const tpl = path.resolve(process.cwd(), '.github/PULL_REQUEST_TEMPLATE/pr-migracion.md')
  const res = crearPR(branch, title, body, { templatePath: tpl })
  if (!res.success) process.exit(1)
  console.log('PR creada (o branch pushed):', res.url ?? res.message ?? '(sin URL)')
}
