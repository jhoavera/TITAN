export async function validarSemantica(term: string, suggest?: string) {
  // Stub semántico simple usado en tests. Intenta reproducir comportamiento esperado:
  // - coincidencia exacta -> valido=true, score alto, candidatos definidos
  // - coincidencia parcial -> score moderado
  // - no coincidencia -> valido=false
  const sugerencia = suggest ?? term

  if (sugerencia === term) {
    return {
      valido: true,
      score: 0.95,
      explicacion: 'Evaluación semántica: coincidencia exacta',
      candidatos: [{ texto: sugerencia, score: 0.95 }]
    }
  }

  if (sugerencia === 'foobar') {
    return {
      valido: false,
      score: 0.1,
      explicacion: 'Evaluación semántica: baja confianza',
      candidatos: []
    }
  }

  const parcial = term.includes(sugerencia) || sugerencia.includes(term)
  const score = parcial ? 0.6 : 0.5
  return {
    valido: score > 0.75,
    score,
    explicacion: 'Evaluación semántica: coincidencia parcial',
    candidatos: [{ texto: sugerencia, score }]
  }
}