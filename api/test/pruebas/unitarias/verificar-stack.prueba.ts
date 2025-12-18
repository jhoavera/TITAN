import { describe, it, expect } from 'vitest'
import * as vs from '@comun/utilidades/verificar-stack'

describe('verificar-stack utilities', () => {
  it('detects Bun via mocked env var', () => {
    const orig = process.env.BUN_INSTALL
    process.env.BUN_INSTALL = '/fake'
    expect(vs.isRunningOnBun()).toBe(true)
    process.env.BUN_INSTALL = orig
  })

  it('returns false when no bun indicators', () => {
    const orig = process.env.BUN_INSTALL
    delete process.env.BUN_INSTALL
    expect(vs.isRunningOnBun()).toBe(false)
    if (orig) process.env.BUN_INSTALL = orig
  })
})
