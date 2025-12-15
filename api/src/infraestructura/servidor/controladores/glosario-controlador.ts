/* Controlador mínimo para Glosario (operaciones CRUD básicas)
 * Usa validadores Zod y el repositorio.
 */
import type { FastifyReply, FastifyRequest } from 'fastify';
import { esquemaCrearGlosario, esquemaActualizarGlosario } from '../../../nucleo/validadores/validador-glosario';
import * as repo from '../../repositorios/repositorio-glosario';
import { obtenerDb } from '../../base-de-datos/cliente';

export const crear = async (request: FastifyRequest, reply: FastifyReply) => {
  const body = await esquemaCrearGlosario.parseAsync(request.body as any);
  const identificadorInquilino = (request as any).identificadorInquilino as string; // middleware debe establecerlo
  const autorId = (request as any).usuario?.id as string || 'UNKNOWN';
  const db = obtenerDb();
  const creado = await repo.crearGlosario(db, body as any, identificadorInquilino, autorId);
  reply.code(201).send(creado);
};

export const listar = async (request: FastifyRequest, reply: FastifyReply) => {
  const query = request.query as any;
  const identificadorInquilino = (request as any).identificadorInquilino as string;
  const db = obtenerDb();
  const rows = await repo.obtenerListaGlosario(db, { query: query.q, estado: query.estado, limit: query.limit ? Number(query.limit) : undefined, offset: query.offset ? Number(query.offset) : undefined }, identificadorInquilino);
  reply.send(rows);
};

export const obtenerPorId = async (request: FastifyRequest, reply: FastifyReply) => {
  const id = (request.params as any).id as string;
  const identificadorInquilino = (request as any).identificadorInquilino as string;
  const db = obtenerDb();
  const row = await repo.obtenerTerminoPorId(db, id, identificadorInquilino);
  if (!row) return reply.code(404).send({ error: 'Término no encontrado' });
  reply.send(row);
};

export const actualizar = async (request: FastifyRequest, reply: FastifyReply) => {
  const id = (request.params as any).id as string;
  const body = await esquemaActualizarGlosario.parseAsync(request.body as any);
  const identificadorInquilino = (request as any).identificadorInquilino as string;
  const db = obtenerDb();
  const actualizado = await repo.actualizarGlosario(db, id, body as any, identificadorInquilino);
  reply.send(actualizado);
};

export const eliminar = async (request: FastifyRequest, reply: FastifyReply) => {
  const id = (request.params as any).id as string;
  const identificadorInquilino = (request as any).identificadorInquilino as string;
  const db = obtenerDb();
  await repo.eliminarGlosario(db, id, identificadorInquilino);
  reply.code(204).send();
};
