#!/usr/bin/env bun
import { ServicioDeduplicacion } from '../src/nucleo/servicios/servicio-deduplicacion';
import { z } from 'zod';

const esquemaArgs = z.object({
  apply: z.boolean().optional(),
  delete: z.boolean().optional(),
  commit: z.boolean().optional(),
  autor: z.string().optional(),
  email: z.string().optional(),
});

export async function deduplicarDesdeArgs(argv: string[] = process.argv.slice(2)) {
  const args: Record<string, string | boolean> = {};
  for (const raw of argv) {
    if (raw === '--apply') args.apply = true;
    if (raw === '--delete') args.delete = true;
    if (raw === '--commit') args.commit = true;
    if (raw.startsWith('--autor=')) args.autor = raw.split('=')[1];
    if (raw.startsWith('--email=')) args.email = raw.split('=')[1];
  }

  const parsed = esquemaArgs.parse({
    apply: Boolean(args.apply ?? false),
    delete: Boolean(args.delete ?? false),
    commit: Boolean(args.commit ?? false),
    autor: String(args.autor ?? ''),
    email: String(args.email ?? ''),
  });

  const servicio = new ServicioDeduplicacion();
  const grupos = await servicio.detectarDuplicados();

  // report
  console.log('Grupos detectados:', grupos.length);
  for (const g of grupos) {
    console.log('-', { hash: g.hash, tamano: g.tamano, cantidad: g.archivos.length });
  }

  if (!parsed.apply) return { grupos };

  const resultado = await servicio.aplicarPlan(grupos, {
    delete: parsed.delete,
    commit: parsed.commit,
    autor: parsed.autor ? { nombre: parsed.autor, email: parsed.email || `${parsed.autor.replace(/\s+/g, '').toLowerCase()}@local` } : undefined,
  });

  console.log('Resultado:', resultado);
  return resultado;
}

if (import.meta.main) {
  try {
    await deduplicarDesdeArgs(process.argv.slice(2));
    process.exit(0);
  } catch (err) {
    console.error('Error:', (err as Error).message);
    process.exit(1);
  }
}
