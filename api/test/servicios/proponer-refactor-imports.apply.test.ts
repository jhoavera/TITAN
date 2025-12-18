import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import { isSafeToAutoApply, applyProposalChanges } from '../../src/servicios/proponer-refactor-imports'
import { execSync } from 'child_process'

const TEST_DIR = path.resolve(__dirname, 'fixtures', 'proponer-imports-apply')
const SRC_DIR = path.join(TEST_DIR, 'src')

beforeEach(() => {
  fs.rmSync(TEST_DIR, { recursive: true, force: true })
  fs.mkdirSync(SRC_DIR, { recursive: true })
  // setup git repo
  execSync('git init', { cwd: TEST_DIR })
  execSync('git config user.email test@example.com', { cwd: TEST_DIR })
  execSync('git config user.name test', { cwd: TEST_DIR })

  // files
  fs.mkdirSync(path.join(SRC_DIR, 'mod'), { recursive: true })
  fs.writeFileSync(path.join(SRC_DIR, 'mod', 'a.ts'), `import { b } from './b'\nexport const a = 1`)
  fs.writeFileSync(path.join(SRC_DIR, 'mod', 'b.ts'), `export const b = 2`)
})

afterEach(() => {
  fs.rmSync(TEST_DIR, { recursive: true, force: true })
})

describe('applyProposalChanges', () => {
  it('isSafeToAutoApply returns true for small proposal and apply actually modifies files in non-dry mode', async () => {
    // craft a fake proposal
    const proposal = {
      id: 'TEST-1',
      title: 'Propuesta test',
      files: [path.join(SRC_DIR, 'mod', 'a.ts')],
      examples: [{ file: path.join(SRC_DIR, 'mod', 'a.ts'), line: 1, text: "import { b } from './b'" }],
      rationale: 'test',
      proposed_changes: ["Sugerir usar alias"]
    }

    const safe = await isSafeToAutoApply(proposal, { maxFiles: 5 })
    expect(safe.ok).toBe(true)

    // commit initial files
    execSync('git add -A', { cwd: TEST_DIR })
    execSync('git commit -m "initial"', { cwd: TEST_DIR })

    const resultDry = await applyProposalChanges(proposal, { baseDir: SRC_DIR, branch: `proponer/${proposal.id}`, dryRun: true })
    expect(resultDry.applied).toBe(false)

    const result = await applyProposalChanges(proposal, { baseDir: SRC_DIR, branch: `proponer/${proposal.id}`, dryRun: false })
    expect(result.applied).toBe(true)

    // check that branch exists
    const branches = execSync('git branch', { cwd: TEST_DIR }).toString()
    expect(branches).toContain(`proponer/${proposal.id}`)

    // pr draft created
    const prPath = path.join(TEST_DIR, '.github', 'pr-drafts', `${proposal.id}.md`)
    expect(fs.existsSync(prPath)).toBe(true)
  })
})
