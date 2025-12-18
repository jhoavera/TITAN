import { describe, it, expect, beforeEach } from 'bun:test';
import fs from 'fs/promises';
import path from 'path';
import { ServicioLimpieza } from '@servicios/limpieza/servicio-limpieza';

const TMP = path.join(process.cwd(), 'tmp', 'test-limpieza-propuestas');

beforeEach(async () => {
  await fs.rm(TMP, { recursive: true }).catch(() => {});
  await fs.mkdir(TMP, { recursive: true });
  // crear ruta con término en inglés
  await fs.mkdir(path.join(TMP, 'migrations'), { recursive: true });
  await fs.writeFile(path.join(TMP, 'migrations', '0001_init.sql'), '');
});

describe('ServicioLimpieza -> integración ADR + Glosario', () => {
  it('al detectar término en inglés crea ADR y propuesta de glosario', async () => {
    const s = new ServicioLimpieza({ basePath: TMP });
    const propuestas = await s.proponerLimpieza();
    // debe incluir reportar-adr por palabra 'migrations'
    expect(propuestas.some((p) => p.tipo === 'reportar-adr')).toBeTruthy();

    const resultado = await s.ejecutarLimpieza(propuestas, { dryRun: false, commit: false, autor: { nombre: 'tester', email: 'tester@example.local' } });

    // buscar archivos de propuesta en glosario
    const { ServicioGlosario } = await import('@servicios/glosario/servicio-glosario');
    const sg = new ServicioGlosario(path.join(TMP, 'documentacion-fuente-unica-verdad', 'glosario-biblioteca'));
    const propuestasList = await sg.listarPropuestas();
    expect(propuestasList.length).toBeGreaterThan(0);

    // ADR creado (aplicadas incluye reportar-adr con texto 'ADR creado')
    expect(resultado.aplicadas.some((a) => a.tipo === 'reportar-adr' && (a as any).descripcion.includes('ADR creado'))).toBeTruthy();
  });
});
