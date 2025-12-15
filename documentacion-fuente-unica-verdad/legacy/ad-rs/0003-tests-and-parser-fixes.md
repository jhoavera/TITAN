---
adr: 0003
title: Tests non-interactive and manifest parser robustness
date: 2025-12-14
author: jhoavera
status: proposed
---

Context
-------
- Tests for `crear-estructura-titan-v13.sh` operated interactively when `PROJECT_ROOT` already existed, causing CI/local test hangs.
- The manifest parser relies on `python3 + PyYAML` when available; fallback parser triggers `set -u` unbound variable errors.

Decision
--------
- Tests will execute in isolated temporary directories (`--project-root` with `mktemp`) and set `--force` for `--apply` tests to avoid interactive prompts.
- The creation script `crear-estructura-titan-v13.sh` will safely initialize `PYTHON_CMD` and handle fallback parsing without raising `set -u` errors.

Consequences
------------
- Tests are deterministic and non-interactive; they are robust for local development and future CI adoption (local-only by policy).
- Script robustness improves; `--dry-run` behavior and fallback parser are less error-prone.
- A small change in test behavior ensures reproducible test outputs and avoids accidental deletions.

Implementation
--------------
- Update `scripts/despliegue/crear-estructura-titan-v13.sh` to initialize `PYTHON_CMD` safely when `set -u` is enabled.
- Update tests in `scripts/despliegue/tests/` to: 1) use `--project-root` on isolated `mktemp` directories, 2) add `--force` to `--apply` to skip user prompts, and 3) run parser fallback tests with `FORCE_BASH_MANIFEST_PARSER=1` when intended.

Rollback / Alternatives
----------------------
- Revert changes if interactive behavior is required for certain manual workflows; update test suite to simulate interactive behavior separately.
---

Approval
--------
- Approved-by: (pending)
