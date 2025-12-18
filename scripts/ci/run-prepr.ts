#!/usr/bin/env bun
import { spawnSync } from 'child_process';
const args = process.argv.slice(2);
const res = spawnSync('bun', ['api/scripts/ci/run-prepr.ts', ...args], { stdio: 'inherit' });
process.exit(res.status ?? 1);
