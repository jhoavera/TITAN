import { FastifyInstance } from 'fastify'
import * as ctrl from '../controladores/ops-controlador'

/**
 * Registrador legacy para operaciones (Ops).
 *
 * NOTA: Está planificada su completa migración a Hono según ADR 0001 - Migración de Fastify a Hono.
 * Mantener temporalmente para permitir comparación de comportamiento mediante pruebas de paridad
 * Fastify <-> Hono. Tras validar paridad y aprobar ADR, se eliminará la versión Fastify.
 * @deprecated Usar rutas Hono en `servidor-hono`.
 */
export default async function rutaOps(fastify: FastifyInstance) {
  fastify.post('/api/v1/ops/renombrar-por-adr', { schema: { tags: ['Ops'] } }, ctrl.renombrarPorADR)
}
