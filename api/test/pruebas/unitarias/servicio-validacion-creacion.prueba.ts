import { describe, it, expect, beforeEach } from 'vitest';
import { validarYRegistrarNombre, detectarIngles } from '@nucleo/servicios/servicio-validacion-creacion';
import { promises as fs } from 'fs';
import path from 'path';

describe('Servicio validación creación', () => {
  const rutaPropuestas = path.join(process.cwd(), 'documentacion-fuente-unica-verdad', 'glosario-biblioteca', 'propuestas');

  beforeEach(async () => {
    // limpiar carpeta de propuestas si existe
    try { await fs.rm(rutaPropuestas, { recursive: true, force: true }); } catch (_err) {}
  });

  it('valida nombre correcto y no crea propuesta', async () => {
    const res = await validarYRegistrarNombre('repositorio-auditoria-evitar-duplicado.prueba.ts');
    expect(res.valido).toBe(true);
    expect(res.propuesta).toBeNull();
  });

  it('detecta inglés e inserta propuesta en glosario', async () => {
    const res = await validarYRegistrarNombre('create-adrs-template');
    expect(res.valido).toBe(true);
    expect(res.propuesta).toBeTruthy();
    // archivo creado
    const existe = await fs.stat(res.propuesta).then(() => true).catch(() => false);
    expect(existe).toBe(true);
  });

  it('nombre no válido genera propuesta y devuelve razones', async () => {
    const res = await validarYRegistrarNombre('NombreConMayus Test');
    expect(res.valido).toBe(false);
    expect(res.razones.length).toBeGreaterThan(0);
    expect(res.propuesta).toBeTruthy();
    const existe = await fs.stat(res.propuesta).then(() => true).catch(() => false);
    expect(existe).toBe(true);
  });
});
