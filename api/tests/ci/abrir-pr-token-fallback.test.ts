import { describe, it, expect, vi } from 'vitest'
import * as prModule from '../../scripts/ci/abrir-pr-migracion'

describe('abrir-pr-migracion token fallback', () => {
  it('usa curl + GITHUB_TOKEN cuando gh no está presente', () => {
    const execMock = vi.fn()
    // which gh -> throw (no gh)
    execMock.mockImplementationOnce(() => { throw new Error('no gh') })
    // git remote get-url origin
    execMock.mockImplementationOnce(() => 'git@github.com:org/repo.git')
    // curl response JSON
    execMock.mockImplementationOnce(() => JSON.stringify({ html_url: 'https://github.com/org/repo/pull/321' }))

    process.env.GITHUB_TOKEN = 'fake-token'
    const res = prModule.crearPR('branch-test', 'titulo en español', 'cuerpo de PR', { child: { execSync: execMock as any } })
    expect(res.success).toBe(true)
    expect(res.url).toMatch(/https:\/\/github\.com\/org\/repo\/pull\/\d+/)

    delete process.env.GITHUB_TOKEN
  })
})
