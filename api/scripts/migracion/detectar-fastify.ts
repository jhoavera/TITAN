#!/usr/bin/env bun
// scripts/migracion/detectar-fastify.ts
// Escanea el repositorio para referencias a 'fastify' y genera reports/fastify-deteccion.json

import fs from 'fs'
import path from 'path'

type Report = Record<string, number>

function isTextFile(file: string) {
  const ext = path.extname(file).toLowerCase()
  return ['.ts', '.js', '.json', '.md', '.mdx', '.yml', '.yaml'].includes(ext)
}

function walk(dir: string, cb: (file: string) => void) {
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name)
    const st = fs.statSync(full)
    if (st.isDirectory()) {
      if (name === 'node_modules' || name === '.git' || name === 'dist' || name === 'build') continue
      walk(full, cb)
    } else {
      cb(full)
    }
  }
}

function main() {
  const root = process.cwd()
  const report: Report = {}

  walk(root, (file) => {
    if (!isTextFile(file)) return
    // limitar a archivos del repo (evitar node_modules)
    if (file.includes('/node_modules/')) return
    try {
      const s = fs.readFileSync(file, 'utf-8')
      const matches = s.match(/\bfastify\b/gi)
      if (matches && matches.length > 0) {
        // generar ruta relativa
        const rel = path.relative(root, file)
        report[rel] = matches.length
      }
    } catch (_e) {
      // ignorar archivos que no puedan leerse
    }
  })

  const outDir = path.join(root, 'reports')
  try { fs.mkdirSync(outDir) } catch (_e) {}
  const outFile = path.join(outDir, 'fastify-deteccion.json')
  fs.writeFileSync(outFile, JSON.stringify({ generatedAt: new Date().toISOString(), report }, null, 2), 'utf-8')
  console.log('Reporte escrito en', outFile)
}

if (require.main === module) main()
