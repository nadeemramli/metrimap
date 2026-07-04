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
  CreateRelationshipInput,
  CreateTypedNodeInput,
  PushValuesInput,
} from '../schemas';
import type { McpAuthContext, McpScope } from './authContext';
import { McpToolError } from './errors';

export interface McpTool {
  name: string;
  title: string;
  description: string;
  scope: McpScope;
  inputSchema: z.ZodTypeAny;
  handler: (args: unknown, ctx: McpAuthContext) => Promise<unknown>;
}

function defineTool<S extends z.ZodTypeAny>(t: {
  name: string;
  title: string;
  description: string;
  scope: McpScope;
  inputSchema: S;
  handler: (args: z.infer<S>, ctx: McpAuthContext) => Promise<unknown>;
}): McpTool {
  return t as unknown as McpTool;
}

const api = (ctx: McpAuthContext) => createMetrimapApi(ctx.client, ctx.userId);

const idInput = z.object({ id: z.string().uuid() });
const projectIdInput = z.object({ projectId: z.string().uuid() });
const updateInput = z.object({ id: z.string().uuid() }).passthrough();

export const TOOLS: McpTool[] = [
  // --- Read ---
  defineTool({
    name: 'list_canvases',
    title: 'List canvases',
    description:
      "List the authenticated user's metric-tree canvases (projects). Returns ids to use in other tools.",
    scope: 'read',
    inputSchema: z.object({}).strict(),
    handler: (_a, ctx) => api(ctx).canvases.list(),
  }),
  defineTool({
    name: 'get_tree',
    title: 'Get tree',
    description:
      'Read a canvas\'s full structure — all metric cards + typed relationships. Call this before adding nodes so you EXTEND the existing tree instead of duplicating it.',
    scope: 'read',
    inputSchema: projectIdInput,
    handler: (a, ctx) => api(ctx).tree.get(a.projectId),
  }),
  defineTool({
    name: 'list_nodes',
    title: 'List nodes',
    description: 'List all metric cards (nodes) on a canvas.',
    scope: 'read',
    inputSchema: projectIdInput,
    handler: (a, ctx) => api(ctx).nodes.list(a.projectId),
  }),
  defineTool({
    name: 'list_relationships',
    title: 'List relationships',
    description: 'List all typed relationships on a canvas.',
    scope: 'read',
    inputSchema: projectIdInput,
    handler: (a, ctx) => api(ctx).relationships.list(a.projectId),
  }),
  // --- Write: canvases ---
  defineTool({
    name: 'create_canvas',
    title: 'Create canvas',
    description: 'Create a new metric-tree canvas (project). Returns the canvas id.',
    scope: 'write',
    inputSchema: CreateCanvasInput,
    handler: (a, ctx) => api(ctx).canvases.create(a),
  }),
  defineTool({
    name: 'update_canvas',
    title: 'Update canvas',
    description: 'Update a canvas (name, description, isPublic).',
    scope: 'write',
    inputSchema: updateInput,
    handler: ({ id, ...patch }, ctx) => api(ctx).canvases.update(id, patch),
  }),
  defineTool({
    name: 'delete_canvas',
    title: 'Delete canvas',
    description: 'Delete a canvas and its contents.',
    scope: 'write',
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
    inputSchema: CreateTypedNodeInput,
    handler: (a, ctx) => api(ctx).nodes.createMetric(a),
  }),
  defineTool({
    name: 'create_value',
    title: 'Create value node',
    description:
      'Create a Core/Value card (an outcome / value node — e.g. Profit). Returns the node id.',
    scope: 'write',
    inputSchema: CreateTypedNodeInput,
    handler: (a, ctx) => api(ctx).nodes.createValue(a),
  }),
  defineTool({
    name: 'create_action',
    title: 'Create action node',
    description:
      'Create a Work/Action card (an initiative / task that moves a metric). Returns the node id.',
    scope: 'write',
    inputSchema: CreateTypedNodeInput,
    handler: (a, ctx) => api(ctx).nodes.createAction(a),
  }),
  defineTool({
    name: 'update_node',
    title: 'Update node',
    description: 'Update a metric card (title, description, category, formula, position).',
    scope: 'write',
    inputSchema: updateInput,
    handler: ({ id, ...patch }, ctx) => api(ctx).nodes.update(id, patch),
  }),
  defineTool({
    name: 'delete_node',
    title: 'Delete node',
    description: 'Delete a metric card.',
    scope: 'write',
    inputSchema: idInput,
    handler: (a, ctx) => api(ctx).nodes.delete(a.id),
  }),
  // --- Write: relationships ---
  defineTool({
    name: 'create_relationship',
    title: 'Create relationship',
    description:
      'Connect two nodes with a typed relationship (Deterministic / Probabilistic / Causal / Compositional). Provide projectId, sourceId, targetId, type.',
    scope: 'write',
    inputSchema: CreateRelationshipInput,
    handler: (a, ctx) => api(ctx).relationships.create(a),
  }),
  defineTool({
    name: 'delete_relationship',
    title: 'Delete relationship',
    description: 'Delete a relationship.',
    scope: 'write',
    inputSchema: idInput,
    handler: (a, ctx) => api(ctx).relationships.delete(a.id),
  }),
  // --- Write: values ---
  defineTool({
    name: 'push_values',
    title: 'Push values',
    description:
      'Upsert a tracked metric\'s value series (one row per period). Staging + column mapping for raw CSV is a separate tool (CVS-102).',
    scope: 'write',
    inputSchema: PushValuesInput,
    handler: (a, ctx) => api(ctx).values.push(a),
  }),
];

const BY_NAME = new Map(TOOLS.map((t) => [t.name, t]));

/** Metadata for MCP `tools/list` (the adapter converts inputSchema → JSON schema). */
export function listTools() {
  return TOOLS.map(({ name, title, description, scope, inputSchema }) => ({
    name,
    title,
    description,
    scope,
    inputSchema,
  }));
}

/**
 * Validate + run one tool call under the caller's auth context. Throws
 * McpToolError (structured) for unknown tool / bad scope / invalid input /
 * downstream failure — the transport maps these to MCP error responses.
 */
export async function dispatchTool(
  name: string,
  rawArgs: unknown,
  ctx: McpAuthContext
): Promise<unknown> {
  const tool = BY_NAME.get(name);
  if (!tool) throw new McpToolError('not_found', `Unknown tool: ${name}`);

  if (tool.scope === 'write' && ctx.scopes && !ctx.scopes.includes('write')) {
    throw new McpToolError('forbidden', `Tool "${name}" requires the write scope`);
  }

  let args: unknown;
  try {
    args = tool.inputSchema.parse(rawArgs ?? {});
  } catch (e) {
    throw new McpToolError(
      'invalid_input',
      `Invalid input for "${name}"`,
      e instanceof z.ZodError ? e.issues : String(e)
    );
  }

  try {
    return await tool.handler(args, ctx);
  } catch (e) {
    if (e instanceof McpToolError) throw e;
    throw new McpToolError('internal', e instanceof Error ? e.message : String(e));
  }
}
