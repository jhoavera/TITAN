#!/usr/bin/env bun
import fs from 'fs';
import path from 'path';

function readJson(file: string) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf-8'));
  } catch (e) {
    return null;
  }
}

async function main() {
  const root = process.cwd();
  const dedup = readJson(path.resolve(root, 'reports', 'dedup-propuestas.json'));
  const propuestas = readJson(path.resolve(root, 'reports', 'propuestas-aprobacion-posible.json'));

  const draft = {
    fecha: new Date().toISOString(),
    resumen: {
      dedupEncontrado: !!dedup,
      grupos: dedup?.grupos?.length ?? 0,
      propuestasGeneradas: propuestas?.propuestas?.length ?? 0,
    },
    checklist: [
      'Revisar propuestas generadas manualmente',
      'Verificar semScore >= 0.7 para aprobaciones automáticas',
      'Confirmar que no se aplicarán renombrados sin ADR aprobado',
      'Ejecutar suite de tests localmente: bun test',
    ],
    archivosAdjuntos: {
      dedup: dedup ? 'reports/dedup-propuestas.json' : null,
      propuestas: propuestas ? 'reports/propuestas-aprobacion-posible.json' : null,
    },
  };

  const destino = path.resolve(root, 'reports', 'pr-draft.json');
  fs.mkdirSync(path.dirname(destino), { recursive: true });
  fs.writeFileSync(destino, JSON.stringify(draft, null, 2), 'utf-8');
  console.log('PR draft generado:', destino);
}

if (require.main === module) void main();
