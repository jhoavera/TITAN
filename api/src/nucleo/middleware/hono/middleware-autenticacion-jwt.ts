import type { Context } from 'hono';

export function middlewareAutenticacionJWTHono() {
  return async (c: Context, next: () => Promise<void>) => {
    const headers: any = ((c as any).req && (c as any).req.headers) || ((c as any).request && (c as any).request.headers) || undefined;
    const auth = headers?.get?.('authorization') || '';
    if (!auth) {
      // acceso anónimo permitido; marcar usuario como null
      if (typeof (c as any).set === 'function') (c as any).set('usuario', null);
      await next();
      return;
    }

    const parts = auth.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
      return c.json({ error: 'Cabecera Authorization inválida' }, 400);
    }

    const token = parts[1];

    // Implementación mínima: token 'token-usuario-prueba' => usuario de prueba
    if (token === 'token-usuario-prueba') {
      const usuario = { id: 'USR-PRUEBA-0001', nombre: 'Usuario Prueba', rol: 'ADMIN' };
      (c as any).set?.('usuario', usuario);
      // Añadir cabecera para compatibilidad con adaptador
      c.header('x-usuario', JSON.stringify(usuario));
      await next();
      return;
    }

    // Token desconocido
    (c as any).set?.('usuario', null);
    await next();
  };
}
