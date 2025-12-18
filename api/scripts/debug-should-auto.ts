import fs from 'fs'
import path from 'path'
import { shouldAutoApprove } from '@servicios/limpieza-utils'

const tmp = path.resolve(__dirname, '../test/servicios/tmp-auto-approve-extended')
if (!fs.existsSync(tmp)) fs.mkdirSync(tmp, { recursive: true })

// md-small
const md = path.join(tmp, 'short.md')
fs.writeFileSync(md, '# Nota\n\nCambio menor en el documento de estado.', 'utf8')
console.log('md result', shouldAutoApprove(md))

// json-small
const dir = path.join(tmp, 'data')
fs.mkdirSync(dir, { recursive: true })
const jsf = path.join(dir, 'termino.json')
fs.writeFileSync(jsf, JSON.stringify({ termino: 'prueba', definicion: 'Definición de prueba' }), 'utf8')
console.log('json result', shouldAutoApprove(jsf))

// glossary proposal
const pdir = path.join(tmp, 'documentacion-fuente-unica-verdad', 'glosario-biblioteca', 'propuestas')
fs.mkdirSync(pdir, { recursive: true })
const g = path.join(pdir, 'propuesta-antigua.md')
fs.writeFileSync(g, '# Propuesta\nContenido', 'utf8')
const old = Date.now() - 1000 * 60 * 60 * 24 * 365
fs.utimesSync(g, old / 1000, old / 1000)
console.log('glossary result (no opts)', shouldAutoApprove(g))
console.log('glossary result (with allow)', shouldAutoApprove(g, { allowLongTermAuto: true, longTermDays: 30 }))

// doc-only
const p2 = path.join(tmp, 'documentacion-fuente-unica-verdad')
fs.mkdirSync(p2, { recursive: true })
const d = path.join(p2, 'nota.md')
fs.writeFileSync(d, '# Notas\nContenido de documentación corto y sin código', 'utf8')
console.log('doc-only result', shouldAutoApprove(d))
