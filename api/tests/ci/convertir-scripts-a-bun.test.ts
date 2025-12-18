import { planConversion, detectEnglishTerms } from '@scripts/ci/convertir-scripts-a-bun'
import { expect, it, describe } from 'vitest'

describe('convertir-scripts-a-bun', () => {
  it('detecta y planifica cambios correctamente', () => {
    const scripts = {
      'dev': 'node -r ts-node/register src/index.ts',
      'start': 'node server.js',
      'test': 'vitest run'
    }

    const changes = planConversion(scripts)
    expect(changes.length).toBe(2)
    expect(changes.some(c => c.scriptName === 'dev')).toBe(true)
    expect(changes.some(c => c.scriptName === 'start')).toBe(true)
  })

  it('detecta términos en inglés en los scripts', () => {
    const scripts = {
      'db:migrate': 'node ./node_modules/.bin/knex migrate:latest',
      'seed': 'node ./node_modules/.bin/knex seed:run'
    }
    const terms = detectEnglishTerms(scripts)
    expect(terms).toContain('migrate')
  })
})
