import { z } from 'zod'

export const esquemaRenombrado = z.object({
  adrRuta: z.string().min(1),
  ops: z.array(z.object({ desde: z.string().min(1), hacia: z.string().min(1) })).min(1),
  raiz: z.string().optional(),
  mensaje: z.string().optional(),
})

export type EsquemaRenombrado = z.infer<typeof esquemaRenombrado>
