export type ResultadoSemantico = {
  valido: boolean
  score: number
  explicacion: string
  razon?: string | null
  candidatos?: string[]
}

function normalizar(s?: string) {
  if (!s) return ''
  // quitar diacríticos y normalizar a minúsculas
  return s.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()
}

function distanciaLevenshtein(a: string, b: string) {
  const m = a.length
  const n = b.length
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) => Array(n + 1).fill(0))
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost)
    }
  }
  return dp[m][n]
}

export async function validarSemantica(term: string, suggest?: string): Promise<ResultadoSemantico> {
  const t = normalizar(term)
  const s = normalizar(suggest)

  if (!s) return { valido: false, score: 0, explicacion: 'Evaluación semántica: sin sugerencia', razon: 'no_sugerencia' }

  // igualdad exacta
  if (t === s) {
    return {
      valido: true,
      score: 0.98,
      explicacion: `Evaluación semántica: coincidencia exacta entre '${term}' y '${suggest}'`,
      candidatos: [suggest],
    }
  }

  const dist = distanciaLevenshtein(t, s)
  const maxLen = Math.max(t.length, s.length, 1)
  const sim = 1 - dist / maxLen // 1 = idéntico, 0 = completamente distinto

  if (sim >= 0.6) {
    return {
      valido: true,
      score: Number((sim).toFixed(3)),
      explicacion: `Evaluación semántica: coincidencia parcial (sim=${sim.toFixed(3)}) entre '${term}' y '${suggest}'`,
      candidatos: [suggest],
    }
  }

  return {
    valido: false,
    score: Number((sim).toFixed(3)),
    explicacion: `Evaluación semántica: baja similitud (sim=${sim.toFixed(3)}) entre '${term}' y '${suggest}'`,
    razon: 'baja_similitud',
  }
}
