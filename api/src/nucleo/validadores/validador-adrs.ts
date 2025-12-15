/*
 * Validadores Zod para operaciones sobre ADRs
 */
import { z } from 'zod';

export const esquemaCrearADR = z.object({
  numero: z.number().int().positive(),
  titulo: z.string().min(10, 'El título debe tener al menos 10 caracteres').max(200).transform(s => s.trim()),
  objetivo: z.string().min(20, 'El objetivo debe ser claro y conciso (mínimo 20 caracteres)').transform(s => s.trim()),
  decision: z.string().min(20, 'La decisión debe contener detalle suficiente').transform(s => s.trim()),
  motivos: z.array(z.string()).optional(),
  alternativas: z.record(z.string()).optional(),
  referencias: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  archivo_markdown: z.string().optional().nullable(),
});

export const esquemaActualizarADR = esquemaCrearADR.partial().extend({
  id: z.string().uuid().optional(),
  estado: z.enum(['BORRADOR','PENDIENTE','EN_REVISION','APROBADO','RECHAZADO']).optional(),
  notas_revision: z.string().max(2000).optional().nullable(),
});

export const esquemaAprobarADR = z.object({
  aprobado_por: z.string().uuid('id de aprobador inválido'),
  git_ref: z.string().optional().nullable(),
  notas_revision: z.string().max(2000).optional().nullable(),
});
