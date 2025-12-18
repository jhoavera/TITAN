#!/usr/bin/env bun
import fs from 'fs';
import path from 'path';

const TARGETS = [
  path.join(process.cwd(), '..', '..', 'api', 'tmp'),
  path.join(process.cwd(), '..', '..', 'tmp'),
];

const diasParaBorrar = Number(process.env.DIAS_BORRADO || '7');
const ahora = Date.now();

function limpiar(): void {
  for (const t of TARGETS) {
    if (!fs.existsSync(t)) continue;
    for (const entry of fs.readdirSync(t)) {
      try {
        const full = path.join(t, entry);
        const stat = fs.statSync(full);
        const edadDias = (ahora - stat.mtimeMs) / (1000 * 60 * 60 * 24);
        if (edadDias > diasParaBorrar) {
          // eliminar archivo o directorio recursivamente
          fs.rmSync(full, { recursive: true, force: true });
          console.log('limpieza: eliminado', full);
        }
      } catch (e) {
        console.error('error limpiando', entry, e instanceof Error ? e.message : e);
      }
    }
  }
}

if (require.main === module) limpiar();

export { limpiar };
