import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import { run } from '../../scripts/servicios/limpieza-repo'

describe('servicio limpieza-repo', () => {
  it('lista sin error en dry-run', async () => {
    const res = await run({ dryRun: true, olderThanDays: 0, apply: false })
    expect(res).toHaveProperty('found')
    expect(typeof res.found).toBe('number')
  })

  it('auto-approve dry-run no falla', async () => {
    const res = await run({ dryRun: true, olderThanDays: 0, apply: true, autoApprove: true })
    expect(res).toHaveProperty('found')
    expect(typeof res.found).toBe('number')
  }, 10000)
})
