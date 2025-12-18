import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import { spawnSync } from 'child_process'

const tmpGlosario = path.resolve(__dirname, '..', '..', 'tmp-glosario.json')

function readTmp() {
  try { return JSON.parse(fs.readFileSync(tmpGlosario, 'utf-8')) } catch (e) { return [] }
}

function resetTmp() { fs.writeFileSync(tmpGlosario, JSON.stringify([], null, 2), 'utf-8') }

describe('revisar-idioma --apply-when-tests-pass', () => {
  beforeEach(() => { resetTmp() })
  afterEach(() => { resetTmp() })

  it('no aplica cuando las pruebas fallan (APPLY_TEST_CMD=false)', () => {
    const res = spawnSync('bun', ['./scripts/revisar-idioma.ts', '--apply-when-tests-pass'], {
      env: { ...process.env, APPLY_TEST_CMD: 'false' },
      encoding: 'utf-8'
    })
    const tmp = readTmp()
    expect(res.status).not.toBe(0)
    expect(tmp.length).toBe(0)
  })

  it('aplica cuando las pruebas pasan (APPLY_TEST_CMD=true)', () => {
    const res = spawnSync('bun', ['./scripts/revisar-idioma.ts', '--apply-when-tests-pass'], {
      env: { ...process.env, APPLY_TEST_CMD: 'true' },
      encoding: 'utf-8'
    })
    const tmp = readTmp()
    expect(res.status).toBe(0)
    expect(tmp.length).toBeGreaterThan(0)
  })
})
