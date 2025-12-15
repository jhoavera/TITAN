import type { FastifyPluginAsync } from 'fastify';
import * as controlador from '../controladores/adrs-controlador';

const rutaADRs: FastifyPluginAsync = async (fastify) => {
  fastify.post('/api/v1/adrs', { schema: { tags: ['ADRs'] } }, controlador.crear);
  fastify.get('/api/v1/adrs', { schema: { tags: ['ADRs'] } }, controlador.listar);
  fastify.get('/api/v1/adrs/:id', { schema: { tags: ['ADRs'] } }, controlador.obtenerPorId);
  fastify.patch('/api/v1/adrs/:id', { schema: { tags: ['ADRs'] } }, controlador.actualizar);
  fastify.delete('/api/v1/adrs/:id', { schema: { tags: ['ADRs'] } }, controlador.eliminar);
};

export default rutaADRs;
