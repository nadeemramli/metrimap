# Handoff brief: Product System page on canvasm.app

**To:** canvasm.app site agent (repo `canvasm.app`, Next.js App Router + Tailwind + MDX)
**From:** Metrimap app (repo `metric-mapping`)
**Linear:** builds on CVS-286 (Product System section, Done) · consumes the output of CVS-301 (in-app Product System Flow visualizer, shipped to main `e6dead0`). Track your work as a new issue in the *Public site - canvasm.app* project, related to both.

---

## 1. What changed and why you're getting this

The six "product system" flows the site currently shows as hand-written marketing copy now live in the **app** as a canonical, versioned registry. The app renders them in-product (Home → Explore → "How Canvasm works — operating loops") and publishes the exact same definitions as a public JSON artifact.

**Your job:** rebuild/refit the canvasm.app Product System section so it renders from this artifact instead of hard-coded copy. One source of truth; when the app's flows change, the site follows without a copy-sync PR.

## 2. The data contract

- **Live URL (fetch at build time or runtime):** `https://use.canvasm.app/product-system-flows.json`
- **Shape:** `{ "version": 1, "flows": ProductSystemFlow[] }`
- **Stability guarantees:**
  - `version` bumps on breaking shape changes — pin your renderer to `version === 1` and fail the build loudly on mismatch rather than rendering garbage.
  - Flow `id`s and step `id`s are stable API — safe to use for anchors/deep links (`/system#strategy-to-impact`).
  - The artifact is parity-tested against the app's TypeScript registry on every commit, so it cannot drift from what the product shows in-app.
- **Copy license:** titles/summaries/descriptions are product-approved copy. Render them verbatim; do not rewrite in the site layer (that recreates the drift this kills). If copy needs changing, change it in `metric-mapping` `src/features/product-system/flows.ts` and regenerate.

### TypeScript types (copy into your repo)

```ts
export type ProductSystemStepKind =
  | 'objective' | 'pillar' | 'problem' | 'hypothesis' | 'action'
  | 'metric' | 'insight' | 'evidence' | 'group' | 'visibility'
  | 'view' | 'dashboard' | 'source' | 'tracking' | 'quality'
  | 'agent' | 'mcp' | 'workflow' | 'decision';

export interface ProductSystemStep {
  id: string;
  order: number;            // 1-based; render as 01, 02, 03…
  label: string;            // short card label, e.g. "Pillar / Problem"
  kind: ProductSystemStepKind;
  title: string;            // one-line headline for the step
  description: string;      // 1–2 sentence detail copy
  icon?: string;            // optional lucide icon name override
  mappedNodeIds?: string[]; // reserved (app-side v2) — ignore on the site
  mappedMetricIds?: string[]; // reserved — ignore
  docHref?: string;         // when present, link the step to docs.canvasm.app
}

export interface ProductSystemRelationship {
  from: string;             // step id
  to: string;               // step id
  label?: string;           // arrow label, e.g. "targets", "decomposes into"
  relationshipType?: string; // app relationship type (Causal, Probabilistic…)
}

export interface ProductSystemFlow {
  id: string;
  title: string;            // long title, e.g. "From strategy to impact"
  shortTitle: string;       // tab/pill label, e.g. "Strategy → Impact"
  summary: string;          // flow-level paragraph
  steps: ProductSystemStep[];
  relationships?: ProductSystemRelationship[];
}
```

### The six flows (ids + step counts)

| id | shortTitle | steps |
|---|---|---|
| `strategy-to-impact` | Strategy → Impact | 4 |
| `teams-to-dashboards` | Teams → Dashboards | 4 |
| `experimentation-to-knowledge` | Experiments → Knowledge | 5 |
| `instrumentation-to-trust` | Instrumentation → Trust | 5 |
| `agent-to-operating-map` | Agent/MCP → Map | 5 |
| `workflow-orchestration` | Orchestration | 5 |

Full content: fetch the artifact URL above (it is the appendix — no need to inline it here; it's public and unauthenticated).

## 3. Rendering requirements

Match the established 01/02/03/04 visual language already on the site, fed by the artifact:

1. **Flow switcher** — tabs/pills using `shortTitle`; support deep links per flow (`#<flow-id>` or `/system/<flow-id>`).
2. **Step rail** — ordered cards showing: zero-padded number from `order` (`01`…), `label`, `title`. Arrows between consecutive steps; when a matching `relationships[]` entry exists (`from` = previous step, `to` = current), show its `label` on/near the arrow — these verbs ("targets", "decomposes into", "certifies") carry real meaning, don't drop them.
3. **Step detail** — clicking/focusing a step reveals its `description` (progressive disclosure or always-visible on desktop — your call). If `docHref` is present, render a "Learn more" link (these will start appearing once docs.canvasm.app ships its concepts pages).
4. **Icons** — map `kind` → icon (the app uses lucide: objective=Target, pillar=Layers, hypothesis=Lightbulb, action=Zap, metric=BarChart3, evidence=FileText, group=Users, visibility=Eye, view/dashboard=LayoutGrid, source=Database, tracking=Radar, quality=Gauge, agent=Bot, mcp=Plug, workflow=CalendarClock, decision=CheckCircle2, insight=Lightbulb, problem=GitBranch). Reuse or restyle, but keep kind→icon consistent across flows.
5. **Accessibility** — switcher is keyboard reachable; step cards focusable; visible focus states; arrows are decorative (`aria-hidden`) with the sequence conveyed by the numbered order.
6. **Responsive** — steps wrap or go vertical on mobile; no horizontal page scroll; no clipped text (some descriptions are two full sentences).
7. **Voice** — the section frames these as **operating loops** of an orchestrator for measurable strategy, not a feature list. Good framing line (used in-app): *"It maps what the team believes, connects work to metrics, records what was learned, and controls who sees what."*

Marketing styling freedom is yours (bigger type, motion, section theming) — the contract is only the data and the 01/02/03 + arrows + detail structure.

## 4. Reference implementation

If useful, the app's renderer is `src/features/product-system/ProductSystemFlowExplorer.tsx` in `metric-mapping` (React + Tailwind, ~250 lines): pill tablist, wrap-friendly step rail with arrow connectors, arrow-key navigation, active-step detail card. It's intentionally "product inspector" styled — yours should be the editorial/marketing interpretation of the same structure.

## 5. Acceptance criteria

- [ ] Product System section renders **all six flows from the artifact** — zero hard-coded flow copy remains in the site repo.
- [ ] `version !== 1` fails the build (or falls back to a clearly-logged static snapshot) instead of rendering a broken page.
- [ ] Numbered steps, arrows with relationship labels, and step descriptions all render; flow switching works.
- [ ] Deep link per flow works (shareable URL/anchor per loop).
- [ ] Keyboard + mobile pass (no overflow, focus visible).
- [ ] `docHref` links render when present (currently absent — code the conditional now).
- [ ] Linear updated: new site issue linked to CVS-286 + CVS-301 with implementation notes.

## 6. Out of scope for you

- Editing flow copy or ids (app-side, `flows.ts`).
- The reserved `mappedNodeIds`/`mappedMetricIds` fields (in-app v2 for attaching real canvas nodes/metrics).
- docs.canvasm.app content (separate lane, CVS-292/295 — you only consume `docHref` when it appears).
