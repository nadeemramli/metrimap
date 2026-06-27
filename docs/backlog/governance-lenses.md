# Feature plan: Governance lenses (PARKED)

> **Status:** PARKED — captured now so the framing isn't lost; to be developed **after** data-source + RCA + accountability are scoped (governance sits on top of them). Do not implement yet.
> **Methodology tie:** business reviews, "drill the reds," dashboards by limb — [methodology §Applications](../reference/metric-tree-methodology.md#6-applications-why-its-transformational).

## The core framing (from discussion 2026-06-27)

Governance isn't one feature — it's a **view layer serving two jobs-to-be-done over the same tree**:

- **Explorers** — want to test ideas and see consequences: "if I change this input, what happens downstream?" Served by simulation (operator / `runSimulation`), evidence/experiment progress, confidence maturity ("turn dashed lines solid").
- **Deciders** — want fast answers to act: "what's the trend? how much to spend? should we continue?" Served by review/alerting and "drill the reds."

The five aspects raised map onto these two lenses:
- *Ownership* + *evidence-maturity* + *experiment-progress* → mostly **Explorer** support.
- *Review/alerting* + *progress-checking* → mostly **Decider** support.

## Why this is downstream
- The **Decider** lens needs RCA/drift + real data (reds to drill).
- The **Explorer** lens needs simulation + accountability (whose lever, whose experiment).
- So scope this once those exist.

## To resolve when we pick this up
- Is "governance" a distinct surface/mode, or just saved views/filters over the canvas?
- What is a "red"? (threshold breach, drift detected, stale confidence?)
- Alerting delivery — in-app only, or external (email/Slack)? (external = server-side work)
- How do the two lenses relate to accountability roll-ups (the "everything X owns" view)?
