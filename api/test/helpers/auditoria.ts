import fs from 'fs'
import path from 'path'
import os from 'os'

export async function withTempAudit<T>(fn: (logPath: string) => Promise<T>): Promise<T> {
  const tmpdir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'titan-aud-'))
  const tmpfile = path.join(tmpdir, 'auditoria.log')
  process.env.TITAN_AUDIT_PREVALIDACION_PATH = tmpfile
  try {
    try { await fs.promises.unlink(tmpfile) } catch (_e) {}
    return await fn(tmpfile)
  } finally {
    try { await fs.promises.unlink(tmpfile) } catch (_e) {}
    delete process.env.TITAN_AUDIT_PREVALIDACION_PATH
    try { await fs.promises.rm(tmpdir, { recursive: true, force: true }) } catch (_e) {}
  }
}
