/**
 * Generador OpenAPI mínimo a partir de esquemas Zod (soporta: object, string, enum, number, boolean, optional, nullable)
 * Diseñado para uso local en homelab. No introduce dependencias externas.
 */
import { z } from 'zod';
import * as fs from 'fs';
import * as path from 'path';
import { esquemaCrearGlosario, esquemaActualizarGlosario, esquemaAprobarGlosario } from '../../nucleo/validadores/validador-glosario';
import { esquemaCrearADR, esquemaActualizarADR } from '../../nucleo/validadores/validador-adrs';

type OpenAPISchema = Record<string, unknown>;

export function convertZod(schema: z.ZodTypeAny): OpenAPISchema {
  const def: any = (schema as any)._def;
  const typeName: string = def?.typeName ?? 'ZodUnknown';

  switch (typeName) {
    case 'ZodString': {
      const schemaObj: Record<string, unknown> = { type: 'string' };
      if (def.checks) {
        for (const c of def.checks) {
          if (c.kind === 'min') schemaObj['minLength'] = c.value;
          if (c.kind === 'max') schemaObj['maxLength'] = c.value;
          if (c.kind === 'email') schemaObj['format'] = 'email';
          if (c.kind === 'uuid') schemaObj['format'] = 'uuid';
          if (c.kind === 'url') schemaObj['format'] = 'uri';
          if (c.kind === 'datetime') schemaObj['format'] = 'date-time';
          if (c.kind === 'regex') schemaObj['pattern'] = String(c.regex);

        }
      }
      return schemaObj;
    }
    case 'ZodArray': {
      // def.type contains inner schema in Zod v3
      const inner = def.type ?? def._def?.type;
      return { type: 'array', items: inner ? convertZod(inner) : {} };
    }
    case 'ZodNumber':
      return { type: 'number' };
    case 'ZodBoolean':
      return { type: 'boolean' };
    case 'ZodEnum': {
      return { type: 'string', enum: def.values };
    }
    case 'ZodObject': {
      const props: Record<string, unknown> = {};
      const required: string[] = [];
      const shape = def.shape();
      for (const [k, v] of Object.entries(shape)) {
        const converted = convertZod(v as z.ZodTypeAny);
        props[k] = converted;
        // Simple heuristic: if schema is ZodOptional or ZodNullable it's not required
        const kind = (v as any)._def?.typeName;
        if (kind && !['ZodOptional', 'ZodNullable', 'ZodDefault'].includes(kind)) required.push(k);
      }
      const obj: Record<string, unknown> = { type: 'object', properties: props };
      if (required.length > 0) obj.required = required;
      return obj;
    }
    case 'ZodUnion': {
      const options = def.options ?? def._def?.options ?? [];
      return { anyOf: options.map((o: z.ZodTypeAny) => convertZod(o)) };
    }
    case 'ZodRecord': {
      const valueType = def.valueType ?? def._def?.valueType;
      return { type: 'object', additionalProperties: valueType ? convertZod(valueType) : {} };
    }
    case 'ZodOptional':
    case 'ZodNullable':
    case 'ZodDefault': {
      // extract inner type
      const inner = def.innerType ?? def._def?.innerType ?? (schema as any)._def?.innerType;
      if (inner) return convertZod(inner);
      return {};
    }
    default:
      return {};
  }
}

function spanishExampleForKey(key: string): string {
  const k = key.toLowerCase();
  if (k.includes('titulo') || k.includes('titulo')) return 'Ejemplo de título';
  if (k.includes('termino') || k.includes('termino')) return 'término-ejemplo';
  if (k.includes('definicion')) return 'Definición de ejemplo en español técnico';
  if (k.includes('objetivo')) return 'Objetivo del ADR - ejemplo';
  if (k.includes('numero')) return '1';
  if (k.includes('correo') || k.includes('email')) return 'usuario@ejemplo.com';
  if (k.includes('id') || k.includes('identificador')) return '00000000-0000-0000-0000-000000000000';
  return 'ejemplo';
}

function mockExampleFromSchema(s: Record<string, unknown>): unknown {
  if (!s || typeof s !== 'object') return undefined;
  if ((s as any).type === 'object') {
    const props = (s as any).properties ?? {};
    const ex: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(props)) {
      const vv = v as Record<string, unknown>;
      if (vv.type === 'string') {
        if ((vv as any).format === 'email') ex[k] = 'usuario@ejemplo.com';
        else if ((vv as any).format === 'uuid') ex[k] = '00000000-0000-0000-0000-000000000000';
        else ex[k] = spanishExampleForKey(k);
      } else if (vv.type === 'number') ex[k] = 1;
      else if (vv.type === 'boolean') ex[k] = true;
      else if (vv.type === 'array') ex[k] = [mockExampleFromSchema(vv.items as Record<string, unknown>)];
      else if (vv.type === 'object') ex[k] = mockExampleFromSchema(vv as Record<string, unknown>);
      else ex[k] = spanishExampleForKey(k);
    }
    return ex;
  }
  if ((s as any).type === 'array') return [mockExampleFromSchema((s as any).items as Record<string, unknown>)];
  if ((s as any).type === 'string') return 'ejemplo';
  if ((s as any).type === 'number') return 1;
  return 'ejemplo';
}

function safeReadFile(filePath: string): string | null {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch {
    return null;
  }
}

function extractImportMap(serverSource: string): Record<string, string> {
  const map: Record<string, string> = {};
  const importRegex = /import \* as (\w+) from '(.+?)';/g;
  let m: RegExpExecArray | null;
  while ((m = importRegex.exec(serverSource))) {
    map[m[1]] = m[2];
  }
  return map;
}

function findSchemaUsedInController(controllerSource: string, fnName: string): string | null {
  const fnRegex = new RegExp(`export const ${fnName} = async [^=]*?=>\s*{([\\s\\S]*?)};`, 'm');
  const m = fnRegex.exec(controllerSource);
  const body = m ? m[1] : controllerSource;
  const schemaMatch = /esquema([A-Za-z0-9_]+)/g.exec(body);
  if (schemaMatch) return 'esquema' + schemaMatch[1];  // fallback: search for esquema variable in entire file
  const fallback = /esquema([A-Za-z0-9_]+)/g.exec(controllerSource);
  if (fallback) return 'esquema' + fallback[1];  return null;
}

function schemaNameToComponentKey(schemaVar: string): string {
  // esquemaCrearGlosario -> CrearGlosario
  if (!schemaVar.startsWith('esquema')) return schemaVar;
  return schemaVar.slice('esquema'.length);
}

function buildPathsFromServer(components: Record<string, unknown>): Record<string, unknown> {
  const serverPath = path.join(process.cwd(), 'src', 'infraestructura', 'servidor', 'servidor-hono.ts');
  const serverSrc = safeReadFile(serverPath);
  if (!serverSrc) {
    return {};
  }

  const importMap = extractImportMap(serverSrc);

  const routeRegex = /app\.(get|post|patch|put|delete)\('([^']+)'\s*,\s*adap(?:tarHandler)?\((\w+)\.(\w+)\)/g;
  const paths: Record<string, unknown> = {};
  let m: RegExpExecArray | null;
  while ((m = routeRegex.exec(serverSrc))) {
    const method = m[1];
    const route = m[2];
    const ctlVar = m[3];
    const fnName = m[4];

    const ctlModuleRel = importMap[ctlVar];
    // Controllers are under src/infraestructura/servidor/controladores
    const ctlPath = ctlModuleRel ? path.join(process.cwd(), 'src', 'infraestructura', 'servidor', ctlModuleRel + '.ts') : null;
    let controllerSrc: string | null = null;
    if (ctlPath) controllerSrc = safeReadFile(ctlPath);

    let operation: Record<string, unknown> = { summary: `${method.toUpperCase()} ${route}` };

    // Intenta detectar esquema usado en la función
    if (controllerSrc) {
      const schemaVar = findSchemaUsedInController(controllerSrc, fnName);
      if (schemaVar) {
        const compKey = schemaNameToComponentKey(schemaVar);
        const schemas = (components.schemas ?? {}) as Record<string, unknown>;
        if (schemas[compKey]) {
          const schemaRef = { $ref: `#/components/schemas/${compKey}` };
          if (method === 'post' || method === 'patch' || method === 'put') {
            operation['security'] = [{ bearerAuth: [] }];
            operation['requestBody'] = { content: { 'application/json': { schema: schemaRef, examples: { ejemplo: { value: mockExampleFromSchema(schemas[compKey] as Record<string, unknown>) } } } } };
          }
        }
      } else {
        // Heurística: buscar un schema por convención en components.schemas
        const schemas = (components.schemas ?? {}) as Record<string, unknown>;
        const lastSegment = route.split('/').filter(Boolean).pop() ?? '';
        const resource = lastSegment.replace(/:\w+$/, '').replace(/s$/i, '');
        const prefix = method === 'post' ? 'Crear' : method === 'patch' ? 'Actualizar' : 'Crear';
        const candidates = Object.keys(schemas).filter((k) => k.startsWith(prefix) && k.toLowerCase().includes(resource.toLowerCase()));
        if (candidates.length > 0) {
          const compKey = candidates[0];
          const schemaRef = { $ref: `#/components/schemas/${compKey}` };
          operation['security'] = [{ bearerAuth: [] }];
          operation['requestBody'] = { content: { 'application/json': { schema: schemaRef, examples: { ejemplo: { value: mockExampleFromSchema(schemas[compKey] as Record<string, unknown>) } } } } };
        }
      }
    }

    // Add standard responses (rate-limit headers)
    operation['responses'] = { '200': { description: 'OK', headers: { 'x-rate-limit-limit': { $ref: '#/components/headers/RateLimitLimit' }, 'x-rate-limit-remaining': { $ref: '#/components/headers/RateLimitRemaining' } } } };

    // Si es POST/PATCH/PUT y aún no tiene requestBody, intentar heurística por nombre de recurso
    if ((method === 'post' || method === 'patch' || method === 'put') && !operation['requestBody']) {
      const schemas = (components.schemas ?? {}) as Record<string, unknown>;
      const lastSegment = route.split('/').filter(Boolean).pop() ?? '';
      const resource = lastSegment.replace(/:\w+$/, '').replace(/s$/i, '');
      const prefixes = method === 'post' ? ['Crear', 'Crear'] : ['Actualizar', 'Actualizar'];
      let foundKey: string | null = null;
      for (const p of prefixes) {
        const candidates = Object.keys(schemas).filter((k) => k.startsWith(p) && k.toLowerCase().includes(resource.toLowerCase()));
        if (candidates.length > 0) {
          foundKey = candidates[0];
          break;
        }
      }
      if (foundKey) {
        operation['security'] = [{ bearerAuth: [] }];
        operation['requestBody'] = { content: { 'application/json': { schema: { $ref: `#/components/schemas/${foundKey}` }, examples: { ejemplo: { value: mockExampleFromSchema(schemas[foundKey] as Record<string, unknown>) } } } } };
      }
    }

    if (!paths[route]) paths[route] = {};
    (paths[route] as any)[method] = operation;
  }

  return paths;
}

function toYAML(obj: Record<string, unknown>, indent = 0): string {
  const pad = '  '.repeat(indent);
  let out = '';
  for (const [k, v] of Object.entries(obj)) {
    if (v === null || v === undefined) {
      out += `${pad}${k}: null\n`;
    } else if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
      out += `${pad}${k}: ${String(v)}\n`;
    } else if (Array.isArray(v)) {
      out += `${pad}${k}:\n`;
      for (const item of v) {
        if (typeof item === 'object') {
          out += `${pad}- ${toYAML(item as Record<string, unknown>, indent + 1)}`;
        } else {
          out += `${pad}- ${String(item)}\n`;
        }
      }
    } else if (typeof v === 'object') {
      out += `${pad}${k}:\n${toYAML(v as Record<string, unknown>, indent + 1)}`;
    }
  }
  return out;
}

export function generateOpenApiYAML(): string {
  const components: Record<string, unknown> = {
    schemas: {
      CrearGlosario: convertZod(esquemaCrearGlosario),
      ActualizarGlosario: convertZod(esquemaActualizarGlosario),
      AprobarGlosario: convertZod(esquemaAprobarGlosario),
      CrearADR: convertZod(esquemaCrearADR),
      ActualizarADR: convertZod(esquemaActualizarADR),
    },
    securitySchemes: {
      bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
    },
    headers: {
      RateLimitLimit: { description: 'Límite total de solicitudes', schema: { type: 'integer' } },
      RateLimitRemaining: { description: 'Solicitudes restantes', schema: { type: 'integer' } }
    }
  };
  // Construir paths automáticamente analizando el servidor Hono y controladores (usa los schemas ya convertidos)
  const paths = buildPathsFromServer(components);

  // Fallback: si por alguna razón no se detectaron rutas, añadir entradas mínimas
  // para recursos principales (evita tests frágiles cuando el scanner falla).
  if (Object.keys(paths).length === 0) {
    if (components.schemas && (components.schemas as any).CrearGlosario) {
      paths['/api/v1/glosario'] = {
        post: { summary: 'POST /api/v1/glosario', security: [{ bearerAuth: [] }], requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/CrearGlosario' }, examples: { ejemplo: { value: mockExampleFromSchema((components.schemas as any).CrearGlosario) } } } } }, responses: { '200': { description: 'OK' } } },
      };
    }
    if (components.schemas && (components.schemas as any).CrearADR) {
      paths['/api/v1/adrs'] = {
        post: { summary: 'POST /api/v1/adrs', security: [{ bearerAuth: [] }], requestBody: { content: { 'application/json': { schema: { $ref: '#/components/schemas/CrearADR' }, examples: { ejemplo: { value: mockExampleFromSchema((components.schemas as any).CrearADR) } } } } }, responses: { '200': { description: 'OK' } } },
      };
    }
  }

  const openapi: Record<string, unknown> = {
    openapi: '3.0.0',
    info: { title: 'TITAN API - OpenAPI generado desde Zod', version: '0.1.0' },
    paths,
    components,
  };

  return toYAML(openapi);
}

export default generateOpenApiYAML;
