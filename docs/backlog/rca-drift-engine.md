# Feature plan: RCA + drift-factor engine

> **Status:** DRAFT (design only — not scheduled, not auto-built). Discuss before implementing.
> **Depends on:** real metric data → [Data Source architecture](./data-source-architecture.md). The engine is only as good as the `MetricValue[]` it reads.
> **Methodology:** [RCA + the five causal factors of metric drift](../reference/metric-tree-methodology.md#5-diagnosis--prediction).

## The good news: the data model is already there

No schema change needed to start. The types already encode the methodology:
- `CausalFactor` = `'Component Drift' | 'Temporal Variance' | 'Influence Drift' | 'Dimension Drift' | 'Event Shocks'` — the five factors verbatim.
- `MetricCard.data: MetricValue[]` — time series (period/value/change%/trend).
- `MetricCard.formula` — for component math.
- `MetricCard.segments` / `dimensions` — for mix-shift.
- `Relationship.history` (`changeType: 'strength' | 'confidence'`) — already commented *"for influence drift analysis."*
- `compute.worker.ts` — correlation compute already exists (for influence strength).

What's missing is the **attribution engine** that reads these and explains a deviation. `MetricCard.causalFactors` then changes from a manual tag into engine-produced output.

## The mechanism

Methodology's "Five Whys down the tree": given an output metric that drifted (observed vs expected), attribute the deviation across its children, then recurse on the largest contributor. Each tier answers a different "why."

## Phasing — by computability (each tier's "computable from" becomes its `(!)` tooltip via InfoHint)

| Tier | Factor | Computable from | Notes |
|---|---|---|---|
| **1** | **Component drift** | `formula` + each input's `data` | Pure variance decomposition over an identity. Deterministic, needs nothing new. **Start here.** |
| **2** | **Dimension drift** | `segments` / `dimensions` | Within-slice change vs mix-shift (composition). Needs sliced data populated. |
| **3** | **Temporal variance** | `data` history | Compare vs same-period-prior / a baseline (seasonality model). |
| **4** | **Influence drift** | `Relationship.history` + influence's `data` + correlation worker | Distinguish "influence value moved" from "coefficient moved." |
| **5** | **Event shocks** | an event/annotation log | Correlate timing to logged events. **Log mostly absent today** — biggest new infra. |

Ship tier 1 end-to-end (detect → attribute → explain in the panel) before adding tiers. A working "Revenue is down because ASP fell, not volume" beats a half-built five-factor engine.

## Output / UX

- On a drifted metric, show the attributed breakdown ("X% from component A, Y% from mix shift") with the dominant factor highlighted.
- Auto-populate `causalFactors` from the engine; let users confirm/override.
- "Drill the reds" review surface (ties to the governance Decider lens).

## Caveats to be honest about
- Causation isn't inferred from stats alone — the tree's semantic structure is what makes attribution meaningful (methodology's point). Don't present correlation as cause.
- Drift is usually **multiple factors at once**; report the set with contributions, not a single "the cause."
- Garbage in, garbage out: tier accuracy depends entirely on data quality from the Source feature.

## Decisions (resolved 2026-06-27)
1. **Baseline = naive prior period first**, upgrade to moving-average / fitted seasonality later.
2. **Engine runs client-side** (`compute.worker.ts`) for tiers 1–2; revisit server for large data.
3. **Recompute attribution on demand** first; persist results only if it proves expensive.
