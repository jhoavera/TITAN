#!/usr/bin/env bun
import { readFileSync } from 'fs';
import { join } from 'path';

import { readdirSync, statSync } from 'fs';

function walk(dir: string, files: string[] = []): string[] {
  try {
    const entries = readdirSync(dir);
    for (const name of entries) {
      const full = `${dir}/${name}`;
      try {
        const s = statSync(full);
        if (s.isDirectory()) {
          walk(full, files);
        } else if (s.isFile() && (full.endsWith('.ts') || full.endsWith('.js'))) {
          files.push(full);
        }
      } catch (_e) {
        // ignore
      }
    }
  } catch (_e) {
    // ignore missing dirs
  }
  return files;
}

function scanFiles(root = 'src') {
  const files = walk(root);
  const results: Record<string, number> = {};
  for (const f of files) {
    try {
      const content = readFileSync(f, 'utf8');
      const count = (content.match(/fastify/gi) || []).length;
      if (count > 0) results[f] = count;
    } catch (e) {
      // ignore
    }
  }
  return results;
}

function main() {
  const report = scanFiles('src');
  const out = { generatedAt: new Date().toISOString(), totalFiles: Object.keys(report).length, occurrences: report };
  const outPath = join('reports', 'fastify-deteccion.json');
  Bun.write(outPath, JSON.stringify(out, null, 2));
  console.log(`Reporte generado: ${outPath}`);
}

if (import.meta.main) main();
