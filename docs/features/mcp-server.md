# Metrimap MCP server (scaffold)

The remote MCP server that exposes Metrimap's build/ingest tools to a user's own
agent (Claude, Codex). Design authority: product vault
`PRD/4. Product/3. MCP and Programmatic Building` (CVS-97). This doc covers the
scaffold shipped in **CVS-100** and the transport/deploy that remains.

## Layers

```
agent  ──MCP──▶  transport adapter (Streamable HTTP)   [deploy — this doc]
                    │  resolve auth per request  ───────  AuthContextResolver (CVS-99)
                    ▼
                 tool registry + dispatch  ─────────────  src/shared/lib/api/mcp  (CVS-100 ✓)
                    ▼
                 createMetrimapApi(client, userId)  ─────  src/shared/lib/api  (CVS-98 ✓, RLS-scoped)
                    ▼
                 Supabase (RLS)
```

## Shipped in CVS-100 — `src/shared/lib/api/mcp`

Transport-agnostic and unit-tested (no server/DB needed):

- **`registry.ts`** — the tool registry: each tool has a name, agent-facing
  description, Zod `inputSchema`, a `read`/`write` scope, and a handler that calls
  the CVS-98 API. `dispatchTool(name, args, ctx)` validates input, enforces scope,
  runs the handler, and raises **structured `McpToolError`s** (`invalid_input` /
  `unauthenticated` / `forbidden` / `not_found` / `internal`). `listTools()` feeds
  `tools/list`.
- **`authContext.ts`** — the **auth seam**: `McpAuthContext { userId, client, scopes }`
  and the `AuthContextResolver` type that **CVS-99** implements (OAuth token
  exchange / API-key lookup → a Clerk-authenticated, RLS-scoped client). Until
  then `unimplementedAuthResolver` refuses calls. The service-role key is never
  used.
- **`errors.ts`** — the structured error codes.

Tools wired (finalized in **CVS-101**): `list_canvases`, `get_tree`, `list_nodes`,
`list_relationships`, `create_canvas`, `update_canvas`, `delete_canvas`,
`create_metric`, `create_value`, `create_action`, `create_driver_node`,
`update_node`, `delete_node`, `create_relationship`, `delete_relationship`,
`push_values`, `layout_tree` (Dagre auto-layout so pushed trees render sensibly).

## Security & abuse controls (CVS-104)

Injected into `dispatchTool(name, args, ctx, guards)` so they stay transport-
agnostic and unit-tested; the deployed server always supplies them:

- **RLS everywhere** — every tool runs through `createMetrimapApi(client, userId)`;
  the client is the caller's Clerk-scoped client, so no cross-tenant access and
  the service-role key is never used.
- **Scopes** — tools declare `read`/`write`; `dispatchTool` rejects a `write` tool
  when the connection lacks the `write` scope (`forbidden`). Per-key scopes come
  from CVS-89.
- **Rate limiting** — `RateLimiter` (token bucket) keyed by user → `rate_limited`.
  In-memory per instance; a multi-instance deploy should back it with
  Postgres/Redis.
- **Payload caps** — `enforcePayloadSize` (default 2 MB, above the 1 MB CSV Zod
  cap) → `payload_too_large`; per-tool Zod schemas cap the rest.
- **Audit log** — `supabaseAuditSink` writes every call (who/what/when/outcome/
  duration) to `public.mcp_audit_log` (RLS-scoped, append-only), best-effort so
  logging never fails a call.
- **Safe failure** — a rejected call (bad scope/input/rate/size) runs no handler,
  so a tree is never partially corrupted; downstream errors surface as structured
  `McpToolError`s.

Wire them in the adapter:

```ts
import { RateLimiter, supabaseAuditSink, DEFAULT_MAX_PAYLOAD_BYTES } from '@/shared/lib/api/mcp';
const rateLimiter = new RateLimiter(120, 2); // 120 burst, 2/s sustained per user
// per request, after resolving ctx:
const guards = { rateLimiter, maxPayloadBytes: DEFAULT_MAX_PAYLOAD_BYTES, audit: supabaseAuditSink(ctx.client) };
await dispatchTool(t.name, args, ctx, guards);
```

Remaining before public exposure: a **load/security review** (AC) once deployed.

## Transport + deploy — the remaining work (owner decision)

**Blocked on:** (1) a **hosting decision** and (2) the **auth resolver (CVS-99)**.

Hosting options (design doc §2 — confirm in build):
- **Vercel function/edge** under `api/` on `mcp.canvasm.app` — lightest; co-deployed.
- **Small dedicated Node service** — more control, separate lifecycle.

Reference transport adapter (uses the official MCP SDK; **not yet added as a
dependency** because hosting isn't chosen — add `@modelcontextprotocol/sdk` in the
chosen host):

```ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { listTools, dispatchTool, McpToolError } from '@/shared/lib/api/mcp';

const resolveAuth = /* CVS-99 AuthContextResolver */;

export async function handler(req, res) {
  const server = new McpServer({ name: 'metrimap', version: '0.1.0' });
  for (const t of listTools()) {
    server.registerTool(t.name, { title: t.title, description: t.description, inputSchema: t.inputSchema },
      async (args) => {
        const ctx = await resolveAuth(req);                 // per-request, RLS-scoped
        const guards = { rateLimiter, maxPayloadBytes: DEFAULT_MAX_PAYLOAD_BYTES, audit: supabaseAuditSink(ctx.client) };
        try { return { content: [{ type: 'text', text: JSON.stringify(await dispatchTool(t.name, args, ctx, guards)) }] }; }
        catch (e) { const code = e instanceof McpToolError ? e.code : 'internal';
          return { isError: true, content: [{ type: 'text', text: `${code}: ${(e as Error).message}` }] }; }
      });
  }
  const transport = new StreamableHTTPServerTransport({ /* session opts */ });
  await server.connect(transport);
  await transport.handleRequest(req, res);
}
```

Plus a `GET /health` returning `{ ok: true, version }`.

### Once deployed
Reachable at `https://mcp.canvasm.app/mcp`, addable via
`claude mcp add --transport http metrimap https://mcp.canvasm.app/mcp` and the
claude.ai connector. Add request logging + a `mcp_audit_log` (CVS-104).

## Status vs acceptance criteria
- [x] Tool registry wired to the API layer; structured errors — **done + tested**.
- [x] Per-request auth **context** modelled (resolver seam) — resolver impl = CVS-99.
- [ ] Server reachable at a stable URL — needs the hosting decision + adapter deploy.
- [ ] Deploy + logs — same.
