import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'
import { main as revisarIdioma } from '@scripts/revisar-idioma'
import { proposeRefactorImports } from '@servicios/proponer-refactor-imports'
import { applyProposalChanges } from '@servicios/proponer-refactor-imports'

const FIX = path.resolve(__dirname, 'fixtures', 'revision-flow')

function setupFixture(passTests = true) {
  fs.rmSync(FIX, { recursive: true, force: true })
  fs.mkdirSync(path.join(FIX, 'src', 'mod'), { recursive: true })
  // file with Spanish term to be detected
  fs.writeFileSync(path.join(FIX, 'src', 'migrations_note.ts'), '// referencia a migraciones (auto-detect)')
  // module files to be refactored
  fs.writeFileSync(path.join(FIX, 'src', 'mod', 'a.ts'), `import { b } from './b'\nexport const a = 1`)
  fs.writeFileSync(path.join(FIX, 'src', 'mod', 'b.ts'), `export const b = 2`)
  // init git
  execSync('git init', { cwd: FIX })
  execSync('git config user.email test@example.com', { cwd: FIX })
  execSync('git config user.name test', { cwd: FIX })
  execSync('git add -A', { cwd: FIX })
  execSync('git commit -m "initial"', { cwd: FIX })
  // package.json to control test runner
  const pkg = { name: 'fixture-revision', version: '1.0.0', scripts: { test: passTests ? 'echo OK' : 'exit 1' } }
  fs.writeFileSync(path.join(FIX, 'package.json'), JSON.stringify(pkg, null, 2))
}

describe('revisar-idioma → generar-plan → aplicar', () => {
  it('generates report and plan and successfully applies proposal when tests pass', async () => {
    setupFixture(true)
    const outReport = path.join(FIX, 'reports', 'reporte-refactor-idioma.json')
    // run revisar-idioma
    await revisarIdioma(FIX, outReport)
    expect(fs.existsSync(outReport)).toBe(true)
    const report = JSON.parse(fs.readFileSync(outReport, 'utf-8'))
    expect(Array.isArray(report.reporte)).toBe(true)

    // run plan generator (uses script) — may produce fallback if script fails, but should create plan
    const genScript = path.resolve(__dirname, '../../scripts/ci/generar-plan-refactor.ts')
    try { execSync(`bun ${genScript}`, { cwd: FIX, stdio: 'inherit' }) } catch (_) {}
    const planPath = path.join(FIX, 'reports', 'plan-refactor-idioma.json')
    expect(fs.existsSync(planPath)).toBe(true)

    // craft a proposal by scanning the fixture src for relative imports
    const res = await proposeRefactorImports({ baseDir: path.join(FIX, 'src'), outDir: path.join(FIX, 'tmp-adrs'), dryRun: true })
    expect(res.proposals.length).toBeGreaterThan(0)
    const prop = res.proposals[0]

    // apply (should succeed because package.json test passes)
    const result = await applyProposalChanges(prop, { baseDir: path.join(FIX, 'src'), branch: `prueba/${prop.id}`, dryRun: false })
    expect(result.applied).toBe(true)

    // pr draft exists in repo
    const draft = path.join(FIX, '.github', 'pr-drafts', `${prop.id}.md`)
    expect(fs.existsSync(draft)).toBe(true)
  })

  it('reverts changes and does not create branch when tests fail', async () => {
    setupFixture(false)
    const outReport = path.join(FIX, 'reports', 'reporte-refactor-idioma.json')
    await revisarIdioma(FIX, outReport)
    const res = await proposeRefactorImports({ baseDir: path.join(FIX, 'src'), outDir: path.join(FIX, 'tmp-adrs'), dryRun: true })
    const prop = res.proposals[0]

    const result = await applyProposalChanges(prop, { baseDir: path.join(FIX, 'src'), branch: `prueba/${prop.id}`, dryRun: false })
    expect(result.applied).toBe(false)

    // branch should not exist
    const branches = execSync('git branch', { cwd: FIX }).toString()
    expect(branches).not.toContain(`prueba/${prop.id}`)

    // draft should not exist
    const draft = path.join(FIX, '.github', 'pr-drafts', `${prop.id}.md`)
    expect(fs.existsSync(draft)).toBe(false)
  })
})
