import { describe, it, expect } from 'vitest';
import { generateOpenApiYAML } from '../../src/infraestructura/documentacion/generador-openapi';

describe('generador-openapi automática', () => {
  it('incluye rutas detectadas y referencias a schemas por endpoint', () => {
    const yaml = generateOpenApiYAML();
    expect(yaml).toContain('/api/v1/adrs');
    expect(yaml).toContain('CrearADR');
    // POST debe incluir examples generados
    expect(yaml).toContain('examples:');
  });
});
