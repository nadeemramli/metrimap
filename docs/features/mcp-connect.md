# Connect your agent to Metrimap (MCP)

User-facing setup for pointing an agent (Claude Cowork/Code, Codex, any HTTP MCP
client) at Metrimap's MCP server so it can **build and populate your metric
trees**. This is the source for the `docs.canvasm.app` connect guide; the in-app
version lives at **Settings → Connect your agent** (`/settings/connect`, CVS-103).

Every tool call runs under **your** account (RLS-scoped) — your key is never
shared, and the server never uses a service-role key.

## 1. Get an API key

In Metrimap: **Settings → Connect your agent → Generate key** (or Account
Settings → API keys). Copy it once — it's shown only once. Non-interactive
clients authenticate with `Authorization: Bearer <key>`. OAuth clients
(claude.ai / Claude Desktop connectors) don't need a key — adding the
connector starts a Clerk sign-in and connects under your account.

## 2. Add the server

**Claude Code / Cowork (CLI):**

```bash
claude mcp add --transport http metrimap https://mcp.canvasm.app/mcp \
  --header "Authorization: Bearer <YOUR_API_KEY>"
```

**claude.ai / Claude Desktop:** Settings → Connectors → Add custom connector →
paste `https://mcp.canvasm.app/mcp` — no header needed; it signs you in via
OAuth (Clerk).

**Codex / other MCP clients:** point them at the same URL with the same
`Authorization` header.

## 3. Example — build a driver tree from your data

A typical agent session (the agent pulls data with **Composio**/other MCPs, then
pushes structure + values into Metrimap):

1. `create_canvas` → "SaaS growth model" (returns a canvas id).
2. `create_value` → "Profit" (the outcome).
3. `create_driver_node` → "MRR", "Churn", "CAC" (input drivers).
4. `create_relationship` → MRR → Profit (`Causal`), Churn → Profit (`Causal`), …
5. `layout_tree` → tidy Dagre layout so it renders sensibly.
6. Pull GA4 / Stripe series via Composio, then `upload_csv` (or `stage_series`)
   → `materialize` onto the matching card. The canvas now visualises the data.

Tip: call `get_tree` first so the agent **extends** an existing tree instead of
duplicating nodes.

## Tool reference (v1)

| Tool | Scope | What it does |
|---|---|---|
| `list_canvases` | read | Your canvases (projects) + ids |
| `get_tree` | read | A canvas's full structure (cards + relationships) |
| `list_nodes` / `list_relationships` | read | Nodes / relationships on a canvas |
| `create_canvas` / `update_canvas` / `delete_canvas` | write | Canvas CRUD |
| `create_metric` | write | A `Data/Metric` card |
| `create_value` | write | A `Core/Value` (outcome) card |
| `create_driver_node` | write | An input-driver metric (`Input Metric`) |
| `create_action` | write | A `Work/Action` card |
| `create_hypothesis` | write | An `Ideas/Hypothesis` card |
| `update_node` / `delete_node` | write | Node update / delete |
| `create_relationship` / `update_relationship` / `delete_relationship` | write | Typed link: Deterministic / Probabilistic / Causal / Compositional |
| `create_evidence` / `list_evidence` / `update_evidence` | write / read | Evidence on a card, a relationship, or the project (general) |
| `list_tags` / `create_tag` / `tag_card` / `untag_card` | read / write | Project tags + card tagging |
| `list_tracked_metrics` / `list_candidate_cards` | read | Tracked-metric catalog + promotable cards |
| `promote_card` | write | Promote a card into the catalog (returns `trackedMetricId`) |
| `get_metric_values` | read | A tracked metric's shared value series (chart the data) |
| `list_comments` / `create_comment` | read / write | Comment threads (canvas or card-pinned) + replies |
| `list_dashboards` / `list_groups` | read | Dashboard widgets + canvas groups (re-render charts client-side) |
| `layout_tree` | write | Auto-layout (Dagre) so a built tree renders well |
| `push_values` | write | Upsert a tracked-metric value series |
| `stage_series` / `upload_csv` | write | Stage data (TTL) for mapping |
| `materialize` | write | Map a staged batch onto a card → the canvas shows it |

All tools carry MCP **ToolAnnotations** (reads are `readOnlyHint`, creates are
additive, deletes/overwrites destructive), so well-behaved clients only
prompt for genuinely destructive calls.

## Limits & safety

- **Rate-limited** per key; **payload caps** (CSV ≤ ~1 MB); calls are **audited**.
- **Scopes**: keys are read+write by default (finer per-key scopes are coming).
- **Revoke** a key anytime in Account Settings → API keys; it stops working
  immediately.
