import { describe, it, expect, afterEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import { shouldAutoApprove } from '@servicios/limpieza-utils'

const tmpDir = path.resolve(__dirname, 'tmp-auto-approve-extended')
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })

afterEach(() => {
  for (const f of fs.readdirSync(tmpDir)) {
    const p = path.join(tmpDir, f)
    const stat = fs.statSync(p)
    if (stat.isDirectory()) fs.rmSync(p, { recursive: true, force: true })
    else fs.unlinkSync(p)
  }
})

describe('shouldAutoApprove - extended rules', () => {
  it('rejects package.json modifications', () => {
    const file = path.join(tmpDir, 'package.json')
    const content = `{"name":"mal","version":"1.0.0"}`
    fs.writeFileSync(file, content, 'utf8')
    const res = shouldAutoApprove(file)
    expect(res.ok).toBe(false)
    expect(res.reason).toContain('package.json')
    expect(res.rule).toBe('package-json')
  })

  it('approves index re-export files', () => {
    const file = path.join(tmpDir, 'index.ts')
    const content = `export * from './mod'
export * from './otro'`
    fs.writeFileSync(file, content, 'utf8')
    const res = shouldAutoApprove(file)
    expect(res.ok).toBe(true)
    expect(res.rule).toBe('index-reexport')
  })

  it('rejects files containing imports/exports in proposal content', () => {
    const file = path.join(tmpDir, 'prop.md')
    const content = `import fs from 'fs'\nexport const q = 1`
    fs.writeFileSync(file, content, 'utf8')
    const res = shouldAutoApprove(file)
    expect(res.ok).toBe(false)
    expect(res.rule).toBe('code-imports')
  })

  it('respects max size for maintainers', () => {
    const file = path.join(tmpDir, 'small.md')
    const content = `---\ntitulo: prueba\nautor: titan-admin\n---\n` + 'a'.repeat(50)
    fs.writeFileSync(file, content, 'utf8')
    const res = shouldAutoApprove(file, { maintainers: ['titan-admin'], maxSizeForMaintainer: 200 })
    expect(res.ok).toBe(true)
  })

  it('approves short markdown (md-small)', () => {
    const file = path.join(tmpDir, 'short.md')
    const content = `# Nota\n\nCambio menor en el documento de estado.`
    fs.writeFileSync(file, content, 'utf8')
    const res = shouldAutoApprove(file)
    expect(res.ok).toBe(true)
    expect(res.rule).toBe('md-small')
  })

  it('approves small json glosario-like files (json-small)', () => {
    const dir = path.join(tmpDir, 'data')
    fs.mkdirSync(dir, { recursive: true })
    const file = path.join(dir, 'termino.json')
    const content = JSON.stringify({ termino: 'prueba', definicion: 'Definición para pruebas' })
    fs.writeFileSync(file, content, 'utf8')
    const res = shouldAutoApprove(file)
    expect(res.ok).toBe(true)
    expect(res.rule).toBe('json-small')
  })

  it('auto-approves old glossary proposals when allowLongTermAuto is enabled (glossary-proposal)', () => {
    const pdir = path.join(tmpDir, 'documentacion-fuente-unica-verdad', 'glosario-biblioteca', 'propuestas')
    fs.mkdirSync(pdir, { recursive: true })
    const file = path.join(pdir, 'propuesta-antigua.md')
    fs.writeFileSync(file, '# Propuesta de Glosario: antigua\nContenido', 'utf8')
    // force mtime in the past
    const old = Date.now() - 1000 * 60 * 60 * 24 * 365
    fs.utimesSync(file, old / 1000, old / 1000)
    const res = shouldAutoApprove(file, { allowLongTermAuto: true, longTermDays: 30 })
    expect(res.ok).toBe(true)
    expect(res.rule).toBe('glossary-proposal')
  })

  it('approves short docs inside documentacion (doc-only)', () => {
    const pdir = path.join(tmpDir, 'documentacion-fuente-unica-verdad')
    fs.mkdirSync(pdir, { recursive: true })
    const file = path.join(pdir, 'nota.md')
    fs.writeFileSync(file, '# Notas\nContenido de documentación corto y sin código', 'utf8')
    const res = shouldAutoApprove(file)
    expect(res.ok).toBe(true)
    // aceptar doc-only o md-small según orden interno de heurísticas
    expect(['doc-only', 'md-small']).toContain(res.rule)
  })

  it('approves changelog files (changelog)', () => {
    const file = path.join(tmpDir, 'CHANGELOG.md')
    const content = `# Changelog\n\n- Cambios menores de texto y documentación.`
    fs.writeFileSync(file, content, 'utf8')
    const res = shouldAutoApprove(file)
    expect(res.ok).toBe(true)
    expect(res.rule).toBe('changelog')
  })

  it('approves small reports in reports/ (report-small)', () => {
    const pdir = path.join(tmpDir, 'reports')
    fs.mkdirSync(pdir, { recursive: true })
    const file = path.join(pdir, 'reporte.md')
    fs.writeFileSync(file, '# Reporte\nContenido resumen', 'utf8')
    const res = shouldAutoApprove(file)
    expect(res.ok).toBe(true)
    expect(res.rule).toBe('report-small')
  })

  it('approves small translation proposals (translation-suggestion)', () => {
    const pdir = path.join(tmpDir, 'ad-rs', 'propuestas')
    fs.mkdirSync(pdir, { recursive: true })
    const file = path.join(pdir, 'traduccion.md')
    fs.writeFileSync(file, '# Propuesta de traducción\nTraducción propuesta: cambiar nombre de la variable', 'utf8')
    const res = shouldAutoApprove(file)
    expect(res.ok).toBe(true)
    expect(res.rule).toBe('translation-suggestion')
  })
})
