#!/usr/bin/env bun
import fs from 'fs'
import path from 'path'
import { esquemaCrearADR } from '../../src/nucleo/validadores/validador-adrs'
import { obtenerDb } from '../../src/infraestructura/base-de-datos/cliente'
import * as repo from '../../src/infraestructura/repositorios/repositorio-adrs'

const ADRS_DIR = process.env.ADRS_DIR_OVERRIDE || path.resolve(process.cwd(), '../documentacion-fuente-unica-verdad/ad-rs')

export async function crearADRFromPayload(payload: any, opts: { apply?: boolean, autorId?: string, inquilinoId?: string } = {}) {
  const data = await esquemaCrearADR.parseAsync(payload)
  const db = obtenerDb() as any

  // Crear en BD
  const creado = await repo.crearADR(db, data as any, opts.inquilinoId ?? 'TNT-DEFAULT', opts.autorId ?? 'CLI')

  // Generar archivo Markdown si apply
  let filePath: string | null = null
  if (opts.apply) {
    try {
      fs.mkdirSync(ADRS_DIR, { recursive: true })
      const date = new Date().toISOString().slice(0,10)
      const slug = (data.numero ?? data.numero) ? String(data.numero).padStart(4,'0') : creado.slug ?? `adr-${creado.numero}`
      const filename = `${date}-adr-${slug}.md`
      const content = `---\ntitulo: "${creado.titulo}"\nfecha: "${new Date().toISOString()}"\nestado: "${creado.estado}"\nautor: "${opts.autorId ?? 'CLI'}"\n---\n\n# ${creado.titulo}\n\n**Objetivo**:\n\n${creado.objetivo}\n\n**Decisión**:\n\n${creado.decision}\n`;
      filePath = path.join(ADRS_DIR, filename)
      fs.writeFileSync(filePath, content, 'utf8')
    } catch (e) {
      console.error('[crear-adr] error escribiendo archivo ADR', e instanceof Error ? e.message : String(e))
    }
  }

  return { creado, archivo: filePath }
}

if (require.main === module) {
  (async () => {
    const args = process.argv.slice(2)
    const map: Record<string,string> = {}
    for (let i=0;i<args.length;i++) {
      if (args[i].startsWith('--')) {
        const key = args[i].replace(/^--/, '')
        const val = args[i+1] && !args[i+1].startsWith('--') ? args[++i] : 'true'
        map[key] = val
      }
    }
    const payload: any = {
      numero: map.numero ? Number(map.numero) : 1,
      titulo: map.titulo || 'ADR desde CLI',
      objetivo: map.objetivo || 'Objetivo generado desde CLI',
      decision: map.decision || 'Decisión generada desde CLI',
    }
    const apply = map.apply === 'true' || map.apply === '1' || map.apply === 'yes'
    const autor = map.autor || 'CLI'
    const inquilino = map.inquilino || 'TNT-DEFAULT'
    const res = await crearADRFromPayload(payload, { apply, autorId: autor, inquilinoId: inquilino })
    console.log('Resultado:', res)
  })().catch(e => { console.error(e); process.exit(1) })
}
