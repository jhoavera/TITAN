import { describe, it, expect, afterEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import { shouldAutoApprove } from '../../src/servicios/limpieza-utils'

const tmpDir = path.resolve(__dirname, 'tmp-auto-approve')
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true })

afterEach(() => {
  // limpiar tmp
  for (const f of fs.readdirSync(tmpDir)) fs.unlinkSync(path.join(tmpDir, f))
})

describe('heurísticas auto-approve', () => {
  it('aprueba con frontmatter aprobado: true', () => {
    const file = path.join(tmpDir, 'aprobado.md')
    const content = `---\ntitulo: prueba\nautor: juan\naprobado: true\n---\nContenido de la propuesta` 
    fs.writeFileSync(file, content, 'utf8')
    const res = shouldAutoApprove(file)
    expect(res.ok).toBe(true)
    expect(res.reason).toContain('aprobación explícita')
  })

  it('aprueba si autor es maintainer y cambio pequeño', () => {
    const file = path.join(tmpDir, 'maintainer.md')
    const content = `---\ntitulo: pequeña modificación\nautor: titan-admin\n---\nUna línea pequeña` 
    fs.writeFileSync(file, content, 'utf8')
    const res = shouldAutoApprove(file, { maintainers: ['titan-admin'], maxSizeForMaintainer: 200 })
    expect(res.ok).toBe(true)
    expect(res.reason).toContain('autor es maintainer')
  })

  it('rechaza si no cumple reglas', () => {
    const file = path.join(tmpDir, 'no.md')
    const content = `---\ntitulo: propuesta\nautor: alguien\n---\nContenido genérico sin marcas` 
    fs.writeFileSync(file, content, 'utf8')
    const res = shouldAutoApprove(file)
    expect(res.ok).toBe(false)
  })

  it('aprueba si contiene auto-approve en frontmatter', () => {
    const file = path.join(tmpDir, 'auto.md')
    const content = `---\ntitulo: propuesta\nauto-approve: yes\n---\nContenido` 
    fs.writeFileSync(file, content, 'utf8')
    const res = shouldAutoApprove(file)
    expect(res.ok).toBe(true)
  })

  it('aprueba si frontmatter indica confianza: alta', () => {
    const file = path.join(tmpDir, 'confianza.md')
    const content = `---\ntitulo: propuesta\nconfianza: alta\n---\nContenido` 
    fs.writeFileSync(file, content, 'utf8')
    const res = shouldAutoApprove(file)
    expect(res.ok).toBe(true)
    expect(res.reason).toContain('confianza alta')
  })

  it('rechaza archivos con bloques de código', () => {
    const file = path.join(tmpDir, 'code.md')
    const content = `---\ntitulo: codigo\n---\n\`\`\`js\nconsole.log('hola')\n\`\`\`\n` 
    fs.writeFileSync(file, content, 'utf8')
    const res = shouldAutoApprove(file)
    expect(res.ok).toBe(false)
    expect(res.reason).toContain('bloques de código')
  })

  it('rechaza archivos con imports/exports', () => {
    const file = path.join(tmpDir, 'source.propuesta')
    const content = `export const x = 1` 
    fs.writeFileSync(file, content, 'utf8')
    const res = shouldAutoApprove(file)
    expect(res.ok).toBe(false)
    expect(res.reason).toContain('imports/exports')
  })
})