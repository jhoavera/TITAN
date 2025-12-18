import { describe, it, expect, beforeAll, afterEach } from 'vitest';
import { ServicioGlosario } from '@servicios/glosario';
import fs from 'fs';
import path from 'path';

describe('servicio glosario (CRUD)', () => {
  const tmp = path.resolve(process.cwd(), 'tmp-glosario-test.json');
  let servicio: ServicioGlosario;

  beforeAll(() => {
    if (fs.existsSync(tmp)) fs.unlinkSync(tmp);
    servicio = new ServicioGlosario(tmp);
  });

  it('crea y lista términos', async () => {
    const t = await servicio.crear({ termino: 'migra', definicion: 'ejemplo', autor: 'tester' });
    const lista = await servicio.listar();
    expect(lista.length).toBeGreaterThan(0);
    expect(lista[0].termino).toBe('migra');
  });

  it('busca términos por texto', async () => {
    await servicio.crear({ termino: 'migraciones', definicion: 'colección de scripts', autor: 'tester' });
    const encontrados = await servicio.buscar('migra');
    expect(encontrados.length).toBeGreaterThan(0);
  });

  it('actualiza y elimina', async () => {
    const creado = await servicio.crear({ termino: 'temporal', definicion: 'a eliminar', autor: 'tester' });
    const actualizado = await servicio.actualizar(creado.id, { estado: 'aprobado' });
    expect(actualizado?.estado).toBe('aprobado');
    const ok = await servicio.eliminar(creado.id);
    expect(ok).toBe(true);
  });
});
