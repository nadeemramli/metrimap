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

Tools wired (representative; the finalized surface + polished descriptions are
**CVS-101**): `list_canvases`, `get_tree`, `list_nodes`, `list_relationships`,
`create_canvas`, `update_canvas`, `delete_canvas`, `create_metric`,
`create_value`, `create_action`, `update_node`, `delete_node`,
`create_relationship`, `delete_relationship`, `push_values`.

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
        try { return { content: [{ type: 'text', text: JSON.stringify(await dispatchTool(t.name, args, ctx)) }] }; }
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
