/* Controlador mínimo para ADRs (operaciones CRUD básicas)
 */
import type { FastifyReply, FastifyRequest } from 'fastify';
import { esquemaCrearADR, esquemaActualizarADR } from '../../../nucleo/validadores/validador-adrs';
import * as repo from '../../repositorios/repositorio-adrs';
import { obtenerDb } from '../../base-de-datos/cliente';

export const crear = async (request: FastifyRequest, reply: FastifyReply) => {
  const body = await esquemaCrearADR.parseAsync(request.body as any);
  const identificadorInquilino = (request as any).identificadorInquilino as string;
  const autorId = (request as any).usuario?.id as string || 'UNKNOWN';
  const db = obtenerDb();
  const creado = await repo.crearADR(db, body as any, identificadorInquilino, autorId);
  reply.code(201).send(creado);
};

export const listar = async (request: FastifyRequest, reply: FastifyReply) => {
  const query = request.query as any;
  const identificadorInquilino = (request as any).identificadorInquilino as string;
  const db = obtenerDb();
  const rows = await repo.obtenerListaADRs(db, { estado: query.estado, limit: query.limit ? Number(query.limit) : undefined, offset: query.offset ? Number(query.offset) : undefined }, identificadorInquilino);
  reply.send(rows);
};

export const obtenerPorId = async (request: FastifyRequest, reply: FastifyReply) => {
  const id = (request.params as any).id as string;
  const identificadorInquilino = (request as any).identificadorInquilino as string;
  const db = obtenerDb();
  const row = await repo.obtenerADRPorId(db, id, identificadorInquilino);
  if (!row) return reply.code(404).send({ error: 'ADR no encontrado' });
  reply.send(row);
};

export const actualizar = async (request: FastifyRequest, reply: FastifyReply) => {
  const id = (request.params as any).id as string;
  const body = await esquemaActualizarADR.parseAsync(request.body as any);
  // Aceptar git_ref cuando se aprueba desde flujo E2E/operaciones (se mantiene explícito)
  const raw = request.body as any;
  const payload = { ...body as any, ...(raw?.git_ref ? { git_ref: raw.git_ref } : {}) };
  const identificadorInquilino = (request as any).identificadorInquilino as string;
  const db = obtenerDb();
  const actualizado = await repo.actualizarADR(db, id, payload as any, identificadorInquilino);
  reply.send(actualizado);
};

export const eliminar = async (request: FastifyRequest, reply: FastifyReply) => {
  const id = (request.params as any).id as string;
  const identificadorInquilino = (request as any).identificadorInquilino as string;
  const db = obtenerDb();
  await repo.eliminarADR(db, id, identificadorInquilino);
  reply.code(204).send();
};
