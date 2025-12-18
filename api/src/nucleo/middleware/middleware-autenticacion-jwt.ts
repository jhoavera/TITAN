/* Middleware de autenticación JWT (simplificado)
 * - Todo en español técnico empresarial
 * - Implementación mínima: verifica formato Authorization: Bearer <token>
 * - En entorno real, sustituir por verificación JWT real y verificación de firma.
 */
// Registrador legacy compatible con Fastify; la versión Hono está en 'nucleo/middleware/hono'.
export default async function middlewareAutenticacionJWT(fastify: { addHook?: Function }) {
  if (typeof fastify.addHook !== 'function') return;
  fastify.addHook('preHandler', async (request: any, reply: any) => {
    const auth = (request.headers['authorization'] || '') as string;
    if (!auth) {
      (request as any).usuario = null;
      return;
    }

    const parts = auth.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      reply.code?.(400).send?.({ error: 'Cabecera Authorization inválida' });
      return;
    }

    const token = parts[1];

    if (token === 'token-usuario-prueba') {
      (request as any).usuario = { id: 'USR-PRUEBA-0001', nombre: 'Usuario Prueba', rol: 'ADMIN' };
    } else {
      (request as any).usuario = null;
    }
  });
}
