#!/usr/bin/env ts-node
import path from 'path'
import process from 'process'
import fs from 'fs'

async function main() {
  const args = process.argv.slice(2)
  const cmd = args[0]
  if (!cmd) {
    console.error('Uso: gestionar-adr <crear|listar> [opciones]')
    process.exit(1)
  }

  if (cmd === 'crear') {
    const titulo = args[1] ?? 'ADR automática'
    const autor = args[2] ?? 'auto'
    const contenido = args.slice(3).join(' ') || `Propuesta automática: ${titulo}`
    const nombre = `${new Date().toISOString().slice(0,10)}-propuesta-${titulo.replace(/[^a-z0-9-]/gi,'-').toLowerCase()}.md`
    const raiz = process.cwd()
    const ruta = path.join(raiz, 'documentacion-fuente-unica-verdad', 'ad-rs', nombre)
    await fs.promises.mkdir(path.dirname(ruta), { recursive: true })
    await fs.promises.writeFile(ruta, `---\ntitulo: "${titulo}"\nautor: ${autor}\nfecha: ${new Date().toISOString()}\nestado: propuesta\n---\n\n${contenido}\n`, 'utf8')
    console.log('ADR creada:', ruta)
    process.exit(0)
  }

  if (cmd === 'listar') {
    const raiz = process.cwd()
    const dir = path.join(raiz, 'documentacion-fuente-unica-verdad', 'ad-rs')
    try {
      const files = await fs.promises.readdir(dir)
      console.log('ADRs en repo:')
      for (const f of files) console.log('- ', f)
    } catch (e) {
      console.error('No hay ADRs o error', e)
      process.exit(1)
    }
    process.exit(0)
  }

  console.error('Comando no soportado:', cmd)
  process.exit(1)
}

if (require.main === module) main().catch((e)=>{ console.error('Error:', e); process.exit(1) })
