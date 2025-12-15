---
adr: 0004
title: Owner assignment proposal for manifest entries
date: 2025-12-14
author: jhoavera
status: proposed
---

Context
-------
- The `config/structure_manifest.yml` contains 1049 entries parsed from the SSOT. A preliminary owners CSV is available `reports/manifest_owner_template_exact_md_filled.csv`.
- A subset of manifest entries remain unassigned. To facilitate ownership and maintenance, we propose a heuristic-based owner assignment in a reviewable CSV.

Proposal
--------
- Produce `reports/manifest_unassigned_paths.csv` with the unassigned paths for manual review.
- Produce `reports/manifest_owner_assignment_proposal.csv` with proposed owner assignments using a conservative heuristic map (api, domains, infra, data, frontend, scripts, etc.).
- Do not apply changes directly to the manifest without review and ADR approval. Once approved, an ADR will allow updating `config/structure_manifest.yml` or the `reports` CSVs accordingly.

Consequences
------------
- Speed up team allocation and code ownership clarity during repo bootstrapping.
- Preserve SSOT by not modifying `.md` sources or the manifest without explicit ADR approval.

Next steps
----------
1. Review `reports/manifest_owner_assignment_proposal.csv` and `reports/manifest_unassigned_paths.csv` by domain leads.
2. If approved, create a PR to update `reports/manifest_owner_template_exact_md_filled.csv` and then `config/structure_manifest.yml` as needed.

Aggressive pass
---------------
- Ejecuté una pasada heurística más agresiva para los 15 paths que seguían sin owner, generando `reports/manifest_owner_assignment_proposal_aggressive.csv` con propuestas asignadas (ningún path quedó sin asignar tras la pasada).
	- Objetivo: facilitar revisión rápida por los responsables y reducir trabajo manual. No se aplica automáticamente al manifiesto.

Approval
--------
- Approved-by: jhoavera
- Approved-at: 2025-12-14T01:12:00-05:00
- Approved-commit: 9085f18
