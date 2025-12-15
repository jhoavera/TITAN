/*
 * Validadores Zod para operaciones sobre glosario_terminos
 * Mensajes en español técnico empresarial.
 */
import { z } from 'zod';

export const categoriasPermitidas = ['TERMINO_TECNICO', 'ABREVIATURA', 'PROCESO', 'RECURSO'] as const;

export const esquemaCrearGlosario = z.object({
  termino: z.string().min(2, 'El término debe tener al menos 2 caracteres').max(120, 'Máximo 120 caracteres').transform(s => s.trim()),
  definicion: z.string().min(20, 'La definición debe ser suficientemente descriptiva (mínimo 20 caracteres)').transform(s => s.trim()),
  categoria: z.enum(categoriasPermitidas, 'Categoría no permitida'),
  traduccion: z.string().max(255, 'Máximo 255 caracteres').optional().nullable(),
  idioma_origen: z.string().min(2).max(5).default('es'),
});

export const esquemaActualizarGlosario = esquemaCrearGlosario.partial().extend({
  id: z.string().uuid('id inválido').optional(),
  estado: z.enum(['PENDIENTE','EN_REVISION','APROBADO','RECHAZADO']).optional(),
  comentario_revision: z.string().max(1000).optional().nullable(),
});

export const esquemaAprobarGlosario = z.object({
  aprobado_por: z.string().uuid('id de aprobador inválido'),
  comentario_revision: z.string().max(1000).optional().nullable(),
});
