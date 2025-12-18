import { describe, it, expect } from 'vitest'
import { tryInstallGh, isNodePresent, tryRemoveNode, EnsureResult } from '@scripts/ci/ensure-tools'

function makeRunner(status: number, stdout = '', stderr = '') {
  return (_cmd: string) => ({ status, stdout: Buffer.from(stdout), stderr: Buffer.from(stderr) } as any)
}

describe('ensure-tools basic tests', () => {
  it('tryInstallGh returns error when installer not supported', () => {
    const runner = (_cmd: string) => ({ status: 1, stdout: Buffer.from('Darwin'), stderr: Buffer.from('not supported') }) as any
    const res: EnsureResult = tryInstallGh(runner as any)
    expect(res.present).toBe(false)
    expect(res.installed).toBe(false)
    expect(res.error).toBeDefined()
  })

  it('isNodePresent uses command runner', () => {
    const runner = makeRunner(0, '/usr/bin/node')
    expect(isNodePresent(runner as any)).toBe(true)
  })

  it('tryRemoveNode warns when sudo not allowed', () => {
    const runner = makeRunner(0, '/usr/bin/node')
    const res = tryRemoveNode(runner as any)
    expect(res.attemptedInstall).toBe(true)
    expect(res.error).toContain('ENSURE_TOOLS_ALLOW_SUDO')
  })
})
import { describe, it, expect } from 'vitest';
import { tryInstallBun, tryInstallAct, tryInstallPsql, tryInstallQdrant, summarize, EnsureResult } from '@scripts/ci/ensure-tools';
import { SpawnSyncReturns } from 'child_process';

describe('ensure-tools', () => {
  it('no hace nada si bun y act ya presentes', () => {
    const runner = (cmd: string) => {
      if (cmd === 'bun' || cmd.includes('command -v bun')) return { status: 0, pid: 0, stdout: Buffer.from('/usr/bin/bun') } as SpawnSyncReturns<Buffer>;
      if (cmd === 'act' || cmd.includes('command -v act')) return { status: 0, pid: 0, stdout: Buffer.from('/usr/bin/act') } as SpawnSyncReturns<Buffer>;
      return { status: 0, pid: 0, stdout: Buffer.from(''), stderr: Buffer.from('') } as SpawnSyncReturns<Buffer>;
    };
    const bun = tryInstallBun(runner as any);
    const act = tryInstallAct(runner as any);
    expect(bun.present).toBe(true);
    expect(act.present).toBe(true);
    const s = summarize([bun, act]);
    expect(s).toContain('TODO BIEN');
  });

  it('intenta instalar bun y tiene éxito', () => {
    let installerCalled = false;
    const dynamicRunner = (cmd: string) => {
      if (cmd === 'bun' || cmd.includes('command -v bun')) return installerCalled ? { status: 0, pid: 0, stdout: Buffer.from('/home/.bun/bin/bun') } as SpawnSyncReturns<Buffer> : { status: 1, pid: 0, stdout: Buffer.from('') } as SpawnSyncReturns<Buffer>;
      if (cmd.includes('curl -fsSL https://bun.sh/install')) {
        installerCalled = true;
        return { status: 0, pid: 0, stdout: Buffer.from('ok') } as SpawnSyncReturns<Buffer>;
      }
      return { status: 0, pid: 0, stdout: Buffer.from(''), stderr: Buffer.from('') } as SpawnSyncReturns<Buffer>;
    };
    const bun = tryInstallBun(dynamicRunner as any);
    expect(bun.attemptedInstall).toBe(true);
    expect(bun.installed).toBe(true);
  });

  it('falla al intentar instalar act en plataforma no soportada', () => {
    const runner = (cmd: string) => {
      if (cmd === 'act' || cmd.includes('command -v act')) return { status: 1, pid: 0, stdout: Buffer.from('') } as SpawnSyncReturns<Buffer>;
      if (cmd.includes('uname -s')) return { status: 0, pid: 0, stdout: Buffer.from('Darwin') } as SpawnSyncReturns<Buffer>;
      return { status: 0, pid: 0, stdout: Buffer.from(''), stderr: Buffer.from('') } as SpawnSyncReturns<Buffer>;
    };
    const act = tryInstallAct(runner as any);
    expect(act.attemptedInstall).toBe(true);
    expect(act.installed).toBe(false);
    expect(act.error).toContain('no soporta');
  });

  it('aggressive intenta instalar psql y qdrant', () => {
    let aptUpdated = false;
    let pulled = false;
    const runner = (cmd: string) => {
      if (cmd.includes('command -v psql')) return aptUpdated ? { status: 0, pid: 0, stdout: Buffer.from('/usr/bin/psql') } as SpawnSyncReturns<Buffer> : { status: 1, pid: 0, stdout: Buffer.from('') } as SpawnSyncReturns<Buffer>;
      if (cmd.includes('apt-get update')) { aptUpdated = true; return { status: 0, pid: 0, stdout: Buffer.from('ok') } as SpawnSyncReturns<Buffer>; }
      if (cmd.includes('apt-get install -y postgresql-client')) return { status: 0, pid: 0, stdout: Buffer.from('installed') } as SpawnSyncReturns<Buffer>;
      if (cmd.includes('command -v docker')) return { status: 0, pid: 0, stdout: Buffer.from('/usr/bin/docker') } as SpawnSyncReturns<Buffer>;
      if (cmd.includes('docker pull qdrant/qdrant:1.9.0')) { pulled = true; return { status: 0, pid: 0, stdout: Buffer.from('pulled') } as SpawnSyncReturns<Buffer>; }
      return { status: 1, pid: 0, stdout: Buffer.from(''), stderr: Buffer.from('') } as SpawnSyncReturns<Buffer>;
    };

    const psql = tryInstallPsql(runner as any);
    expect(psql.attemptedInstall).toBe(true);
    expect(psql.installed).toBe(true);

    const qdr = tryInstallQdrant(runner as any);
    expect(qdr.attemptedInstall).toBe(true);
    expect(qdr.installed).toBe(true);
  });

  it('intenta mover act y reintenta con sudo cuando está permitido', () => {
    let downloaded = false;
    let moved = false;
    const runner = (cmd: string) => {
      if (cmd.includes('command -v act')) return moved ? { status: 0, pid: 0, stdout: Buffer.from('/usr/local/bin/act') } as SpawnSyncReturns<Buffer> : { status: 1, pid: 0, stdout: Buffer.from('') } as SpawnSyncReturns<Buffer>;
      if (cmd.includes('curl -fsSL -o')) { downloaded = true; return { status: 0, pid: 0, stdout: Buffer.from('ok') } as SpawnSyncReturns<Buffer>; }
      // detect mkdir+piping to mv into local bin
      if (cmd.includes('mv') && cmd.includes('$HOME/.local/bin')) return { status: 1, pid: 0, stdout: Buffer.from('') } as SpawnSyncReturns<Buffer>;
      if (cmd.includes('mv') && cmd.includes('/usr/local/bin/act') && !cmd.startsWith('sudo ')) return { status: 1, pid: 0, stdout: Buffer.from('') } as SpawnSyncReturns<Buffer>;
      if (cmd.includes('sudo mv ')) { moved = true; return { status: 0, pid: 0, stdout: Buffer.from('') } as SpawnSyncReturns<Buffer>; }
      if (cmd.includes('chmod')) return { status: 0, pid: 0, stdout: Buffer.from('') } as SpawnSyncReturns<Buffer>;
      if (cmd.includes('uname -s')) return { status: 0, pid: 0, stdout: Buffer.from('Linux') } as SpawnSyncReturns<Buffer>;
      if (cmd.includes('uname -m')) return { status: 0, pid: 0, stdout: Buffer.from('x86_64') } as SpawnSyncReturns<Buffer>;
      return { status: 0, pid: 0, stdout: Buffer.from(''), stderr: Buffer.from('') } as SpawnSyncReturns<Buffer>;
    };
    process.env.ENSURE_TOOLS_ALLOW_SUDO = '1';
    const act = tryInstallAct(runner as any);
    expect(act.attemptedInstall).toBe(true);
    expect(act.installed).toBe(true);
    delete process.env.ENSURE_TOOLS_ALLOW_SUDO;
  });

  it('intenta instalar psql y reintenta con sudo cuando está permitido', () => {
    let aptUpdated = false;
    const runner = (cmd: string) => {
      if (cmd.includes('command -v psql')) return aptUpdated ? { status: 0, pid: 0, stdout: Buffer.from('/usr/bin/psql') } as SpawnSyncReturns<Buffer> : { status: 1, pid: 0, stdout: Buffer.from('') } as SpawnSyncReturns<Buffer>;
      if (cmd.includes('apt-get update') && !cmd.startsWith('sudo')) { return { status: 1, pid: 0, stdout: Buffer.from('') } as SpawnSyncReturns<Buffer>; }
      if (cmd.includes('sudo apt-get update')) { aptUpdated = true; return { status: 0, pid: 0, stdout: Buffer.from('ok') } as SpawnSyncReturns<Buffer>; }
      if (cmd.includes('apt-get install -y postgresql-client') && !cmd.startsWith('sudo')) return { status: 1, pid: 0, stdout: Buffer.from('') } as SpawnSyncReturns<Buffer>;
      if (cmd.includes('sudo apt-get install')) return { status: 0, pid: 0, stdout: Buffer.from('installed') } as SpawnSyncReturns<Buffer>;
      return { status: 1, pid: 0, stdout: Buffer.from(''), stderr: Buffer.from('') } as SpawnSyncReturns<Buffer>;
    };
    process.env.ENSURE_TOOLS_ALLOW_SUDO = '1';
    const psql = tryInstallPsql(runner as any);
    expect(psql.attemptedInstall).toBe(true);
    expect(psql.installed).toBe(true);
    delete process.env.ENSURE_TOOLS_ALLOW_SUDO;
  });
});
