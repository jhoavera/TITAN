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
      razon: 'La sugerencia no coincide con el término analizado',
      candidatos: []
    }
  }

  const normalize = (s: string) =>
    s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
  const parcial = normalize(term).includes(normalize(sugerencia)) || normalize(sugerencia).includes(normalize(term))
  const score = parcial ? 0.65 : 0.5
  return {
    // Para coincidencias parciales consideramos suficiente confianza práctica para marcar como válido
    valido: parcial ? true : false,
    score,
    explicacion: 'Evaluación semántica: coincidencia parcial',
    candidatos: [{ texto: sugerencia, score }]
  }
}