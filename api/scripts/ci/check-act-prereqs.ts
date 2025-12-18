#!/usr/bin/env node
import { spawnSync, SpawnSyncReturns } from 'child_process';

type CheckResult = {
  command: string;
  found: boolean;
};

export function commandExists(command: string, runner?: (command: string) => SpawnSyncReturns<Buffer>): boolean {
  const run = runner ?? ((_: string) => spawnSync('sh', ['-c', `command -v ${command} >/dev/null 2>&1`]));
  const result = run(command);
  return result.status === 0;
}

export function findActLike(runner?: (command: string) => SpawnSyncReturns<Buffer>): CheckResult | null {
  const candidates = ['act', 'bunx'];
  for (const cmd of candidates) {
    if (commandExists(cmd, runner)) {
      return { command: cmd, found: true };
    }
  }
  return null;
}

export function shouldSkipCheck(): boolean {
  const raw = process.env.CHECK_ACT_PRE;
  if (!raw) return false;
  const v = raw.trim().toLowerCase();
  return v === 'false' || v === '0' || v === 'no' || v === 'off';
}

export function extractVersion(output: string | null | undefined): string | null {
  if (!output) return null;
  const s = output.trim();
  // Intentar extraer un número semver con semver.coerce
  // Devolver null si no puede extraer
  // Se hace require aquí para evitar cargar semver cuando no se usa en tests simples
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const semver = require('semver') as typeof import('semver');
  const coerced = semver.coerce(s);
  return coerced ? coerced.version : null;
}

export function versionSatisfies(command: string, range: string, runnerVersion?: (cmd: string) => SpawnSyncReturns<Buffer>): boolean {
  const run = runnerVersion ?? ((cmd: string) => spawnSync(cmd, ['--version']));
  const res = run(command);
  const out = (res.stdout && res.stdout.toString()) || (res.stderr && res.stderr.toString()) || '';
  const ver = extractVersion(out);
  if (!ver) return false;
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const semver = require('semver') as typeof import('semver');
  return semver.satisfies(ver, range);
}

export function main(): void {
  if (shouldSkipCheck()) {
    // eslint-disable-next-line no-console
    console.log('Verificación SKIP: CHECK_ACT_PRE desactivado.');
    process.exit(0);
  }

  const found = findActLike();
  if (found) {
    const minRange = process.env.CHECK_ACT_MIN_VERSION;
    if (minRange) {
      const ok = versionSatisfies(found.command, minRange);
      if (!ok) {
        // eslint-disable-next-line no-console
        console.error(`ERROR: '${found.command}' versión no cumple con '${minRange}'.`);
        process.exit(1);
      }
    }
    // eslint-disable-next-line no-console
    console.log(`Verificación OK: '${found.command}' detectado.`);
    process.exit(0);
  }

  // eslint-disable-next-line no-console
  console.error("ERROR: Ninguno de los comandos 'act' o 'bunx' está instalado. Instala 'act' o 'bun' (con 'bunx').");
  process.exit(1);
}

if (require.main === module) {
  main();
}

