import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import os from 'os'
import { withTempAudit } from '../../helpers/auditoria'

import { runCorregirIngles } from '../../../scripts/servicios/corregir-ingles'

describe('corregir-ingles script (integracion minimal)', () => {
  it('genera propuestas y ADRs en modo propuesta', async () => {
    const tempRoot = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'titan-corregir-'))
    // crear estructura y un archivo con término en inglés
    const archivo = path.join(tempRoot, 'migrations_dummy.txt')
    await fs.promises.writeFile(archivo, 'contenido migraciones', 'utf8')

    // Crear directorio docs en tempRoot para que los servicios escriban propuestas/ADRs allí
    const docsDir = path.join(tempRoot, 'documentacion-fuente-unica-verdad')
    await fs.promises.mkdir(path.join(docsDir, 'glosario-biblioteca', 'propuestas'), { recursive: true })
    await fs.promises.mkdir(path.join(docsDir, 'ad-rs'), { recursive: true })

    // Aislar auditoría
    await withTempAudit(async (auditLog) => {
      process.env.TITAN_DOCS_ROOT = tempRoot

      const res = await runCorregirIngles(tempRoot)
      expect(res.hallazgos.length).toBeGreaterThanOrEqual(1)
      expect(res.resultados.length).toBeGreaterThanOrEqual(1)

      // comprobar que existen propuestas en glosario
      const propuestas = await fs.promises.readdir(path.join(docsDir, 'glosario-biblioteca', 'propuestas'))
      expect(propuestas.length).toBeGreaterThanOrEqual(1)

      // comprobar que ADR fue creada
      const adrs = await fs.promises.readdir(path.join(docsDir, 'ad-rs'))
      expect(adrs.length).toBeGreaterThanOrEqual(1)

      delete process.env.TITAN_DOCS_ROOT
    })

    // cleanup
    await fs.promises.rm(tempRoot, { recursive: true, force: true })
  })
})
