#!/usr/bin/env bun
import path from 'path'
import process from 'process'
import { escanearRepositorioParaIngles, procesarHallazgosYGenerarPropuestas } from '@nucleo/servicios/servicio-integridad-idioma'
// Evitar importar utilidades de entorno en tiempo de import para facilitar tests; importar dinámicamente cuando se ejecute como CLI


export async function runCorregirIngles(raiz: string, opts: { aplicar?: boolean } = {}) {
  const r = path.resolve(raiz)
  console.log('Corregir Inglés - raiz:', r, 'opts:', opts)

  const hallazgos = await escanearRepositorioParaIngles(r)
  if (hallazgos.length === 0) {
    console.log('No se detectaron términos en inglés.')
    return { hallazgos: [], resultados: [] }
  }

  const resultados = await procesarHallazgosYGenerarPropuestas(r, hallazgos)

  console.log('Se generaron propuestas/ADRs para los siguientes términos:')
  for (const res of resultados) {
    console.log('-', res.termino, 'propuestaGlosario=', res.propuestaGlosario, 'adr=', res.adr)
  }

  if (opts.aplicar) {
    // For safety: do not auto-apply changes without explicit approval (ADR aprobado)
    const forced = process.env.TITAN_FORCE_APPLY === 'true'
    if (!forced) {
      console.warn('--aplicar solicitado pero se requiere CONFIRMACIÓN explícita: exporte TITAN_FORCE_APPLY=true para forzar (no recomendado).')
      return { hallazgos, resultados }
    }
    // If forced, we still check ADR approval status — currently not implemented (manual step)
    console.warn('Aplicación automática forzada. Nota: la política del proyecto exige ADR aprobado antes de aplicar cambios. Aplique manualmente después de aprobación.')
  }

  return { hallazgos, resultados }
}

if (import.meta.main) {
  // Importar dinámicamente la utilidad que verifica el runtime para no romper tests unitarios
  (async () => {
    try {
      const mod = await import('@comun/utilidades/verificar-stack')
      if (mod && typeof mod.ensureRunningOnBunOrExit === 'function') mod.ensureRunningOnBunOrExit()
    } catch (e) {
      // No fatal en entorno de test; en CLI real preferimos abortar pero no romper aquí
      try { console.warn('[corregir-ingles] no se pudo verificar entorno Bun:', (e as Error).message) } catch {}
    }

    const raiz = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd()
    const aplicar = process.argv.includes('--aplicar')
    runCorregirIngles(raiz, { aplicar }).catch(e => { console.error('Error:', e); process.exit(1) })
  })()
}

export default { runCorregirIngles }
