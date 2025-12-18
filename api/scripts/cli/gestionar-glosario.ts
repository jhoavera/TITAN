#!/usr/bin/env ts-node
import path from 'path'
import process from 'process'
import fs from 'fs'

type Opciones = {
  raiz?: string
}

export async function runCli(providedArgs?: string[], opciones?: Opciones) {
  const args = providedArgs ?? process.argv.slice(2)
  const cmd = args[0]
  if (!cmd) {
    throw new Error('Uso: gestionar-glosario <crear|listar> [opciones]')
  }

  const raiz = opciones?.raiz ?? process.cwd()

  if (cmd === 'crear') {
    const termino = args[1]
    const definicion = args.slice(2).join(' ') || 'Definición pendiente.'
    if (!termino) {
      throw new Error('Se requiere el término a crear.')
    }
    const slug = termino.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
    const dir = path.join(raiz, 'documentacion-fuente-unica-verdad', 'glosario-biblioteca', 'terminos')
    await fs.promises.mkdir(dir, { recursive: true })
    const ruta = path.join(dir, `${slug}.md`)

    // Validación previa: intentar usar servicio de validación
    try {
      const mod = await import('../../src/nucleo/servicios/servicio-validacion-creacion')
      await mod.validarYRegistrarNombre(termino, 'glosario')
    } catch (_e) {
      // no bloquear creación por errores en validador
    }

    const contenido = `---\ntermino: ${termino}\nslug: ${slug}\nfecha: ${new Date().toISOString()}\nestado: propuesta\n---\n\n${definicion}\n`
    await fs.promises.writeFile(ruta, contenido, 'utf8')

    // actualizar indice
    const indicePath = path.join(raiz, 'documentacion-fuente-unica-verdad', 'glosario-biblioteca', 'glosario-indice.md')
    const linea = `- ${termino} - ${ruta}`
    try {
      await fs.promises.appendFile(indicePath, linea + '\n', 'utf8')
    } catch (_e) {
      await fs.promises.writeFile(indicePath, `# Índice glosario\n\n${linea}\n`, 'utf8')
    }

    return { created: ruta }
  }

  if (cmd === 'listar') {
    const dir = path.join(raiz, 'documentacion-fuente-unica-verdad', 'glosario-biblioteca', 'terminos')
    const files = await fs.promises.readdir(dir)
    return { list: files }
  }

  throw new Error('Comando no soportado: ' + cmd)
}

if (typeof require !== 'undefined' && require.main === module) {
  runCli().then((res) => { console.log('OK', res); process.exit(0) }).catch((e)=>{ console.error('Error:', e); process.exit(1) })
}
