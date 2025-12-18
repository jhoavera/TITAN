import { describe, it, expect } from 'vitest';
import { spawnSync } from 'child_process';
import { tmpdir } from 'os';
import { mkdtempSync, writeFileSync, chmodSync } from 'fs';
import { join } from 'path';

describe('ensure-tools script (integración mínima)', () => {
  it('devuelve exit 0 y resumen TODO BIEN cuando bun y act están en PATH', () => {
    const dir = mkdtempSync(join(tmpdir(), 'fake-bin-'));
    const bunPath = join(dir, 'bun');
    const actPath = join(dir, 'act');
    writeFileSync(bunPath, '#!/bin/sh\necho bun v1.1.8\nexit 0\n');
    writeFileSync(actPath, '#!/bin/sh\necho act v0.2.0\nexit 0\n');
    chmodSync(bunPath, 0o755);
    chmodSync(actPath, 0o755);

    // Ejecutar la función main directamente para evitar dependencias del runner
    const envBackup = { ...process.env };
    process.env.PATH = `${dir}:${process.env.PATH}`;
    const outBuf: string[] = [];
    const origWrite = process.stdout.write;
    // Capturar stdout
    (process.stdout as any).write = (chunk: any) => { outBuf.push(String(chunk)); return true; };
    const ensure = require('@scripts/ci/ensure-tools');
    const code = ensure.main();
    // Restaurar
    (process.stdout as any).write = origWrite;
    // Restauración segura del environment: eliminar claves añadidas y restaurar valores originales
    const preKeys = Object.keys(envBackup);
    for (const k of Object.keys(process.env)) {
      if (!preKeys.includes(k)) delete process.env[k];
    }
    Object.assign(process.env, envBackup);

    expect(code).toBe(0);
    expect(outBuf.join('')).toContain('TODO BIEN');
  });

  it('sale con código distinto de 0 y muestra FALLÓ cuando no hay herramientas y auto-install desactivado', () => {
    // Forzar simulación de ausencia de herramientas para que la prueba sea determinística
    const envBackup = { ...process.env };
    process.env.ENSURE_TOOLS_AUTO_INSTALL = '0';
    process.env.ENSURE_TOOLS_SIMULATE_NO_TOOLS = '1';

    const outBuf: string[] = [];
    const origWrite = process.stdout.write;
    (process.stdout as any).write = (chunk: any) => { outBuf.push(String(chunk)); return true; };

    const ensure = require('@scripts/ci/ensure-tools');
    const code = ensure.main();

    (process.stdout as any).write = origWrite;
    // Restauración segura del environment: eliminar claves añadidas y restaurar valores originales
    const preKeys2 = Object.keys(envBackup);
    for (const k2 of Object.keys(process.env)) {
      if (!preKeys2.includes(k2)) delete process.env[k2];
    }
    Object.assign(process.env, envBackup);
    expect(code).not.toBe(0);
    expect(outBuf.join('')).toContain('Resumen: FALLÓ');
  });
});
