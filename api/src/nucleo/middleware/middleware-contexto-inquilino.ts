/* Middleware de contexto inquilino
 * - Extrae el identificador del inquilino desde header `x-identificador-inquilino` o de `request.usuario`.
 * - Establece `request.identificadorInquilino` para uso posterior.
 */
// Legacy Fastify middleware compatible registrador. Mantener hasta completar eliminación de Fastify.
export default async function middlewareContextoInquilino(fastify: { addHook: Function }) {
  fastify.addHook('preHandler', async (request: any, reply: any) => {
    const header = (request.headers['x-identificador-inquilino'] || '') as string;
    if (header) {
      (request as any).identificadorInquilino = header;
      return;
    }

    // Si no hay header, intentar extraer del usuario autenticado (claim)
    const usuario = (request as any).usuario;
    if (usuario && usuario.inquilino) {
      (request as any).identificadorInquilino = usuario.inquilino;
      return;
    }

    (request as any).identificadorInquilino = null;
  });
}
