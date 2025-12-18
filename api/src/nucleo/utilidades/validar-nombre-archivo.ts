export const reglasNombre = {
  patronMinusculas: /^[a-z0-9_\-\.]+$/,
  sufijosAceptados: ['.md', '.ts', '.prueba.ts', '.spec.ts']
} as const

export function validarNombre(nombre: string): { valido: boolean; razones: string[] } {
  const razones: string[] = []

  if (!nombre || typeof nombre !== 'string') razones.push('nombre-vacio-o-no-string')

  if (!reglasNombre.patronMinusculas.test(nombre)) razones.push('contiene-mayusculas-o-caracteres-no-permitidos')

  // Solo exigir sufijo cuando el nombre aparenta ser un filename (contiene '.')
  if (nombre.includes('.')) {
    const tieneSufijoAceptado = reglasNombre.sufijosAceptados.some(s => nombre.endsWith(s))
    if (!tieneSufijoAceptado) razones.push('sufijo-no-aceptado')
  }

  const valido = razones.length === 0
  return { valido, razones }
}

export function detectarInglesBasico(nombre: string): boolean {
  // heurística simple: presencia de palabras comunes en inglés separadas por -/_/.
  const palabrasIngles = ['test', 'spec', 'draft', 'proposal', 'template', 'owner', 'migration', 'migrations', 'create', 'service', 'init']
  const lower = nombre.toLowerCase()
  return palabrasIngles.some(p => lower.includes(p))
}

export default validarNombre
/*
 * Validador simple para nombres de archivo del proyecto.
 * Reglas básicas (extendible):
 * - Nombre en minúsculas y guiones entre palabras
 * - No usar la palabra 'test' en inglés en el nombre
 * - Usar sufijo '.prueba.ts' para pruebas
 */
export const validarNombreArchivo = (nombre: string): { valido: boolean; razones: string[] } => {
  const razones: string[] = [];
  if (/[A-Z]/.test(nombre)) razones.push('No usar mayúsculas en el nombre');
  if (/\btest\b/i.test(nombre)) razones.push("Prohibido usar la palabra 'test' en inglés");
  if (!nombre.endsWith('.prueba.ts') && nombre.includes('.prueba')) razones.push('Las pruebas deben usar sufijo ".prueba.ts"');
  if (/\s/.test(nombre)) razones.push('No usar espacios en el nombre');
  return { valido: razones.length === 0, razones };
};
