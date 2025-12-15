import { describe, it, expect } from 'vitest';
import { esquemaCrearADR, esquemaActualizarADR } from '../../../src/nucleo/validadores/validador-adrs';

describe('Validador ADR - unidad', () => {
  it('valida una ADR válida', async () => {
    const entrada = {
      numero: 1,
      titulo: 'Decisión sobre elección de ORM para proyecto TITAN',
      objetivo: 'Establecer un ORM que permita multi-inquilino y TypeScript strict',
      decision: 'Se eligió Drizzle ORM por ser liviano y type-safe',
    };

    const parsed = await esquemaCrearADR.parseAsync(entrada as any);
    expect(parsed.numero).toBe(1);
    expect(parsed.titulo).toContain('ORM');
  });

  it('rechaza numero inválido', async () => {
    const entrada = { numero: -5, titulo: 'Titulo válido largo', objetivo: 'Objetivo válido largo', decision: 'Decisión con detalle suficiente' } as any;
    await expect(esquemaCrearADR.parseAsync(entrada)).rejects.toBeTruthy();
  });

  it('esquemaActualizar acepta estado y notas', async () => {
    const entrada = { id: '00000000-0000-0000-0000-000000000000', estado: 'APROBADO', notas_revision: 'Aprobado por parecer correcto' } as any;
    const parsed = await esquemaActualizarADR.parseAsync(entrada);
    expect(parsed.estado).toBe('APROBADO');
  });
});
