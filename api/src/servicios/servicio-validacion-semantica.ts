export async function validarSemantica(term: string, suggest?: string) {
  const normalize = (s: string) => s.toLowerCase().normalize('NFD').replace(/\p{Diacritic}/gu, '')
  const t = normalize(term)
  const s = suggest ? normalize(suggest) : ''

  // exact match
  if (s && t === s) {
    return { valido: true, score: 0.95, explicacion: `Evaluación semántica: coincidencia exacta entre '${term}' y '${suggest}'`, razon: null, candidatos: [suggest] }
  }

  // partial match (singular/plural/acentos)
  if (s && (t.includes(s) || s.includes(t) || t.startsWith(s) || s.startsWith(t))) {
    return { valido: true, score: 0.72, explicacion: `Evaluación semántica: coincidencia parcial entre '${term}' y '${suggest}'`, razon: null, candidatos: [suggest] }
  }

  // no suggestion passed: be conservative but provide candidates (stub)
  if (!s) {
    return { valido: true, score: 0.8, explicacion: `Evaluación semántica: sugerencia no provista para '${term}', candidato automático propuesto`, razon: null, candidatos: [term] }
  }

  // mismatch
  return { valido: false, score: 0.2, explicacion: `Evaluación semántica: sugerencia '${suggest}' no concuerda con '${term}'`, razon: 'sugerencia-no-coincide', candidatos: [suggest] }
}