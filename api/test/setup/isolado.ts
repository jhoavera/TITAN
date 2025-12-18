import fs from 'fs'
import path from 'path'
import os from 'os'
import { beforeEach, afterEach } from 'vitest'

const baseTmp = path.join(process.cwd(), 'tmp', `isolado-${process.pid}`)
fs.mkdirSync(baseTmp, { recursive: true })

beforeEach(() => {
  const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
  const tmpGlosario = path.join(baseTmp, `tmp-glosario-${suffix}.json`)
  const tmpMetrics = path.join(baseTmp, `auto-approve-metrics-${suffix}.jsonl`)
  const tmpAdrs = path.join(baseTmp, `tmp-adrs-${suffix}`)

  // Variables de entorno consumidas por tests / servicios
  process.env.TITAN_TMP_GLOSARIO = tmpGlosario
  process.env.TITAN_TMP_METRICS = tmpMetrics
  process.env.TITAN_TMP_ADRS = tmpAdrs

  // Crear archivos/carpetas vacíos según corresponda
  try { fs.writeFileSync(tmpGlosario, '[]', 'utf8') } catch (e) { /* ignore */ }
  try { fs.writeFileSync(tmpMetrics, '', 'utf8') } catch (e) { /* ignore */ }
  try { fs.mkdirSync(tmpAdrs, { recursive: true }) } catch (e) { /* ignore */ }
})

afterEach(() => {
  // Limpiar carpeta base para evitar contaminación entre tests
  try { fs.rmSync(baseTmp, { recursive: true, force: true }) } catch (e) { /* ignore */ }
})
