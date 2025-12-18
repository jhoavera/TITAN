import { describe, it, expect } from 'vitest';
import { generateOpenApiYAML } from '../../src/infraestructura/documentacion/generador-openapi';

describe('generador-openapi', () => {
  it('genera YAML con componentes para Glosario y ADRs', () => {
    const yaml = generateOpenApiYAML();
    expect(yaml).toContain('openapi: 3.0.0');
    expect(yaml).toContain('CrearGlosario');
    expect(yaml).toContain('CrearADR');
  });
});
