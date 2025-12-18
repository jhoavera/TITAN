import rutaGlosario from '@infraestructura/servidor/rutas/glosario';
import rutaADRs from '@infraestructura/servidor/rutas/adrs';
import rutaAuditoria from '@infraestructura/servidor/rutas/auditoria';

// Registrador legacy compatible con Fastify. En migración a Hono, es deprecado.
export type FastifyRegistrador = (fastify: { register: Function }) => Promise<void>;

const rutas: FastifyRegistrador = async (fastify) => {
  await fastify.register(rutaGlosario as any);
  await fastify.register(rutaADRs as any);
  await fastify.register(rutaAuditoria as any);
  const rutaOps = await import('./ops');
  await fastify.register(rutaOps.default);
};

export default rutas;
