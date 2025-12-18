#!/usr/bin/env bun
import { ServicioLimpieza, AccionLimpieza } from '../src/servicios/limpieza/servicio-limpieza';
import { z } from 'zod';

const esquemaArgs = z.object({
  dryRun: z.boolean().optional(),
  commit: z.boolean().optional(),
  autor: z.string().optional(),
  email: z.string().optional(),
  autoApprove: z.boolean().optional(),
});

export async function limpiarRepoDesdeArgs(argv: string[] = process.argv.slice(2)) {
  const args: Record<string, string | boolean> = {};
  for (const raw of argv) {
    if (raw === '--dry-run') args.dryRun = true;
    if (raw === '--commit') args.commit = true;
    if (raw === '--auto-approve' || raw === '--autoApprove') args.autoApprove = true;
    if (raw.startsWith('--autor=')) args.autor = raw.split('=')[1];
    if (raw.startsWith('--email=')) args.email = raw.split('=')[1];
  }

  const parsed = esquemaArgs.parse({ dryRun: Boolean(args.dryRun ?? false), commit: Boolean(args.commit ?? false), autor: String(args.autor ?? ''), email: String(args.email ?? '') });
  const servicio = new ServicioLimpieza();
  const propuestas = await servicio.proponerLimpieza();

  // Mostrar resumen
  // eslint-disable-next-line no-console
  console.log('Propuestas encontradas:', propuestas.length);
  for (const p of propuestas) {
    // eslint-disable-next-line no-console
    console.log('-', p);
  }

  if (propuestas.length === 0) return { aplicadas: [], noAplicadas: [] };

  const resultado = await servicio.ejecutarLimpieza(propuestas, { dryRun: parsed.dryRun, commit: parsed.commit, autor: parsed.autor ? { nombre: parsed.autor, email: parsed.email || `${parsed.autor.replace(/\s+/g, '').toLowerCase()}@local` } : undefined, autoApprove: Boolean(args['--auto-approve'] ?? args.autoApprove ?? false) });
  // eslint-disable-next-line no-console
  console.log('Resultado:', resultado);
  return resultado;
}

if (import.meta.main) {
  try {
    await limpiarRepoDesdeArgs(process.argv.slice(2));
    process.exit(0);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error:', (err as Error).message);
    process.exit(1);
  }
}
