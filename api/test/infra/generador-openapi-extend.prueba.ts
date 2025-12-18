import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { convertZod, generateOpenApiYAML } from '@infraestructura/documentacion/generador-openapi';

describe('generador-openapi extendido', () => {
  it('convierte arrays y formatos (email, uuid)', () => {
    const esquema = z.object({
      correos: z.array(z.string().email()),
      ids: z.array(z.string().uuid()),
    });

    const converted = convertZod(esquema as any) as Record<string, any>;
    expect(converted.type).toBe('object');
    expect(converted.properties.correos.type).toBe('array');
    expect(converted.properties.correos.items.format).toBe('email');
    expect(converted.properties.ids.items.format).toBe('uuid');
  });

  it('incluir seguridad y ejemplos en YAML generado', () => {
    const yaml = generateOpenApiYAML();
    expect(yaml).toContain('bearerAuth');
    expect(yaml).toContain('security:');
    expect(yaml).toContain('examples:');
  });
});
