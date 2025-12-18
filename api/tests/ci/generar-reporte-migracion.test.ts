import { generarReporte } from '@scripts/ci/generar-reporte-migracion'
import fs from 'fs'
import { describe, it, expect } from 'vitest'

describe('generar-reporte-migracion', () => {
  it('genera reporte con findings y devuelve path y contenido', async () => {
    const scripts = {
      'start:dev': 'node -r ts-node/register src/index.ts',
      'build': 'tsc -p tsconfig.json',
      'migrate': 'node ./node_modules/.bin/knex migrate:latest'
    }

    const res = await generarReporte(scripts)
    expect(res.path).toBeDefined()
    expect(res.content).toContain('Se detectaron')
    const exists = fs.existsSync(res.path)
    expect(exists).toBe(true)
    // cleanup
    try { fs.unlinkSync(res.path) } catch (e) { /* ignore */ }
  })
})
