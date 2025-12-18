import { describe, it, expect, beforeEach } from 'bun:test';
import fs from 'fs/promises';
import path from 'path';
import { spawnSync } from 'child_process';

const TMP = path.join(process.cwd(), 'tmp', 'test-aprobacion');

beforeEach(async () => {
  await fs.rm(TMP, { recursive: true }).catch(() => {});
  await fs.mkdir(TMP, { recursive: true });
  // preparar reporte de dedup para que revisarYProponerAprobaciones lo lea
  const DEDUP = path.join(process.cwd(), 'reports', 'dedup-propuestas.json');
  await fs.mkdir(path.dirname(DEDUP), { recursive: true });
  await fs.writeFile(DEDUP, JSON.stringify({ grupos: [{ clave: 'archivo-duplicado', archivos: ['/tmp/a','/tmp/b'] }] }, null, 2));

  // crear un ADR que mencione el termino 'archivo-duplicado' en la carpeta que validarPropuesta encontrará
  const ADR_DIR = path.join(process.cwd(), 'documentacion-fuente-unica-verdad', 'ad-rs');
  await fs.mkdir(ADR_DIR, { recursive: true });
  const adrPath = path.join(ADR_DIR, '000-test-aprobacion-archivo-duplicado.md');
  const contenido = `# ADR 000 - Test\n\n**Autor:** tester\n**Fecha:** ${new Date().toISOString()}\n**Estado:** pendiente\n\n## Contexto\nSe detectó 'archivo-duplicado'\n`;
  await fs.writeFile(adrPath, contenido, 'utf-8');

  // stub validarSemantica para devolver score alto: se hace replacing del módulo
  const semModPath = path.join(process.cwd(), 'src', 'servicios', 'servicio-validacion-semantica.ts');
  // crear un stub si no existe
  await fs.writeFile(semModPath, `export async function validarSemantica(_term:string,_suggest?:string){ return { valido:true, score:0.95, explicacion:'ok', razon: null } }`, { encoding: 'utf8' });
});

describe('Aprobación automática ADRs', () => {
  it('aplica aprobaciones automáticas cuando las validaciones son satisfactorias', async () => {
    const mod = await import(`file://${path.join(process.cwd(), 'src', 'servicios', 'servicio-aprobacion-adrs.ts')}`);
    const { aplicarAprobacionesAutomaticas } = mod;

    const res = await aplicarAprobacionesAutomaticas({ dryRun: false, runTests: false, commit: false });
    expect(res.testsPassed).toBe(true);
    expect(res.aplicadas.length).toBeGreaterThanOrEqual(1);

    // comprobar que ADR fue actualizado a 'aprobado'
    const ADR_DIR = path.join(process.cwd(), 'documentacion-fuente-unica-verdad', 'ad-rs');
    const archivos = await fs.readdir(ADR_DIR);
    const adr = archivos.find(a => a.includes('000-test-aprobacion-archivo-duplicado'));
    const cont = await fs.readFile(path.join(ADR_DIR, adr!), 'utf-8');
    expect(cont).toMatch(/\*\*Estado:\*\*\s*aprobado/);
  });
});
