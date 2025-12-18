import { describe, it, expect } from 'vitest'
import { exec } from 'child_process'
import path from 'path'

describe('instalar-stack script (dry-run)', () => {
  it('se ejecuta en modo dry-run y muestra pasos planeados', (done) => {
    const cmd = `node -r ts-node/register ./scripts/instalar-stack.ts --dry-run --with-docker-compose`
    exec(cmd, { cwd: process.cwd() }, (err, stdout, stderr) => {
      try {
        expect(err).toBeNull()
        expect(stdout).toContain('Instalador del stack TITAN')
        expect(stdout).toContain('[dry-run] bun install')
        expect(stdout).toContain('Archivo docker-compose generado')
        // comprobar contenido del docker-compose generado
        const fs = require('fs')
        fs.promises.readFile('./docker-compose.titan.yml','utf8').then((content: string) => {
          expect(content).toContain('POSTGRES_USER')
          expect(content.toLowerCase()).toContain('qdrant')
          expect(content).toContain('volumes:')
          done()
        }).catch(done)
      } catch (e) { done(e) }
    })
  })
})
