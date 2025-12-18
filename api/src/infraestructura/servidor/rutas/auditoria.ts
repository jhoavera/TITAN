import { FastifyInstance } from 'fastify'
import * as controlador from '@infraestructura/servidor/controladores/auditoria-controlador'

/**
 * Registrador legacy para auditoría.
 *
 * NOTA: Está planificada su completa migración a Hono según ADR 0001 - Migración de Fastify a Hono.
 * Mantener temporalmente para permitir comparación de comportamiento mediante pruebas de paridad
 * Fastify <-> Hono. Tras validar paridad y aprobar ADR, se eliminará la versión Fastify.
 * @deprecated Usar rutas Hono en `servidor-hono`.
 */
export default async function rutaAuditoria(fastify: FastifyInstance) {
  fastify.get('/api/v1/auditoria/prevalidacion', { schema: { tags: ['Auditoria'] } }, controlador.listarPreValidacion)
  fastify.get('/metrics', { schema: { tags: ['Metrics'] } }, controlador.metrics)
}
