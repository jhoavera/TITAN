import { describe, it, expect } from 'vitest';
import { esquemaCrearGlosario, esquemaActualizarGlosario, categoriasPermitidas } from '../../../src/nucleo/validadores/validador-glosario';

describe('Validador Glosario - unidad', () => {
  it('valida correctamente una entrada válida', async () => {
    const entrada = {
      termino: '  Inyección de dependencias  ',
      definicion: 'Patrón de diseño que permite inyectar dependencias en lugar de instanciarlas directamente.',
      categoria: categoriasPermitidas[0],
      traduccion: 'Dependency Injection',
      idioma_origen: 'es',
    };

    const parsed = await esquemaCrearGlosario.parseAsync(entrada as any);
    expect(parsed.termino).toBe('Inyección de dependencias');
    expect(parsed.definicion).toContain('Patrón de diseño');
  });

  it('rechaza término demasiado corto', async () => {
    const entrada = { termino: 'A', definicion: 'Definición lo suficientemente larga para pasar el mínimo requisito.', categoria: categoriasPermitidas[0] };
    await expect(esquemaCrearGlosario.parseAsync(entrada as any)).rejects.toBeTruthy();
  });

  it('esquemaActualizar permite parcialidad y estados', async () => {
    const entrada = { id: '00000000-0000-0000-0000-000000000000', estado: 'APROBADO' } as any;
    const parsed = await esquemaActualizarGlosario.parseAsync(entrada);
    expect(parsed.estado).toBe('APROBADO');
  });
});
