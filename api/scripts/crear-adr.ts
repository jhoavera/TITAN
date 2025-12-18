#!/usr/bin/env bun
import { ServicioADR } from '../src/servicios/adr/servicio-adr';
import { z } from 'zod';

const esquemaArgs = z.object({
  titulo: z.string().min(3),
  autor: z.string().min(1),
  objetivo: z.string().min(1),
  decision: z.string().min(1),
  noCommit: z.boolean().optional(),
  force: z.boolean().optional(),
});

export async function crearADRDesdeArgs(argv: string[] = process.argv.slice(2)) {
  // Simple parser: --no-commit flag + key=value pairs
  const args: Record<string, string | boolean> = {};
  for (const raw of argv) {
    if (raw === '--no-commit') {
      args.noCommit = true;
      continue;
    }
    if (raw === '--force') {
      args.force = true;
      continue;
    }
    const [k, ...rest] = raw.split('=');
    const v = rest.join('=');
    if (!k || !v) continue;
    args[k.replace(/^--/, '')] = v;
  }

  const parsed = esquemaArgs.parse({
    titulo: String(args.titulo ?? ''),
    autor: String(args.autor ?? ''),
    objetivo: String(args.objetivo ?? ''),
    decision: String(args.decision ?? ''),
    noCommit: Boolean(args.noCommit ?? false),
    force: Boolean(args.force ?? false),
  });

  // Validaciones de idioma: prohibir términos en inglés en título/objetivo/decisión salvo --force
  const palabrasIngles = ['migration','migrations','template','create','service','test','spec','draft','proposal','init'];
  const detectarInglesEnTexto = (t: string) => palabrasIngles.some(p => t.toLowerCase().includes(p));
  if (!parsed.force) {
    if (detectarInglesEnTexto(parsed.titulo) || detectarInglesEnTexto(parsed.decision) || detectarInglesEnTexto(parsed.objetivo)) {
      throw new Error('Error: se detectaron términos en inglés en el ADR. Ejecuta "bun ./scripts/revisar-idioma.ts --dry-run" para generar propuestas o usar --force para sobreescribir.');
    }
  }

  // Validar nombre/slug usando validador central (registra propuestas si hay inglés)
  const { validarYRegistrarNombre } = await import('../src/nucleo/servicios/servicio-validacion-creacion');
  const slug = parsed.titulo.toLowerCase().replace(/[^a-z0-9áéíóúñ\- ]/g, '').replace(/\s+/g,'-').slice(0,80);
  const resValidacion = await validarYRegistrarNombre(`adr-${slug}`, 'adr');
  if (!parsed.force && resValidacion.hayIngles) {
    throw new Error('Error: el título del ADR contiene indicios de inglés; se ha creado una propuesta en glosario-biblioteca/propuestas. Revisa y aproba vía ADR o use --force para ignorar.');
  }

  const servicio = new ServicioADR();
  const adr = await servicio.crearADR({ titulo: parsed.titulo, autor: parsed.autor, objetivo: parsed.objetivo, decision: parsed.decision }, { commit: !parsed.noCommit });
  return adr;
}

if (import.meta.main) {
  try {
    const adr = await crearADRDesdeArgs(process.argv.slice(2));
    // eslint-disable-next-line no-console
    console.log('ADR creado:', adr.id);
    process.exit(0);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Error:', (err as Error).message);
    process.exit(1);
  }
}
