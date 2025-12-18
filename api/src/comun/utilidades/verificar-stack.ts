export function isRunningOnBun(): boolean {
  // Bun exposes a global `Bun` object; also process.release.name may include 'bun'
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (typeof Bun !== 'undefined') return true
  } catch (_e) {}
  try {
    // Node-compatible fallback: check env var
    if (process.env.BUN_INSTALL) return true
  } catch (_e) {}
  try {
    // process.release may exist
    if ((process as any).release && String((process as any).release.name).toLowerCase().includes('bun')) return true
  } catch (_e) {}
  return false
}

export function ensureRunningOnBunOrExit() {
  if (!isRunningOnBun()) {
    console.error('ERROR: Este script requiere Bun (v1.1.8+). Ejecute con `bun` según el stack del proyecto.')
    process.exit(2)
  }
}
