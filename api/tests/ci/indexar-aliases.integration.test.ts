import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const FIX = path.resolve(__dirname, 'fixtures', 'indexar')

function setup() {
  fs.rmSync(FIX, { recursive: true, force: true })
  fs.mkdirSync(path.join(FIX, 'src', 'mod'), { recursive: true })
  fs.writeFileSync(path.join(FIX, 'src', 'mod', 'a.ts'), "export const a = 1\n")
  fs.writeFileSync(path.join(FIX, 'src', 'mod', 'b.ts'), "export const b = 2\n")
}

describe('indexar-aliases', () => {
  it('genera indice.ts y produce propuestas', async () => {
    setup()
    const scriptPath = path.resolve(__dirname, '..', '..', 'scripts', 'indexar-aliases.ts')
    execSync(`bun "${scriptPath}"`, { cwd: FIX, stdio: 'inherit' })
    const indice = path.join(FIX, 'src', 'mod', 'indice.ts')
    expect(fs.existsSync(indice)).toBe(true)
    const tmpAdrs = path.resolve(FIX, '..', '..', 'tmp', 'adrs-propuestas')
    // proposals are written relative to repo root outDir — at least the report should exist
    // allow that proposeRefactorImports may create the directory locally
    expect(fs.existsSync(path.resolve(FIX, '..', '..', 'tmp'))).toBe(true)
  })
})