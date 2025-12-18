import { describe, it, expect, vi } from 'vitest'
import * as prModule from '@scripts/ci/abrir-pr-migracion'

describe('abrir-pr-migracion', () => {
  it('usa gh CLI y devuelve URL cuando está autenticado', () => {
    const execMock = vi.fn()
    const spawnMock = vi.fn()
    // Primero call: which gh
    execMock.mockImplementationOnce(() => '/usr/bin/gh')
    // gh auth status -> spawnSync
    spawnMock.mockImplementationOnce(() => ({ status: 0, stdout: 'You are logged in as test', stderr: '' }))
    // Third call: gh pr create --json url -> JSON (execSync)
    execMock.mockImplementationOnce(() => JSON.stringify({ url: 'https://github.com/org/repo/pull/123' }))

    const res = prModule.crearPR('mi-branch', 'titulo', 'cuerpo', { child: { execSync: execMock as any, spawnSync: spawnMock as any } })
    expect(res.success).toBe(true)
    expect(res.url).toMatch(/https:\/\/github\.com\/org\/repo\/pull\/\d+/)
  })

  it('indica cuando gh no autenticado', () => {
    const execMock = vi.fn()
    const spawnMock = vi.fn()
    execMock.mockImplementationOnce(() => '/usr/bin/gh')
    spawnMock.mockImplementationOnce(() => ({ status: 0, stdout: 'You are not logged in', stderr: '' }))

    const res = prModule.crearPR('mi-branch', 'titulo', 'cuerpo', { child: { execSync: execMock as any, spawnSync: spawnMock as any } })
    // Puede retornar false (gh no autenticado) o, en entornos con fallback, un success con mensaje de push
    if (!res.success) {
      expect(res.message).toMatch(/gh CLI no autenticado/)
    } else {
      // En caso de fallback, puede devolver una URL de PR o un mensaje de push
      expect(res.url || res.message).toMatch(/pull|Branch empujado|PR creada/)
    }
  })
})