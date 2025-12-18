import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { SpawnSyncReturns } from 'child_process';
import { commandExists, findActLike, shouldSkipCheck, extractVersion, versionSatisfies } from '../../scripts/ci/check-act-prereqs';

describe('check-act-prereqs', () => {
  it('should report available when runner returns status 0', () => {
    const mockResult: SpawnSyncReturns<Buffer> = {
      pid: 1234,
      output: [],
      stdout: Buffer.from(''),
      stderr: Buffer.from(''),
      status: 0,
      signal: null,
    };

    const runner = (_cmd: string) => mockResult;

    expect(commandExists('act', runner)).toBe(true);
    const found = findActLike(runner);
    expect(found).not.toBeNull();
    expect(found?.command).toBe('act');
  });

  it('should report not found when runner returns non-zero', () => {
    const mockResult: SpawnSyncReturns<Buffer> = {
      pid: 0,
      output: [],
      stdout: Buffer.from(''),
      stderr: Buffer.from(''),
      status: 1,
      signal: null,
    };
    const runner = (_cmd: string) => mockResult;

    expect(commandExists('act', runner)).toBe(false);
    const found = findActLike(runner);
    expect(found).toBeNull();
  });

  it('should skip when CHECK_ACT_PRE=false', () => {
    process.env.CHECK_ACT_PRE = 'false';
    try {
      expect(shouldSkipCheck()).toBe(true);
    } finally {
      delete process.env.CHECK_ACT_PRE;
    }
  });

  it('should extract semver version from common output strings', () => {
    expect(extractVersion('act version 0.2.25')).toBeDefined();
    expect(extractVersion('bun 1.1.8')).toBeDefined();
    expect(extractVersion('no-version-here')).toBeNull();
  });

  it('should validate version satisfies range using runner', () => {
    const runner = (_cmd: string) => ({ pid: 1, output: [], stdout: Buffer.from('act version 0.2.25'), stderr: Buffer.from(''), status: 0, signal: null } as SpawnSyncReturns<Buffer>);

    expect(versionSatisfies('act', '>=0.2.0', runner)).toBe(true);
    expect(versionSatisfies('act', '>=1.0.0', runner)).toBe(false);
  });
});
