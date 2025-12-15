/* Middleware de autenticación JWT (simplificado)
 * - Todo en español técnico empresarial
 * - Implementación mínima: verifica formato Authorization: Bearer <token>
 * - En entorno real, sustituir por verificación JWT real y verificación de firma.
 */
import type { FastifyPluginAsync } from 'fastify';

const middlewareAutenticacionJWT: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('preHandler', async (request, reply) => {
    const auth = (request.headers['authorization'] || '') as string;
    if (!auth) {
      // No autenticación: permitimos acceso anónimo para endpoints públicos; si requiere auth, el handler deberá exigirlo.
      (request as any).usuario = null;
      return;
    }

    const parts = auth.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      reply.code(400).send({ error: 'Cabecera Authorization inválida' });
      return;
    }

    const token = parts[1];

    // Implementación mínima: token 'token-usuario-prueba' => usuario de prueba.
    // En producción: validar JWT y extraer claims.
    if (token === 'token-usuario-prueba') {
      (request as any).usuario = { id: 'USR-PRUEBA-0001', nombre: 'Usuario Prueba', rol: 'ADMIN' };
    } else {
      // Token desconocido: marcar como no autenticado
      (request as any).usuario = null;
    }
  });
};

export default middlewareAutenticacionJWT;
