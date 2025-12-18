export type ResultadoSemantico = {
  valido: boolean
  score: number
  candidatos?: string[]
  explicacion?: string
  razon?: string | null
}

function normalizar(s: string): string {
  return s
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
}

export async function validarSemantica(term: string, suggest?: string): Promise<ResultadoSemantico> {
  // Stub avanzado: heurísticas internas simples para pruebas y trazabilidad
  const t = normalizar(term || '')
  const s = normalizar(suggest || '')
  const res: ResultadoSemantico = { valido: false, score: 0.0, candidatos: [], explicacion: '', razon: null }

  if (!s) {
    res.valido = false
    res.score = 0.0
    res.explicacion = 'Evaluación semántica: sin sugerencia proporcionada'
    res.razon = 'no-suggestion'
    return res
  }

  if (t === s) {
    res.valido = true
    res.score = 0.97
    res.candidatos = [suggest as string]
    res.explicacion = 'Evaluación semántica: coincidencia exacta'
    return res
  }

  // Coincidencia parcial (sin acentos / diferencias menores)
  if (t.includes(s) || s.includes(t) || levenshteinDistance(t, s) <= Math.max(1, Math.floor(Math.min(t.length, s.length) * 0.2))) {
    res.valido = true
    res.score = 0.7
    res.candidatos = [suggest as string]
    res.explicacion = 'Evaluación semántica: coincidencia parcial'
    return res
  }

  // No coincide
  res.valido = false
  res.score = 0.1
  res.razon = 'no-match'
  res.explicacion = 'Evaluación semántica: sin coincidencia significativa'
  return res
}

// Simple Levenshtein distance implementation suitable for small strings
function levenshteinDistance(a: string, b: string): number {
  const m = a.length
  const n = b.length
  const dp: number[] = []
  for (let i = 0; i <= n; i++) dp[i] = i
  for (let i = 1; i <= m; i++) {
    let prev = dp[0]
    dp[0] = i
    for (let j = 1; j <= n; j++) {
      const temp = dp[j]
      const cost = a.charAt(i - 1) === b.charAt(j - 1) ? 0 : 1
      dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + cost)
      prev = temp
    }
  }
  return dp[n]
}
