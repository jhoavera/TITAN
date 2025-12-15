/* Middleware de contexto inquilino
 * - Extrae el identificador del inquilino desde header `x-identificador-inquilino` o de `request.usuario`.
 * - Establece `request.identificadorInquilino` para uso posterior.
 */
import type { FastifyPluginAsync } from 'fastify';

const middlewareContextoInquilino: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', async (request, reply) => {
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

    // Si no hay contexto de inquilino, responder con error 400 para endpoints que lo requieren
    // Para endpoints públicos, los controladores pueden manejar la ausencia.
    (request as any).identificadorInquilino = null;
  });
};

export default middlewareContextoInquilino;
