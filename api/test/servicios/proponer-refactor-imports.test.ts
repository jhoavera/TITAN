import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import { proposeRefactorImports } from '../../src/servicios/proponer-refactor-imports'

const FIXTURE_DIR = path.resolve(__dirname, 'fixtures', 'proponer-imports')
const OUT_DIR = path.resolve(__dirname, 'tmp-adrs')

beforeEach(() => {
  // preparar fixture
  fs.rmSync(OUT_DIR, { recursive: true, force: true })
  fs.rmSync(FIXTURE_DIR, { recursive: true, force: true })
  fs.mkdirSync(FIXTURE_DIR, { recursive: true })

  // archivo con import relativo
  fs.writeFileSync(path.join(FIXTURE_DIR, 'modulo-a.ts'), `import { b } from './sub/modulo-b'\nexport const a = 1`)
  fs.mkdirSync(path.join(FIXTURE_DIR, 'sub'), { recursive: true })
  fs.writeFileSync(path.join(FIXTURE_DIR, 'sub', 'modulo-b.ts'), `export const b = 2`)
})

afterEach(() => {
  fs.rmSync(OUT_DIR, { recursive: true, force: true })
  fs.rmSync(FIXTURE_DIR, { recursive: true, force: true })
})

describe('proponerRefactorImports', () => {
  it('genera ADRs en modo dry-run sin modificar codigo', async () => {
    const res = await proposeRefactorImports({ baseDir: FIXTURE_DIR, outDir: OUT_DIR, dryRun: true })

    expect(res.proposals.length).toBeGreaterThan(0)
    const report = JSON.parse(fs.readFileSync(path.join(OUT_DIR, 'report.json'), 'utf8'))
    expect(report.proposalsCount).toBe(res.proposals.length)

    // comprobar que los archivos ADR existen
    for (const ad of res.adrs) {
      expect(fs.existsSync(ad)).toBe(true)
      const content = fs.readFileSync(ad, 'utf8')
      expect(content).toContain('Estado: propuesta')
      expect(content).toContain('Archivos afectados')
    }

    // código fuente no modificado
    const src = fs.readFileSync(path.join(FIXTURE_DIR, 'modulo-a.ts'), 'utf8')
    expect(src).toContain("import { b } from './sub/modulo-b'")
  })
})
