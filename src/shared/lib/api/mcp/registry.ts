// MCP tool registry + dispatch (CVS-100). Transport-agnostic: maps MCP tool
// names to the RLS-scoped programmatic API (CVS-98). The transport adapter
// (Streamable HTTP, deployed separately — see docs/features/mcp-server.md) turns
// this registry into `tools/list` + `tools/call`. The FULL/finalized tool surface
// + polished descriptions are CVS-101; this is a representative wiring proving the
// registry → API → RLS path with structured errors.
import { z } from 'zod';
import { createMetrimapApi } from '../metrimapApi';
import {
  CreateCanvasInput,
  CreateCommentInput,
  CreateEvidenceInput,
  CreateRelationshipInput,
  CreateTagInput,
  CreateTypedNodeInput,
  CreateGroupInput,
  GetMetricValuesInput,
  GroupMembershipInput,
  LayoutTreeInput,
  ListEvidenceInput,
  MaterializeInput,
  PromoteCardInput,
  PushValuesInput,
  StageSeriesInput,
  TagCardInput,
  UpdateCanvasFields,
  UpdateEvidenceFields,
  UpdateGroupFields,
  UpdateNodeFields,
  UpdateRelationshipFields,
  UploadCsvInput,
} from '../schemas';
import type { McpAuthContext, McpScope } from './authContext';
import { McpToolError } from './errors';
import type { AuditSink } from './audit';
import { enforcePayloadSize, enforceRateLimit, type RateLimiter } from './guards';

/** MCP spec ToolAnnotations (2025-03-26). Hints only — clients decide approval
 *  UX from these; without them every tool is treated as destructive and prompts
 *  on each call. */
export interface McpToolAnnotations {
  readOnlyHint?: boolean;
  destructiveHint?: boolean;
  idempotentHint?: boolean;
  openWorldHint?: boolean;
}

export interface McpTool {
  name: string;
  title: string;
  description: string;
  scope: McpScope;
  annotations: McpToolAnnotations;
  inputSchema: z.ZodTypeAny;
  handler: (args: unknown, ctx: McpAuthContext) => Promise<unknown>;
}

// All tools operate on Metrimap's own DB (closed world). Reads never write;
// ADDITIVE creates never overwrite; UPSERT re-applies to the same state
// (layout/values/materialize); DESTRUCTIVE overwrites or deletes user data.
const READ_ONLY: McpToolAnnotations = { readOnlyHint: true, openWorldHint: false };
const ADDITIVE: McpToolAnnotations = {
  readOnlyHint: false,
  destructiveHint: false,
  idempotentHint: false,
  openWorldHint: false,
};
const UPSERT: McpToolAnnotations = {
  readOnlyHint: false,
  destructiveHint: false,
  idempotentHint: true,
  openWorldHint: false,
};
const DESTRUCTIVE: McpToolAnnotations = {
  readOnlyHint: false,
  destructiveHint: true,
  idempotentHint: true,
  openWorldHint: false,
};

function defineTool<S extends z.ZodTypeAny>(t: {
  name: string;
  title: string;
  description: string;
  scope: McpScope;
  annotations: McpToolAnnotations;
  inputSchema: S;
  handler: (args: z.infer<S>, ctx: McpAuthContext) => Promise<unknown>;
}): McpTool {
  return t as unknown as McpTool;
}

const api = (ctx: McpAuthContext) => createMetrimapApi(ctx.client, ctx.userId);

const idInput = z.object({ id: z.string().uuid() });
const projectIdInput = z.object({ projectId: z.string().uuid() });

export const TOOLS: McpTool[] = [
  // --- Read ---
  defineTool({
    name: 'list_canvases',
    title: 'List canvases',
    description:
      "List the authenticated user's metric-tree canvases (projects). Returns ids to use in other tools.",
    scope: 'read',
    annotations: READ_ONLY,
    // No `.strict()`: the MCP SDK / claude.ai connector attaches metadata keys to
    // the arguments of a no-param call; strict validation rejects them. Default
    // (strip-unknown) tolerates that and still accepts a genuinely empty payload.
    inputSchema: z.object({}),
    handler: (_a, ctx) => api(ctx).canvases.list(),
  }),
  defineTool({
    name: 'get_tree',
    title: 'Get tree',
    description:
      'Read a canvas\'s full structure — all metric cards + typed relationships. Call this before adding nodes so you EXTEND the existing tree instead of duplicating it.',
    scope: 'read',
    annotations: READ_ONLY,
    inputSchema: projectIdInput,
    handler: (a, ctx) => api(ctx).tree.get(a.projectId),
  }),
  defineTool({
    name: 'list_nodes',
    title: 'List nodes',
    description: 'List all metric cards (nodes) on a canvas.',
    scope: 'read',
    annotations: READ_ONLY,
    inputSchema: projectIdInput,
    handler: (a, ctx) => api(ctx).nodes.list(a.projectId),
  }),
  defineTool({
    name: 'list_relationships',
    title: 'List relationships',
    description: 'List all typed relationships on a canvas.',
    scope: 'read',
    annotations: READ_ONLY,
    inputSchema: projectIdInput,
    handler: (a, ctx) => api(ctx).relationships.list(a.projectId),
  }),
  // --- Write: canvases ---
  defineTool({
    name: 'create_canvas',
    title: 'Create canvas',
    description: 'Create a new metric-tree canvas (project). Returns the canvas id.',
    scope: 'write',
    annotations: ADDITIVE,
    inputSchema: CreateCanvasInput,
    handler: (a, ctx) => api(ctx).canvases.create(a),
  }),
  defineTool({
    name: 'update_canvas',
    title: 'Update canvas',
    description: 'Update a canvas (name, description, isPublic).',
    scope: 'write',
    annotations: DESTRUCTIVE,
    inputSchema: z.object({ id: z.string().uuid() }).merge(UpdateCanvasFields),
    handler: ({ id, ...patch }, ctx) => api(ctx).canvases.update(id, patch),
  }),
  defineTool({
    name: 'delete_canvas',
    title: 'Delete canvas',
    description: 'Delete a canvas and its contents.',
    scope: 'write',
    annotations: DESTRUCTIVE,
    inputSchema: idInput,
    handler: (a, ctx) => api(ctx).canvases.delete(a.id),
  }),
  // --- Write: nodes (category via named tool) ---
  defineTool({
    name: 'create_metric',
    title: 'Create metric node',
    description:
      'Create a Data/Metric card (a measured driver). Provide projectId + title. Returns the node id for chaining into create_relationship.',
    scope: 'write',
    annotations: ADDITIVE,
    inputSchema: CreateTypedNodeInput,
    handler: (a, ctx) => api(ctx).nodes.createMetric(a),
  }),
  defineTool({
    name: 'create_value',
    title: 'Create value node',
    description:
      'Create a Core/Value card (an outcome / value node — e.g. Profit). Returns the node id.',
    scope: 'write',
    annotations: ADDITIVE,
    inputSchema: CreateTypedNodeInput,
    handler: (a, ctx) => api(ctx).nodes.createValue(a),
  }),
  defineTool({
    name: 'create_action',
    title: 'Create action node',
    description:
      'Create a Work/Action card (an initiative / task that moves a metric). Returns the node id.',
    scope: 'write',
    annotations: ADDITIVE,
    inputSchema: CreateTypedNodeInput,
    handler: (a, ctx) => api(ctx).nodes.createAction(a),
  }),
  defineTool({
    name: 'create_hypothesis',
    title: 'Create hypothesis node',
    description:
      'Create an Ideas/Hypothesis card (a belief to validate with evidence). Returns the node id.',
    scope: 'write',
    annotations: ADDITIVE,
    inputSchema: CreateTypedNodeInput,
    handler: (a, ctx) => api(ctx).nodes.createHypothesis(a),
  }),
  defineTool({
    name: 'create_driver_node',
    title: 'Create driver node',
    description:
      'Create an input-driver metric (Data/Metric, subCategory "Input Metric") that drives an output metric or value node. Returns the node id; connect it with create_relationship.',
    scope: 'write',
    annotations: ADDITIVE,
    inputSchema: CreateTypedNodeInput,
    handler: (a, ctx) => api(ctx).nodes.createDriver(a),
  }),
  defineTool({
    name: 'update_node',
    title: 'Update node',
    description: 'Update a metric card (title, description, category, formula, position).',
    scope: 'write',
    annotations: DESTRUCTIVE,
    inputSchema: z.object({ id: z.string().uuid() }).merge(UpdateNodeFields),
    handler: ({ id, ...patch }, ctx) => api(ctx).nodes.update(id, patch),
  }),
  defineTool({
    name: 'delete_node',
    title: 'Delete node',
    description: 'Delete a metric card.',
    scope: 'write',
    annotations: DESTRUCTIVE,
    inputSchema: idInput,
    handler: async (a, ctx) => {
      const res = await api(ctx).nodes.delete(a.id);
      if (res && res.deleted === 0)
        throw new McpToolError('not_found', `No metric card with id ${a.id}`);
      return { ok: true, id: a.id };
    },
  }),
  // --- Write: relationships ---
  defineTool({
    name: 'create_relationship',
    title: 'Create relationship',
    description:
      'Connect two nodes with a typed relationship (Deterministic / Probabilistic / Causal / Compositional). Provide projectId, sourceId, targetId, type.',
    scope: 'write',
    annotations: ADDITIVE,
    inputSchema: CreateRelationshipInput,
    handler: (a, ctx) => api(ctx).relationships.create(a),
  }),
  defineTool({
    name: 'update_relationship',
    title: 'Update relationship',
    description:
      'Update a relationship (type, confidence High/Medium/Low, weight 0–1, notes).',
    scope: 'write',
    annotations: DESTRUCTIVE,
    inputSchema: z.object({ id: z.string().uuid() }).merge(UpdateRelationshipFields),
    handler: ({ id, ...patch }, ctx) => api(ctx).relationships.update(id, patch),
  }),
  defineTool({
    name: 'delete_relationship',
    title: 'Delete relationship',
    description: 'Delete a relationship.',
    scope: 'write',
    annotations: DESTRUCTIVE,
    inputSchema: idInput,
    handler: async (a, ctx) => {
      const res = await api(ctx).relationships.delete(a.id);
      if (res && res.deleted === 0)
        throw new McpToolError('not_found', `No relationship with id ${a.id}`);
      return { ok: true, id: a.id };
    },
  }),
  // --- Evidence ---
  defineTool({
    name: 'create_evidence',
    title: 'Create evidence',
    description:
      'Create an evidence item: attach it to a card (cardId), a relationship (relationshipId), or neither for general project-level evidence. Provide projectId, title, type (Experiment / Analysis / Notebook / External Research / User Interview) and summary. Optional: date, owner, hypothesis, link, content (EditorJS JSON). Returns the evidence id.',
    scope: 'write',
    annotations: ADDITIVE,
    inputSchema: CreateEvidenceInput,
    handler: (a, ctx) => api(ctx).evidence.create(a),
  }),
  defineTool({
    name: 'list_evidence',
    title: 'List evidence',
    description:
      "List a project's evidence items (newest first); pass cardId to filter to one card.",
    scope: 'read',
    annotations: READ_ONLY,
    inputSchema: ListEvidenceInput,
    handler: (a, ctx) => api(ctx).evidence.list(a),
  }),
  defineTool({
    name: 'update_evidence',
    title: 'Update evidence',
    description:
      'Update an evidence item (title, type, summary, date, owner, hypothesis, link, content).',
    scope: 'write',
    annotations: DESTRUCTIVE,
    inputSchema: z.object({ id: z.string().uuid() }).merge(UpdateEvidenceFields),
    handler: ({ id, ...patch }, ctx) => api(ctx).evidence.update(id, patch),
  }),
  // --- Tags ---
  defineTool({
    name: 'list_tags',
    title: 'List tags',
    description: "List a project's tags (name, color, description).",
    scope: 'read',
    annotations: READ_ONLY,
    inputSchema: projectIdInput,
    handler: (a, ctx) => api(ctx).tags.list(a.projectId),
  }),
  defineTool({
    name: 'create_tag',
    title: 'Create tag',
    description:
      'Create a project tag (name + optional color/description). Tags must exist before tag_card can apply them.',
    scope: 'write',
    annotations: ADDITIVE,
    inputSchema: CreateTagInput,
    handler: (a, ctx) => api(ctx).tags.create(a),
  }),
  defineTool({
    name: 'tag_card',
    title: 'Tag a card',
    description:
      'Apply existing project tags (by name) to a metric card. Create missing tags first with create_tag.',
    scope: 'write',
    annotations: ADDITIVE,
    inputSchema: TagCardInput,
    handler: (a, ctx) => api(ctx).tags.tagCard(a),
  }),
  defineTool({
    name: 'untag_card',
    title: 'Untag a card',
    description: 'Remove tags (by name) from a metric card.',
    scope: 'write',
    annotations: DESTRUCTIVE,
    inputSchema: TagCardInput,
    handler: (a, ctx) => api(ctx).tags.untagCard(a),
  }),
  // --- Tracked-metric catalog + values ---
  defineTool({
    name: 'list_tracked_metrics',
    title: 'List tracked metrics',
    description:
      "List the workspace's catalogued (tracked) metrics — ids here are the trackedMetricId that push_values and get_metric_values need.",
    scope: 'read',
    annotations: READ_ONLY,
    inputSchema: z.object({}),
    handler: (_a, ctx) => api(ctx).catalog.listTracked(),
  }),
  defineTool({
    name: 'list_candidate_cards',
    title: 'List candidate cards',
    description:
      'List operationalized cards (they have data) not yet in the tracked-metric catalog — candidates for promote_card.',
    scope: 'read',
    annotations: READ_ONLY,
    inputSchema: z.object({}),
    handler: (_a, ctx) => api(ctx).catalog.listCandidates(),
  }),
  defineTool({
    name: 'promote_card',
    title: 'Promote card to catalog',
    description:
      'Promote a card into the tracked-metric catalog (seeds the shared series from the card data). Returns the trackedMetricId for push_values / get_metric_values.',
    scope: 'write',
    annotations: ADDITIVE,
    inputSchema: PromoteCardInput,
    handler: (a, ctx) => api(ctx).catalog.promote(a),
  }),
  defineTool({
    name: 'get_metric_values',
    title: 'Get metric values',
    description:
      "Read a tracked metric's shared value series (period/value rows) — use this to analyze or chart Metrimap data. Card-bound series also come back inside list_nodes/get_tree card data.",
    scope: 'read',
    annotations: READ_ONLY,
    inputSchema: GetMetricValuesInput,
    handler: (a, ctx) => api(ctx).catalog.values(a),
  }),
  // --- Comments ---
  defineTool({
    name: 'list_comments',
    title: 'List comments',
    description:
      "List a project's comment threads (each with its comments), newest activity first.",
    scope: 'read',
    annotations: READ_ONLY,
    inputSchema: projectIdInput,
    handler: (a, ctx) => api(ctx).comments.list(a.projectId),
  }),
  defineTool({
    name: 'create_comment',
    title: 'Create comment',
    description:
      'Leave a comment: starts a new thread on the canvas (or pinned to a card via cardId), or replies into an existing thread via threadId.',
    scope: 'write',
    annotations: ADDITIVE,
    inputSchema: CreateCommentInput,
    handler: (a, ctx) => api(ctx).comments.create(a),
  }),
  // --- Dashboards + groups (read) ---
  defineTool({
    name: 'list_dashboards',
    title: 'List dashboards',
    description:
      "A canvas's dashboard structure: widgets (chart/stat tiles with their card bindings + layout) and the canvas groups they belong to (each group = one dashboard; group_id null = Custom). Combine with get_metric_values / card data to re-render the charts.",
    scope: 'read',
    annotations: READ_ONLY,
    inputSchema: projectIdInput,
    handler: (a, ctx) => api(ctx).dashboards.list(a.projectId),
  }),
  defineTool({
    name: 'list_groups',
    title: 'List groups',
    description:
      "List a canvas's groups (name, node_ids, position/size) — the grouping that also drives group dashboards.",
    scope: 'read',
    annotations: READ_ONLY,
    inputSchema: projectIdInput,
    handler: (a, ctx) => api(ctx).groups.list(a.projectId),
  }),
  // --- Write: groups (each group also backs a group dashboard — the
  // Dashboard page derives one per group at render time, so creating a group
  // needs no separate dashboard-provisioning step) ---
  defineTool({
    name: 'create_group',
    title: 'Create group',
    description:
      'Group cards on a canvas (name + nodeIds). Position/size are computed from the members (same padding the canvas uses) when omitted, so call it any time after layout_tree. The group automatically drives a group dashboard.',
    scope: 'write',
    annotations: ADDITIVE,
    inputSchema: CreateGroupInput,
    handler: (a, ctx) => api(ctx).groups.create(a),
  }),
  defineTool({
    name: 'update_group',
    title: 'Update group',
    description:
      'Rename/recolor a group, replace its membership, or refit:true to re-derive its box from member positions after a re-layout.',
    scope: 'write',
    annotations: DESTRUCTIVE,
    inputSchema: z.object({ id: z.string().uuid() }).merge(UpdateGroupFields),
    handler: ({ id, ...patch }, ctx) => api(ctx).groups.update(id, patch),
  }),
  defineTool({
    name: 'add_cards_to_group',
    title: 'Add cards to group',
    description:
      "Add cards to an existing group (incremental membership); the group's box refits to the new members.",
    scope: 'write',
    annotations: ADDITIVE,
    inputSchema: GroupMembershipInput,
    handler: (a, ctx) => api(ctx).groups.addCards(a),
  }),
  defineTool({
    name: 'remove_cards_from_group',
    title: 'Remove cards from group',
    description:
      'Remove cards from a group (cards are kept). Refuses to empty the group — use delete_group for that.',
    scope: 'write',
    annotations: DESTRUCTIVE,
    inputSchema: GroupMembershipInput,
    handler: (a, ctx) => api(ctx).groups.removeCards(a),
  }),
  defineTool({
    name: 'delete_group',
    title: 'Delete group',
    description: 'Delete a group (its cards are kept on the canvas).',
    scope: 'write',
    annotations: DESTRUCTIVE,
    inputSchema: idInput,
    handler: async (a, ctx) => {
      const res = await api(ctx).groups.delete(a.id);
      if (res && res.deleted === 0)
        throw new McpToolError('not_found', `No group with id ${a.id}`);
      return { ok: true, id: a.id };
    },
  }),
  // --- Write: values ---
  defineTool({
    name: 'push_values',
    title: 'Push values',
    description:
      "Upsert a tracked metric's value series (one row per period). Discover the trackedMetricId with list_tracked_metrics, or promote_card a card that has data. For raw CSV use upload_csv → materialize.",
    scope: 'write',
    annotations: UPSERT,
    inputSchema: PushValuesInput,
    handler: (a, ctx) => api(ctx).values.push(a),
  }),
  defineTool({
    name: 'layout_tree',
    title: 'Auto-layout tree',
    description:
      'Apply Dagre auto-layout to a canvas so a programmatically-built tree renders sensibly (no overlapping nodes at 0,0). Call once after adding nodes + relationships. direction defaults to TB (top-to-bottom).',
    scope: 'write',
    annotations: UPSERT,
    inputSchema: LayoutTreeInput,
    handler: (a, ctx) => api(ctx).tree.layout(a.projectId, a.direction),
  }),
  // --- Data ingest (stage → materialize) ---
  defineTool({
    name: 'stage_series',
    title: 'Stage a value series',
    description:
      'Stage a structured value series (period/value rows) into TTL staging. Returns a batchId to pass to materialize.',
    scope: 'write',
    annotations: ADDITIVE,
    inputSchema: StageSeriesInput,
    handler: (a, ctx) => api(ctx).ingest.stageSeries(a),
  }),
  defineTool({
    name: 'upload_csv',
    title: 'Upload CSV',
    description:
      'Stage raw CSV text into TTL staging. Returns a batchId + the parsed column names; then call materialize with a column mapping.',
    scope: 'write',
    annotations: ADDITIVE,
    inputSchema: UploadCsvInput,
    handler: (a, ctx) => api(ctx).ingest.uploadCsv(a),
  }),
  defineTool({
    name: 'materialize',
    title: 'Materialize staged data onto a card',
    description:
      "Map a staged batch onto a metric card and materialize its series — the card's data (which the canvas visualizes) plus, if the card is catalogued, the shared metric_values store. For CSV batches provide mapping.periodColumn + mapping.valueColumn. Returns an ingest report (materialized / skipped / errors).",
    scope: 'write',
    annotations: UPSERT,
    inputSchema: MaterializeInput,
    handler: (a, ctx) => api(ctx).ingest.materialize(a),
  }),
];

const BY_NAME = new Map(TOOLS.map((t) => [t.name, t]));

/** Metadata for MCP `tools/list` (the adapter converts inputSchema → JSON schema). */
export function listTools() {
  return TOOLS.map(({ name, title, description, scope, annotations, inputSchema }) => ({
    name,
    title,
    description,
    scope,
    annotations,
    inputSchema,
  }));
}

/** Abuse controls + audit, injected by the transport (CVS-104). All optional so
 *  dispatch stays pure/testable; the deployed server always supplies them. */
export interface DispatchGuards {
  rateLimiter?: RateLimiter;
  maxPayloadBytes?: number;
  audit?: AuditSink;
}

/**
 * Validate + run one tool call under the caller's auth context, with optional
 * abuse controls + audit. Throws McpToolError (structured) for payload-too-large
 * / rate-limited / unknown tool / bad scope / invalid input / downstream failure
 * — the transport maps these to MCP error responses. Failures are clean (a
 * rejected call writes nothing), so a tree is never partially corrupted.
 */
export async function dispatchTool(
  name: string,
  rawArgs: unknown,
  ctx: McpAuthContext,
  guards: DispatchGuards = {}
): Promise<unknown> {
  const start = Date.now();

  // Transport-level guards (before we touch a tool): cap payload, then rate-limit
  // per acting user.
  if (guards.maxPayloadBytes !== undefined) enforcePayloadSize(rawArgs, guards.maxPayloadBytes);
  if (guards.rateLimiter) enforceRateLimit(guards.rateLimiter, ctx.userId);

  const tool = BY_NAME.get(name);
  if (!tool) throw new McpToolError('not_found', `Unknown tool: ${name}`);

  if (tool.scope === 'write' && ctx.scopes && !ctx.scopes.includes('write')) {
    throw new McpToolError('forbidden', `Tool "${name}" requires the write scope`);
  }

  const audit = (outcome: 'ok' | 'error', errorCode: string | null) => {
    if (!guards.audit) return;
    void guards.audit
      .record({
        userId: ctx.userId,
        tool: name,
        scope: tool.scope,
        outcome,
        errorCode,
        durationMs: Date.now() - start,
      })
      .catch(() => {
        /* audit is best-effort — never fail a call because logging failed */
      });
  };

  let args: unknown;
  try {
    args = tool.inputSchema.parse(rawArgs ?? {});
  } catch (e) {
    audit('error', 'invalid_input');
    throw new McpToolError(
      'invalid_input',
      `Invalid input for "${name}"`,
      e instanceof z.ZodError ? e.issues : String(e)
    );
  }

  try {
    const result = await tool.handler(args, ctx);
    audit('ok', null);
    return result;
  } catch (e) {
    if (e instanceof McpToolError) {
      audit('error', e.code);
      throw e;
    }
    audit('error', 'internal');
    throw new McpToolError('internal', describeError(e));
  }
}

/** Human-readable message for any thrown value — plain objects (e.g. Supabase
 *  PostgrestError) otherwise stringify to the undebuggable "[object Object]". */
function describeError(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === 'object' && e !== null) {
    const msg = (e as { message?: unknown }).message;
    if (typeof msg === 'string' && msg) return msg;
    try {
      return JSON.stringify(e);
    } catch {
      /* circular — fall through */
    }
  }
  return String(e);
}
