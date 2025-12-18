/* Tipos mínimos para handlers HTTP independendientes de Fastify
 * Usados para facilitar migración a Hono y permitir eliminar dependencia de fastify
 */
export interface UsuarioIdentificado {
  id: string;
  nombre?: string;
  rol?: string;
}

export interface RequestLike {
  body?: unknown;
  params?: Record<string, string>;
  query?: Record<string, unknown>;
  headers?: Record<string, string | undefined>;
  identificadorInquilino?: string;
  usuario?: UsuarioIdentificado | null;
}

export interface ReplyLike {
  code(status: number): ReplyLike;
  send(payload?: unknown): unknown;
  type?(contentType: string): ReplyLike;
}

export type HandlerFn = (request: RequestLike, reply: ReplyLike) => Promise<unknown> | unknown;
