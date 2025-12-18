#!/usr/bin/env node
import { execSync } from 'child_process'
import semver from 'semver'

declare const Bun: any

const REQUIRED_BUN = '1.1.8'

function checkBun(): { ok: boolean; info?: string } {
  try {
    // prefer Bun global
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (typeof Bun !== 'undefined' && (Bun as any).version) {
      const v = (Bun as any).version
      return { ok: semver.gte(v, REQUIRED_BUN), info: v }
    }
  } catch (_e) {}

  try {
    const out = execSync('bun --version', { encoding: 'utf8' }).trim()
    const v = out.split('\n')[0].trim()
    return { ok: semver.gte(v, REQUIRED_BUN), info: v }
  } catch (e:any) {
    return { ok: false }
  }
}

function main() {
  const b = checkBun()
  if (!b.ok) {
    console.error('Stack check: Bun no encontrado o versión insuficiente (se requiere >= ' + REQUIRED_BUN + ')', b.info ? 'encontrado: ' + b.info : '')
    process.exit(1)
  }
  console.log('Stack check: Bun OK (' + b.info + ')')
}

if (require.main === module) main()

export default { checkBun }
