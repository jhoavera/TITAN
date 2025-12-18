/* Controlador mínimo para ADRs (operaciones CRUD básicas)
 */
import type { RequestLike, ReplyLike } from '@infraestructura/servidor/types/handler';
import { esquemaCrearADR, esquemaActualizarADR } from '@nucleo/validadores/validador-adrs';
import * as repo from '@infraestructura/repositorios/repositorio-adrs';
import { obtenerDb } from '@infraestructura/base-de-datos/cliente';

export const crear = async (request: RequestLike, reply: ReplyLike) => {
  const body = await esquemaCrearADR.parseAsync(request.body);
  // Hook de pre-creación: validar nombre/slug antes de reservar
  const { validarPreCreacion } = await import('../../../nucleo/hooks/validacion-precreacion')
  const slug = body.slug ?? (body.archivo_markdown ?? 'adr-' + (body.numero ?? '0000'))
  const pre = await validarPreCreacion(slug, 'adr')
  const identificadorInquilino = (request as any).identificadorInquilino as string;
  const autorId = (request as any).usuario?.id as string || 'UNKNOWN';
  let db: any;
  try { db = obtenerDb(); } catch (_err) { db = {}; }
  const repoModule = await import('../../repositorios/repositorio-adrs');
  const creado = await repoModule.crearADR(db, body as any, identificadorInquilino, autorId);
  reply.code(201).send({ creado, preValidacion: pre });
};

export const listar = async (request: RequestLike, reply: ReplyLike) => {
  const query = request.query ?? {} as Record<string, unknown>;
  const identificadorInquilino = request.identificadorInquilino as string;
  let db: any;
  try { db = obtenerDb(); } catch (_err) { db = {}; }
  const repoModule = await import('../../repositorios/repositorio-adrs');
  const rows = await repoModule.obtenerListaADRs(db, { estado: query.estado, limit: query.limit ? Number(query.limit) : undefined, offset: query.offset ? Number(query.offset) : undefined }, identificadorInquilino);
  reply.send(rows);
};

export const obtenerPorId = async (request: RequestLike, reply: ReplyLike) => {
  const id = (request.params ?? {})['id'] as string;
  const identificadorInquilino = request.identificadorInquilino as string;
  let db: any;
  try { db = obtenerDb(); } catch (_err) { db = {}; }
  const repoModule = await import('../../repositorios/repositorio-adrs');
  const row = await repoModule.obtenerADRPorId(db, id, identificadorInquilino);
  if (!row) return reply.code(404).send({ error: 'ADR no encontrado' });
  reply.send(row);
};

export const actualizar = async (request: RequestLike, reply: ReplyLike) => {
  const id = (request.params ?? {})['id'] as string;
  const body = await esquemaActualizarADR.parseAsync(request.body);
  // Aceptar git_ref cuando se aprueba desde flujo E2E/operaciones (se mantiene explícito)
  const raw = request.body as any;
  const payload = { ...body as any, ...(raw?.git_ref ? { git_ref: raw.git_ref } : {}) };
  const identificadorInquilino = (request as any).identificadorInquilino as string;
  let db: any;
  try { db = obtenerDb(); } catch (_err) { db = {}; }
  const repoModule = await import('../../repositorios/repositorio-adrs');
  const actualizado = await repoModule.actualizarADR(db, id, payload as any, identificadorInquilino);
  reply.send(actualizado);
};

export const eliminar = async (request: RequestLike, reply: ReplyLike) => {
  const id = (request.params ?? {})['id'] as string;
  const identificadorInquilino = request.identificadorInquilino as string;
  let db: any;
  try { db = obtenerDb(); } catch (_err) { db = {}; }
  const repoModule = await import('../../repositorios/repositorio-adrs');
  await repoModule.eliminarADR(db, id, identificadorInquilino);
  reply.code(204).send();
};
