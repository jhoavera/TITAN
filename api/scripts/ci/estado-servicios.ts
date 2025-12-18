#!/usr/bin/env node
import { spawnSync } from 'child_process';

type Check = { name: string; cmd: string; ok: boolean; version?: string | null; info?: string };

function run(cmd: string): { ok: boolean; out: string } {
  const r = spawnSync('sh', ['-c', cmd], { stdio: 'pipe' });
  const out = (r.stdout && r.stdout.toString()) || (r.stderr && r.stderr.toString()) || '';
  return { ok: r.status === 0, out: out.trim() };
}

function extractVersion(s: string | null | undefined): string | null {
  if (!s) return null;
  const m = s.match(/\d+(?:\.\d+)+/);
  return m ? m[0] : null;
}

export function estadoServicios(): Check[] {
  const lista: Array<{ name: string; cmd: string; versionCmd?: string }> = [
    { name: 'bun', cmd: 'command -v bun >/dev/null 2>&1', versionCmd: 'bun --version' },
    { name: 'node', cmd: 'command -v node >/dev/null 2>&1', versionCmd: 'node --version' },
    { name: 'pnpm', cmd: 'command -v pnpm >/dev/null 2>&1', versionCmd: 'pnpm --version' },
    { name: 'docker', cmd: 'command -v docker >/dev/null 2>&1', versionCmd: 'docker --version' },
    { name: 'docker-compose', cmd: 'docker compose version >/dev/null 2>&1', versionCmd: 'docker compose version' },
    { name: 'psql', cmd: 'command -v psql >/dev/null 2>&1', versionCmd: 'psql --version' },
    { name: 'act', cmd: 'command -v act >/dev/null 2>&1', versionCmd: 'act --version' },
  ];

  const results: Check[] = [];
  for (const it of lista) {
    const chk = run(it.cmd);
    let ver: string | null = null;
    if (chk.ok && it.versionCmd) {
      const v = run(it.versionCmd);
      ver = extractVersion(v.out) ?? null;
    }
    results.push({ name: it.name, cmd: it.cmd, ok: chk.ok, version: ver, info: chk.ok ? (ver ? `v${ver}` : 'disponible') : 'no disponible' });
  }
  return results;
}

// Ejecutar solo si se invoca como script (CJS o ESM compatible)
const __isMainEstado = (() => {
  try {
    const g = globalThis as unknown as { require?: { main?: unknown } };
    if (typeof g.require === 'function') {
      return (g.require as { main?: unknown }).main === module;
    }
  } catch (e) {
    // ignore
  }
  try {
    const script = process.argv[1] || '';
    return script.includes('estado-servicios') && (script.endsWith('.ts') || script.endsWith('.js'));
  } catch (e) {
    return false;
  }
})();

if (__isMainEstado) {
  const res = estadoServicios();
  for (const r of res) {
    // eslint-disable-next-line no-console
    console.log(`${r.ok ? '✅' : '❌'} ${r.name}: ${r.info}${r.version ? ` (${r.version})` : ''}`);
  }
  const allOk = res.every((r) => r.ok);
  // eslint-disable-next-line no-console
  console.log('---');
  // eslint-disable-next-line no-console
  console.log(allOk ? 'Estado: STACK MODERNO DISPONIBLE — agentes y herramientas pueden usar los servicios localmente.' : 'Estado: FALTAN COMPONENTES — instala o revisa las herramientas indicadas arriba.');
  process.exit(allOk ? 0 : 2);
}
