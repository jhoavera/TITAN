import path from 'path'

// Punto único para derivar rutas de documentos, propuestas y auditoría.
export function obtenerDocsRoot(): string {
  if (process.env.TITAN_DOCS_ROOT) return path.resolve(process.env.TITAN_DOCS_ROOT)
  // __dirname => api/src/nucleo/rutas -> subir a repo root
  return path.resolve(__dirname, '..', '..', '..', '..')
}

export function rutaPropuestasGlosario(docsRoot = obtenerDocsRoot()): string {
  return path.join(docsRoot, 'documentacion-fuente-unica-verdad', 'glosario-biblioteca', 'propuestas')
}

export function rutaAuditoriaPrevalidacionLog(docsRoot = obtenerDocsRoot()): string {
  return path.join(docsRoot, 'documentacion-fuente-unica-verdad', 'glosario-biblioteca', 'auditoria-prevalidacion.log')
}

export function rutaGlosario(docsRoot = obtenerDocsRoot()): string {
  return path.join(docsRoot, 'documentacion-fuente-unica-verdad', 'glosario-biblioteca', 'glosario.md')
}

export function rutaADRs(docsRoot = obtenerDocsRoot()): string {
  return path.join(docsRoot, 'documentacion-fuente-unica-verdad', 'ad-rs')
}

export function rutaTmpBase(docsRoot = obtenerDocsRoot()): string {
  return process.env.TITAN_TMP_BASE ? path.resolve(process.env.TITAN_TMP_BASE) : path.join(docsRoot, 'tmp')
}
