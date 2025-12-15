import type { FastifyPluginAsync } from 'fastify';
import rutaGlosario from './glosario';
import rutaADRs from './adrs';

const rutas: FastifyPluginAsync = async (fastify) => {
  await fastify.register(rutaGlosario);
  await fastify.register(rutaADRs);
};

export default rutas;
