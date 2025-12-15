import type { FastifyPluginAsync } from 'fastify';
import * as controlador from '../controladores/glosario-controlador';

const rutaGlosario: FastifyPluginAsync = async (fastify) => {
  fastify.post('/api/v1/glosario', { schema: { tags: ['Glosario'] } }, controlador.crear);
  fastify.get('/api/v1/glosario', { schema: { tags: ['Glosario'] } }, controlador.listar);
  fastify.get('/api/v1/glosario/:id', { schema: { tags: ['Glosario'] } }, controlador.obtenerPorId);
  fastify.patch('/api/v1/glosario/:id', { schema: { tags: ['Glosario'] } }, controlador.actualizar);
  fastify.delete('/api/v1/glosario/:id', { schema: { tags: ['Glosario'] } }, controlador.eliminar);
};

export default rutaGlosario;
