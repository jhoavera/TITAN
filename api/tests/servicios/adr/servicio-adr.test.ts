import { describe, it, expect, beforeEach } from 'bun:test';
import { ServicioADR } from '@servicios/adr/servicio-adr';
import fs from 'fs/promises';
import path from 'path';

const TMP = path.join(process.cwd(), 'tmp', 'test-adrs');

beforeEach(async () => {
  await fs.rm(TMP, { recursive: true }).catch(() => {});
  await fs.mkdir(TMP, { recursive: true });
});

describe('ServicioADR (scaffold)', () => {
  it('debe crear un ADR válido y escribirlo en disco', async () => {
    const servicio = new ServicioADR(TMP);
    const adr = await servicio.crearADR({ titulo: 'Decisión de Prueba', autor: 'tester', objetivo: 'Probar', decision: 'Aplicar X' });
    expect(adr.titulo).toBe('Decisión de Prueba');
    const lista = await servicio.listarADR();
    expect(lista.length).toBe(1);
    const contenido = await fs.readFile(lista[0].ruta, 'utf8');
    expect(contenido).toContain('Decisión de Prueba');
  });

  it('debe rechazar creación de ADR si el título contiene términos en inglés', async () => {
    const servicio = new ServicioADR(TMP);
    let thrown = false;
    try {
      await servicio.crearADR({ titulo: 'Propuesta migration fix', autor: 'tester', objetivo: 'Probar', decision: 'Aplicar X' });
    } catch (err: any) {
      thrown = true;
      expect(err.message).toMatch(/indicios de inglés/i);
    }
    expect(thrown).toBe(true);
  });
});
