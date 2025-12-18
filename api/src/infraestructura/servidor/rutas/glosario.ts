import * as controlador from '../controladores/glosario-controlador';

/**
 * Legacy: registrador compatible con Fastify.
 *
 * NOTA: Este registrador está en proceso de migración a Hono. Mantenerlo por
 * compatibilidad temporal mientras verificamos paridad en pruebas E2E y de
 * integración. Después de validar paridad, se eliminará la versión Fastify.
 * @deprecated Use rutas/Hono y `servidor-hono` (ya registra handlers vía Hono)
 */
export type FastifyRegistrador = (fastify: { post: Function; get: Function; patch: Function; delete: Function }) => Promise<void>;

const rutaGlosario: FastifyRegistrador = async (fastify) => {
  fastify.post('/api/v1/glosario', { schema: { tags: ['Glosario'] } }, controlador.crear as any);
  fastify.get('/api/v1/glosario', { schema: { tags: ['Glosario'] } }, controlador.listar as any);
  fastify.get('/api/v1/glosario/:id', { schema: { tags: ['Glosario'] } }, controlador.obtenerPorId as any);
  fastify.patch('/api/v1/glosario/:id', { schema: { tags: ['Glosario'] } }, controlador.actualizar as any);
  fastify.delete('/api/v1/glosario/:id', { schema: { tags: ['Glosario'] } }, controlador.eliminar as any);
};

export default rutaGlosario;
