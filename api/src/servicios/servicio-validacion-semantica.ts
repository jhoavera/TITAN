export type ResultadoValidacionSemantica = {
  valido: boolean
  score: number
  explicacion: string
  razon?: string | null
  candidatos?: Array<{ candidato: string; score: number }>
}

function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
}

function levenshtein(a: string, b: string): number {
  const al = a.length
  const bl = b.length
  if (al === 0) return bl
  if (bl === 0) return al
  const v0 = new Array(bl + 1).fill(0)
  const v1 = new Array(bl + 1).fill(0)
  for (let i = 0; i <= bl; i++) v0[i] = i
  for (let i = 0; i < al; i++) {
    v1[0] = i + 1
    for (let j = 0; j < bl; j++) {
      const cost = a[i] === b[j] ? 0 : 1
      v1[j + 1] = Math.min(v1[j] + 1, v0[j + 1] + 1, v0[j] + cost)
    }
    for (let k = 0; k <= bl; k++) v0[k] = v1[k]
  }
  return v1[bl]
}

export async function validarSemantica(term: string, suggest?: string): Promise<ResultadoValidacionSemantica> {
  const t = normalizar(term)
  const s = suggest ? normalizar(suggest) : ''

  if (!suggest) {
    return {
      valido: false,
      score: 0,
      explicacion: 'Evaluación semántica: no se proporcionó sugerencia',
      razon: 'sin_sugerencia'
    }
  }

  if (t === s) {
    return {
      valido: true,
      score: 0.98,
      explicacion: `Evaluación semántica: coincidencia exacta entre '${term}' y '${suggest}'`,
      candidatos: [{ candidato: suggest, score: 0.98 }]
    }
  }

  const distance = levenshtein(t, s)
  const maxLen = Math.max(t.length, s.length)
  const similarity = maxLen === 0 ? 1 : 1 - distance / maxLen

  if (similarity >= 0.6) {
    return {
      valido: true,
      score: Number(similarity.toFixed(2)),
      explicacion: `Evaluación semántica: coincidencia parcial (similitud=${similarity.toFixed(2)})`,
      candidatos: [{ candidato: suggest, score: Number(similarity.toFixed(2)) }
      ]
    }
  }

  return {
    valido: false,
    score: Number(similarity.toFixed(2)),
    explicacion: `Evaluación semántica: no coincide (similitud=${similarity.toFixed(2)})`,
    razon: 'baja_confianza'
  }
}
