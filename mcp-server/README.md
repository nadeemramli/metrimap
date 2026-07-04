# Metrimap MCP server (Node)

A tiny Node service that serves Metrimap's MCP tools over **Streamable HTTP**. It
just wires together the already-shipped, unit-tested pieces:

- tool registry + dispatch — `src/shared/lib/api/mcp` (CVS-100/101/102)
- API-key auth → per-user RLS-scoped client — `…/mcp/auth` (CVS-99)
- rate limit + payload caps + audit log — `…/mcp/guards` + `…/mcp/audit` (CVS-104)

`server.ts` only does HTTP + per-request auth. **Node was chosen over Vercel
functions** because MCP wants a long-lived Streamable-HTTP connection, which a
persistent Node process handles cleanly (and stays cheap on scale-to-zero hosts).

## What you need (the only manual bits)

1. **`SUPABASE_JWT_SECRET`** — Supabase dashboard → Project Settings → API →
   **JWT Secret**. This signs the short-lived per-user tokens. Server-only; never
   put it in the browser bundle or git.
2. `SUPABASE_URL` + `SUPABASE_ANON_KEY` (already public).
3. Before it works end to end, **merge + `db push` PR #69** (the
   `mcp_resolve_api_key` RPC) and #62 (audit log). Then generate an API key in
   the app (Settings → Connect your agent).

Copy `.env.example` → `.env` and fill those in.

## Run locally

```bash
# from the repo root — install app deps once (the server imports src/):
npm install
# then the server's own deps + start it:
cd mcp-server
npm install
cp .env.example .env    # edit it
npm start               # → http://localhost:8787  (GET /health, POST /mcp)
curl localhost:8787/health   # {"ok":true,...}
```

Point an agent at it:

```bash
claude mcp add --transport http metrimap http://localhost:8787/mcp \
  --header "Authorization: Bearer <your mk_live_ key>"
```

## Deploy to Fly.io (cheap, scales to zero)

```bash
# one-time
curl -L https://fly.io/install.sh | sh      # install flyctl
fly auth login
fly launch --no-deploy                       # creates the app (uses fly.toml)

# secrets (server-only)
fly secrets set \
  SUPABASE_URL=https://iqrclwolhookzzmiedun.supabase.co \
  SUPABASE_ANON_KEY=<anon key> \
  SUPABASE_JWT_SECRET=<jwt secret>

fly deploy                                   # builds mcp-server/Dockerfile
fly status                                   # note the *.fly.dev URL
```

Then set `VITE_MCP_URL=https://<app>.fly.dev/mcp` for the app's Connect page, or
map `mcp.canvasm.app` to the Fly app.

## Deploy anywhere else (Docker)

`Dockerfile` builds from the **repo root** (it needs `src/`):

```bash
docker build -f mcp-server/Dockerfile -t metrimap-mcp .
docker run -p 8787:8787 --env-file mcp-server/.env metrimap-mcp
```

Works the same on Render / Railway / a VPS — set the 3 env vars, expose 8787,
health-check `/health`.

## Notes

- **First run:** the `@modelcontextprotocol/sdk` transport / `registerTool` API
  shifts a bit between versions. If `npm start` throws on an SDK call, pin the
  version in `package.json` and re-run — the two SDK touch-points are the
  `McpServer`/`registerTool` loop and the `StreamableHTTPServerTransport` in
  `server.ts`. Everything imported from `@/shared/lib/api/mcp` is version-stable
  and tested.
- **Scaling:** the rate limiter is in-memory (per instance). Fine for one
  machine; for multiple, back it with Postgres/Redis.
- **OAuth "Connect"** (sign-in instead of a key) is a follow-up — this server does
  the API-key path (CVS-99).
