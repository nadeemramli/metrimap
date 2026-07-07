// Product System Flows — the operating loops Canvasm/Metrimap is built around.
//
// PORTABLE MODULE: no app imports, no React, no Supabase. This registry is the
// single source of truth for the in-app explorer AND (via the JSON artifact at
// public/product-system-flows.json, parity-enforced by flows.test.ts) for
// canvasm.app's marketing visualizations. Keep it framework-free.
//
// The app is not just a map — it is an orchestrator for measurable strategy:
// it maps what the team believes, shows what the team is doing, connects that
// work to metrics, records what was learned, controls who sees what, and gives
// agents/API a structured business-context layer. Each flow below is one of
// those loops, expressed as ordered steps that real canvas nodes, metrics, and
// evidence can attach to (mappedNodeIds / mappedMetricIds — reserved for v2).

export type ProductSystemStepKind =
  | 'objective'
  | 'pillar'
  | 'problem'
  | 'hypothesis'
  | 'action'
  | 'metric'
  | 'insight'
  | 'evidence'
  | 'group'
  | 'visibility'
  | 'view'
  | 'dashboard'
  | 'source'
  | 'tracking'
  | 'quality'
  | 'agent'
  | 'mcp'
  | 'workflow'
  | 'decision';

export interface ProductSystemStep {
  id: string;
  order: number;
  label: string;
  kind: ProductSystemStepKind;
  title: string;
  description: string;
  /** Optional icon override (lucide name); the explorer maps `kind` → icon by default. */
  icon?: string;
  /** Real canvas nodes attached to this step (v2 — persisted mappings). */
  mappedNodeIds?: string[];
  /** Real tracked metrics attached to this step (v2). */
  mappedMetricIds?: string[];
  /** Deep link into docs.canvasm.app once the docs IA lands (CVS-292/295). */
  docHref?: string;
}

export interface ProductSystemRelationship {
  from: string;
  to: string;
  label?: string;
  relationshipType?: string;
}

export interface ProductSystemFlow {
  id: string;
  title: string;
  shortTitle: string;
  summary: string;
  steps: ProductSystemStep[];
  relationships?: ProductSystemRelationship[];
}

export const productSystemFlows: ProductSystemFlow[] = [
  {
    id: 'strategy-to-impact',
    title: 'From strategy to impact',
    shortTitle: 'Strategy → Impact',
    summary:
      'Strategy breaks down into things you can measure: an objective decomposes into pillars and problems, each bet becomes a hypothesis or action, and every bet carries an impact contract against a target metric.',
    steps: [
      {
        id: 'objective',
        order: 1,
        label: 'Objective',
        kind: 'objective',
        title: 'Start from the outcome',
        description:
          'A Core/Value node on the canvas is the KPI the team exists to move. Everything below it must eventually roll up here.',
      },
      {
        id: 'pillar',
        order: 2,
        label: 'Pillar / Problem',
        kind: 'pillar',
        title: 'Decompose into pillars and problems',
        description:
          'Groups on the canvas act as pillars: the named areas (and known problems) where the objective will be won or lost.',
      },
      {
        id: 'bet',
        order: 3,
        label: 'Hypothesis / Action',
        kind: 'action',
        title: 'Place explicit bets',
        description:
          'Hypothesis and Action cards state what you believe and what you will do about it — each one owned, statused, and visible on the Strategy board.',
      },
      {
        id: 'impact',
        order: 4,
        label: 'Metric impact',
        kind: 'metric',
        title: 'Contract the expected impact',
        description:
          'An impact contract binds the bet to a target metric with direction, expected delta, baseline, and measurement window — measured deltas surface on Strategy chips and dashboard badges.',
      },
    ],
    relationships: [
      { from: 'objective', to: 'pillar', label: 'decomposes into' },
      { from: 'pillar', to: 'bet', label: 'spawns' },
      { from: 'bet', to: 'impact', label: 'targets', relationshipType: 'Causal' },
    ],
  },
  {
    id: 'teams-to-dashboards',
    title: 'From teams to dashboards',
    shortTitle: 'Teams → Dashboards',
    summary:
      'Workspace groups map to what each audience is allowed to see, and each group gets an operating view: an auto-derived group dashboard plus its own widget grid for review.',
    steps: [
      {
        id: 'groups',
        order: 1,
        label: 'Groups',
        kind: 'group',
        title: 'Model the org as groups',
        description:
          'Workspace groups (departments, squads) and canvas groups (pillars) define who the audiences are and which slice of the map belongs to them.',
      },
      {
        id: 'visibility',
        order: 2,
        label: 'Visibility & access',
        kind: 'visibility',
        title: 'Decide who sees what',
        description:
          'Access tags × groups × RLS gate every node and value — restricted metrics are masked with a badge, and dashboards only surface what the viewer may see.',
      },
      {
        id: 'views',
        order: 3,
        label: 'Operating views',
        kind: 'view',
        title: 'Give each audience its view',
        description:
          'Each canvas group derives a live dashboard (KPIs, health, series) automatically; the Layers panel and focus mode carve the same map into per-team working views.',
      },
      {
        id: 'review',
        order: 4,
        label: 'Dashboard / review',
        kind: 'dashboard',
        title: 'Run the review from the dashboard',
        description:
          'Group dashboards carry their own widget grids; impact badges link each widget back to the strategy bets that target its metrics.',
      },
    ],
    relationships: [
      { from: 'groups', to: 'visibility', label: 'sets policy for' },
      { from: 'visibility', to: 'views', label: 'filters' },
      { from: 'views', to: 'review', label: 'feeds' },
    ],
  },
  {
    id: 'experimentation-to-knowledge',
    title: 'From experimentation to knowledge',
    shortTitle: 'Experiments → Knowledge',
    summary:
      'Every experiment closes its loop: a hypothesis drives an action, the action shows up as a metric signal, the signal is reviewed into an insight with evidence, and the evidence decides the next bet.',
    steps: [
      {
        id: 'hypothesis',
        order: 1,
        label: 'Hypothesis',
        kind: 'hypothesis',
        title: 'State what you believe',
        description:
          'A Hypothesis card with assumptions and success criteria — connected on the canvas to the metrics it claims to move.',
      },
      {
        id: 'experiment',
        order: 2,
        label: 'Action / Experiment',
        kind: 'action',
        title: 'Run the experiment',
        description:
          'The Action card carries owner, status, and workflow; its impact contract fixes the measurement window before the work ships.',
      },
      {
        id: 'signal',
        order: 3,
        label: 'Metric signal',
        kind: 'metric',
        title: 'Read the signal',
        description:
          'Measured deltas against baseline appear on the bet’s chip: met, missed, or guardrail-breached — no data reads as unknown, never as zero.',
      },
      {
        id: 'insight',
        order: 4,
        label: 'Insight / Evidence',
        kind: 'evidence',
        title: 'Capture what you learned',
        description:
          'Impact Review records won / lost / inconclusive and writes an evidence note — a notebook artifact attached to the card, with the numbers embedded.',
      },
      {
        id: 'next-decision',
        order: 5,
        label: 'Next decision',
        kind: 'decision',
        title: 'Let evidence pick the next bet',
        description:
          'Evidence stays attached to the map, so the next planning pass starts from what was actually learned, not from memory.',
      },
    ],
    relationships: [
      { from: 'hypothesis', to: 'experiment', label: 'tested by' },
      { from: 'experiment', to: 'signal', label: 'moves', relationshipType: 'Probabilistic' },
      { from: 'signal', to: 'insight', label: 'reviewed into' },
      { from: 'insight', to: 'next-decision', label: 'informs' },
    ],
  },
  {
    id: 'instrumentation-to-trust',
    title: 'From instrumentation to trust',
    shortTitle: 'Instrumentation → Trust',
    summary:
      'A dashboard is only as good as its pipes: sources and events flow through tracking checks into catalogued metric definitions, quality status stays visible, and only then does a dashboard deserve trust.',
    steps: [
      {
        id: 'source',
        order: 1,
        label: 'Source / Event',
        kind: 'source',
        title: 'Wire the source',
        description:
          'Source nodes bind warehouse queries, files, connectors, or manual series onto the canvas — the raw feed for every downstream metric.',
      },
      {
        id: 'tracking',
        order: 2,
        label: 'Tracking check',
        kind: 'tracking',
        title: 'Verify the tracking',
        description:
          'Stale or orphaned bindings are flagged on the node itself — a disconnected source shows a badge instead of silently zeroing data.',
      },
      {
        id: 'definition',
        order: 3,
        label: 'Metric definition',
        kind: 'metric',
        title: 'Catalog the definition',
        description:
          'Promoting a card to a Tracked Metric makes its name, formula, and values the shared definition every canvas placement follows.',
      },
      {
        id: 'quality',
        order: 4,
        label: 'Quality / freshness',
        kind: 'quality',
        title: 'Keep quality visible',
        description:
          'Freshness, alert rules, and connector run health surface as status on cards and in the Data hub — degraded data announces itself.',
      },
      {
        id: 'trusted-dashboard',
        order: 5,
        label: 'Trusted dashboard',
        kind: 'dashboard',
        title: 'Trust the dashboard',
        description:
          'Because widgets resolve from catalogued definitions and live bindings, the number in the review is the number in the pipe.',
      },
    ],
    relationships: [
      { from: 'source', to: 'tracking', label: 'validated by' },
      { from: 'tracking', to: 'definition', label: 'feeds' },
      { from: 'definition', to: 'quality', label: 'monitored by' },
      { from: 'quality', to: 'trusted-dashboard', label: 'certifies' },
    ],
  },
  {
    id: 'agent-to-operating-map',
    title: 'From agent to operating map',
    shortTitle: 'Agent/MCP → Map',
    summary:
      'Agents are first-class operators: through MCP and the API they read and update the same map the team uses, changes are verified against the live canvas, and results persist as evidence and dashboards.',
    steps: [
      {
        id: 'agent-request',
        order: 1,
        label: 'Agent request',
        kind: 'agent',
        title: 'An agent asks for context',
        description:
          'Claude or any MCP client connects with a scoped key — the business map becomes structured context instead of copy-pasted docs.',
      },
      {
        id: 'mcp-access',
        order: 2,
        label: 'MCP / API',
        kind: 'mcp',
        title: 'Access through the same rules',
        description:
          'Every tool call is RLS-scoped, rate-limited, and audited — an agent can never see or change more than the user it acts for.',
      },
      {
        id: 'map-update',
        order: 3,
        label: 'Read / update map',
        kind: 'workflow',
        title: 'Read and build the tree',
        description:
          'Tools create metrics, relationships, and values, push series, and auto-layout — the canvas is a programmable surface.',
      },
      {
        id: 'verify',
        order: 4,
        label: 'Verify change',
        kind: 'quality',
        title: 'Verify against the live map',
        description:
          'Changes land on the shared canvas where the team (and its checks) see them immediately — same source of truth, no shadow copy.',
      },
      {
        id: 'persist',
        order: 5,
        label: 'Evidence / dashboard',
        kind: 'evidence',
        title: 'Persist the result',
        description:
          'Agent work ends as durable artifacts: evidence notes on cards and metrics on dashboards, attributed and reviewable.',
      },
    ],
    relationships: [
      { from: 'agent-request', to: 'mcp-access', label: 'authenticates via' },
      { from: 'mcp-access', to: 'map-update', label: 'authorizes' },
      { from: 'map-update', to: 'verify', label: 'lands on canvas' },
      { from: 'verify', to: 'persist', label: 'recorded as' },
    ],
  },
  {
    id: 'workflow-orchestration',
    title: 'Workflow orchestration',
    shortTitle: 'Orchestration',
    summary:
      'The operating cadence lives on the map: triggers and review rhythms route work to owners, metric reviews force decisions, and every decision produces the next owned work item.',
    steps: [
      {
        id: 'trigger',
        order: 1,
        label: 'Trigger / cadence',
        kind: 'workflow',
        title: 'Something starts the loop',
        description:
          'An alert rule firing, a measurement window closing, or a standing review cadence — the map tells you when attention is due.',
      },
      {
        id: 'owner',
        order: 2,
        label: 'Owner / action',
        kind: 'action',
        title: 'Work routes to an owner',
        description:
          'Cards carry owners, assignees, and workflow status; the Strategy board is the queue of who is doing what about which metric.',
      },
      {
        id: 'metric-review',
        order: 3,
        label: 'Metric review',
        kind: 'metric',
        title: 'Review against the numbers',
        description:
          'The review happens on the group dashboard and impact chips — expected vs measured, guardrails included — not in a slide deck.',
      },
      {
        id: 'decision',
        order: 4,
        label: 'Decision',
        kind: 'decision',
        title: 'Decide and record it',
        description:
          'Won, lost, inconclusive, keep measuring — the decision is captured where the work lives, with its evidence note.',
      },
      {
        id: 'next-item',
        order: 5,
        label: 'Next work item',
        kind: 'action',
        title: 'The loop produces the next item',
        description:
          'Each decision spawns the next hypothesis or action on the map, so the operating loop closes instead of trailing off.',
      },
    ],
    relationships: [
      { from: 'trigger', to: 'owner', label: 'routes to' },
      { from: 'owner', to: 'metric-review', label: 'reports into' },
      { from: 'metric-review', to: 'decision', label: 'forces' },
      { from: 'decision', to: 'next-item', label: 'spawns' },
    ],
  },
];

/** Lookup by id, for deep links and tests. */
export function getProductSystemFlow(id: string): ProductSystemFlow | undefined {
  return productSystemFlows.find((f) => f.id === id);
}
