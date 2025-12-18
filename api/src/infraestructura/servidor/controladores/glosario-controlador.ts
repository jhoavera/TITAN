/* Controlador mínimo para Glosario (operaciones CRUD básicas)
 * Usa validadores Zod y el repositorio.
 */
import type { RequestLike, ReplyLike } from '../types/handler';
import { esquemaCrearGlosario, esquemaActualizarGlosario } from '../../../nucleo/validadores/validador-glosario';
import { obtenerDb } from '../../base-de-datos/cliente';
import ServicioGlosario from '../../../servicios/glosario';

export const crear = async (request: RequestLike, reply: ReplyLike) => {
  let body: any
  try {
    body = await esquemaCrearGlosario.parseAsync(request.body);
  } catch (err: any) {
    // ZodError -> responder 400 con mensajes legibles
    return reply.code(400).send({ error: 'Datos inválidos', detalles: err.issues ?? err.message })
  }

  // Hook de pre-creación: validar nombre antes de reservar
  const { validarPreCreacion } = await import('../../../nucleo/hooks/validacion-precreacion')
  // 'slug' no está presente en el esquema de creación; usar 'termino' como identificador
  const pre = await validarPreCreacion(body.termino ?? '', 'glosario')
  const identificadorInquilino = (request as any).identificadorInquilino as string; // middleware debe establecerlo
  const autorId = (request as any).usuario?.id as string || 'UNKNOWN';

  // Preferir usar Drizzle/Repositorio si hay DATABASE_URL configurada; en caso contrario usar el servicio con persistencia JSON local
  if (process.env.DATABASE_URL) {
    const db = obtenerDb();
    const repoModule = await import('../../repositorios/repositorio-glosario');
    const creado = await repoModule.crearGlosario(db, body as any, identificadorInquilino, autorId);
    reply.code(201).send({ creado, preValidacion: pre });
    return;
  }

  const servicio = new ServicioGlosario();
  const creado = await servicio.crear({ termino: (body as any).termino, definicion: (body as any).definicion, autor: autorId });
  reply.code(201).send({ creado, preValidacion: pre });
};

export const listar = async (request: RequestLike, reply: ReplyLike) => {
  const query = (request.query ?? {}) as Record<string, unknown>;
  const identificadorInquilino = request.identificadorInquilino as string;

  if (process.env.DATABASE_URL) {
    const db = obtenerDb();
    const repoModule = await import('../../repositorios/repositorio-glosario');
    const rows = await repoModule.obtenerListaGlosario(db, { query: query.q as string | undefined, estado: query.estado as string | undefined, limit: query.limit ? Number(query.limit) : undefined, offset: query.offset ? Number(query.offset) : undefined }, identificadorInquilino);
    reply.send(rows);
    return;
  }

  const servicio = new ServicioGlosario();
  // Soporta 'q' y 'query' para compatibilidad
  const qParam = (query.q as string | undefined) ?? (query.query as string | undefined)
  let rows = await servicio.listar()

  // Filtrar por texto (término/definición) - normalización Unicode (tilde-insensible)
  if (qParam) {
    const normalize = (s: string) => s.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase()
    const q = normalize(qParam)
    rows = rows.filter((t) => normalize(t.termino).includes(q) || normalize(t.definicion).includes(q))
  }

  // Filtrar por estado (case-insensitive)
  if (query.estado) {
    const estado = String(query.estado).toLowerCase()
    rows = rows.filter((t) => String((t.estado ?? '')).toLowerCase() === estado)
  }

  // Paginación: limit/offset
  const limit = query.limit ? Number(query.limit) : undefined
  const offset = query.offset ? Number(query.offset) : undefined
  if (typeof offset === 'number' && typeof limit === 'number') {
    rows = rows.slice(offset, offset + limit)
  } else if (typeof limit === 'number') {
    rows = rows.slice(0, limit)
  }

  reply.send(rows);
};

export const obtenerPorId = async (request: RequestLike, reply: ReplyLike) => {
  const id = (request.params ?? {})['id'] as string;
  const identificadorInquilino = request.identificadorInquilino as string;

  if (process.env.DATABASE_URL) {
    const db = obtenerDb();
    const repoModule = await import('../../repositorios/repositorio-glosario');
    const row = await repoModule.obtenerTerminoPorId(db, id, identificadorInquilino);
    if (!row) return reply.code(404).send({ error: 'Término no encontrado' });
    reply.send(row);
    return;
  }

  const servicio = new ServicioGlosario();
  const found = (await servicio.listar()).find((t) => t.id === id);
  if (!found) return reply.code(404).send({ error: 'Término no encontrado' });
  reply.send(found);
};

export const actualizar = async (request: RequestLike, reply: ReplyLike) => {
  const id = (request.params ?? {})['id'] as string;
  const body = await esquemaActualizarGlosario.parseAsync(request.body);
  const identificadorInquilino = request.identificadorInquilino as string;

  if (process.env.DATABASE_URL) {
    const db = obtenerDb();
    const repoModule = await import('../../repositorios/repositorio-glosario');
    const actualizado = await repoModule.actualizarGlosario(db, id, body as any, identificadorInquilino);
    reply.send(actualizado);
    return;
  }

  const servicio = new ServicioGlosario();
  const actualizado = await servicio.actualizar(id, body as any);
  if (!actualizado) return reply.code(404).send({ error: 'Término no encontrado' });
  reply.send(actualizado);
};

export const eliminar = async (request: RequestLike, reply: ReplyLike) => {
  const id = (request.params ?? {})['id'] as string;
  const identificadorInquilino = request.identificadorInquilino as string;

  if (process.env.DATABASE_URL) {
    const db = obtenerDb();
    const repoModule = await import('../../repositorios/repositorio-glosario');
    await repoModule.eliminarGlosario(db, id, identificadorInquilino);
    reply.code(204).send();
    return;
  }

  const servicio = new ServicioGlosario();
  const ok = await servicio.eliminar(id);
  if (!ok) return reply.code(404).send({ error: 'Término no encontrado' });
  reply.code(204).send();
};
