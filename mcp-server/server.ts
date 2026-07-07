// Metrimap MCP server — runnable Node transport (CVS-100 deploy).
//
// Thin adapter: it wires the shipped, tested pieces together and serves them over
// Streamable HTTP. All the logic lives in src/shared/lib/api/mcp (registry +
// dispatch + API-key auth + guards); this file only does HTTP + per-request auth.
//
// Run:   cd mcp-server && npm install && npm start   (needs the repo's root deps —
//        see README). Env: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_JWT_SECRET.
//
// NOTE: the @modelcontextprotocol/sdk transport/registerTool API evolves between
// versions — if `npm start` errors on the SDK surface, pin the version in
// package.json (or adjust the two SDK calls below) and re-run. Everything it
// imports from `@/shared/lib/api/mcp` is already unit-tested.
import { createServer, type IncomingMessage, type ServerResponse } from 'node:http';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { createClient } from '@supabase/supabase-js';
import {
  generateClerkProtectedResourceMetadata,
  corsHeaders,
} from '@clerk/mcp-tools/server';
import type { ZodRawShape } from 'zod';
import {
  listTools,
  dispatchTool,
  McpToolError,
  createApiKeyAuthResolver,
  createOAuthAuthResolver,
  createCompositeAuthResolver,
  supabaseApiKeyLookup,
  supabaseAuditSink,
  RateLimiter,
  DEFAULT_MAX_PAYLOAD_BYTES,
  type McpAuthContext,
} from '@/shared/lib/api/mcp';
import { makeClerkVerifier } from './clerkAuth';

const VERSION = '0.1.0';
const {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_JWT_SECRET,
  CLERK_SECRET_KEY,
  CLERK_PUBLISHABLE_KEY,
  MCP_PUBLIC_URL = 'https://mcp.canvasm.app',
  PORT = '8787',
} = process.env;

if (
  !SUPABASE_URL ||
  !SUPABASE_ANON_KEY ||
  !SUPABASE_JWT_SECRET ||
  !CLERK_SECRET_KEY ||
  !CLERK_PUBLISHABLE_KEY
) {
  console.error(
    'Missing env. Required: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_JWT_SECRET, CLERK_SECRET_KEY, CLERK_PUBLISHABLE_KEY.'
  );
  process.exit(1);
}

// The OAuth resource id this server represents (must match what clients request).
const RESOURCE_URL = `${MCP_PUBLIC_URL}/mcp`;
// RFC 9728 Protected Resource Metadata path (also served with a `/mcp` suffix).
const PRM_PATH = '/.well-known/oauth-protected-resource';

// One anon client for key lookups; the resolver mints a per-user JWT + client.
const anon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
// Two auth paths behind one endpoint: `mk_live_…` personal API keys (CLI) and
// Clerk OAuth access tokens (claude.ai / Desktop connectors). Both resolve to
// the same RLS-scoped McpAuthContext.
const resolveApiKey = createApiKeyAuthResolver({
  jwtSecret: SUPABASE_JWT_SECRET,
  supabaseUrl: SUPABASE_URL,
  anonKey: SUPABASE_ANON_KEY,
  lookupKey: supabaseApiKeyLookup(anon),
});
const resolveOAuth = createOAuthAuthResolver({
  jwtSecret: SUPABASE_JWT_SECRET,
  supabaseUrl: SUPABASE_URL,
  anonKey: SUPABASE_ANON_KEY,
  verifyOAuthToken: makeClerkVerifier({
    secretKey: CLERK_SECRET_KEY,
    publishableKey: CLERK_PUBLISHABLE_KEY,
    resourceUrl: RESOURCE_URL,
    authorizedParties: ['https://claude.ai', 'https://claude.com'],
  }),
});
const resolveAuth = createCompositeAuthResolver({
  apiKey: resolveApiKey,
  oauth: resolveOAuth,
});

// 120 calls burst, 2/s sustained, per user (in-memory — see README for scaling).
const rateLimiter = new RateLimiter(120, 2);

function headersOf(req: IncomingMessage): Record<string, string | undefined> {
  const out: Record<string, string | undefined> = {};
  for (const [k, v] of Object.entries(req.headers)) {
    out[k.toLowerCase()] = Array.isArray(v) ? v.join(',') : v;
  }
  return out;
}

function readJson(req: IncomingMessage): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (c) => (data += c));
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : undefined);
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

// Build a fresh MCP server for one already-authenticated HTTP request. Auth is
// resolved up front (see the request handler), so each tool runs under that
// user's RLS + guards.
function buildMcpServer(authed: McpAuthContext): McpServer {
  const server = new McpServer({ name: 'metrimap', version: VERSION });

  for (const t of listTools()) {
    // Extract the ZodRawShape by duck-typing, NOT `instanceof z.ZodObject`. The app
    // is on zod 3 while this server's deps pull zod 4, so a v4 instanceof check is
    // always false for our v3 schemas — that silently dropped every input schema and
    // published empty `{properties:{}}` to connectors, so create_*/get_* got no
    // fields to send → invalid_input on every call. The SDK's shape handling is
    // v3/v4-compat (objectFromShape rebuilds the fields), so the raw shape is enough.
    const shape = (t.inputSchema as { shape?: ZodRawShape }).shape;
    server.registerTool(
      t.name,
      {
        title: t.title,
        description: t.description,
        // ToolAnnotations: lets clients auto-approve reads and treat creates as
        // additive instead of prompting on every call (unannotated = destructive).
        annotations: { title: t.title, ...t.annotations },
        ...(shape ? { inputSchema: shape } : {}),
      },
      async (args: unknown) => {
        try {
          const result = await dispatchTool(t.name, args, authed, {
            rateLimiter,
            maxPayloadBytes: DEFAULT_MAX_PAYLOAD_BYTES,
            audit: supabaseAuditSink(authed.client),
          });
          // JSON.stringify(undefined) is undefined (not a string) — void handlers
          // (e.g. delete_*) would otherwise emit malformed content the client rejects.
          const text = JSON.stringify(result) ?? JSON.stringify({ ok: true });
          return { content: [{ type: 'text' as const, text }] };
        } catch (e) {
          const code = e instanceof McpToolError ? e.code : 'internal';
          const message = e instanceof Error ? e.message : String(e);
          return {
            isError: true,
            content: [{ type: 'text' as const, text: `${code}: ${message}` }],
          };
        }
      }
    );
  }
  return server;
}

const http = createServer(async (req: IncomingMessage, res: ServerResponse) => {
  try {
    if (req.method === 'GET' && (req.url === '/health' || req.url === '/')) {
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ ok: true, name: 'metrimap-mcp', version: VERSION }));
      return;
    }

    // OAuth 2.1 Protected Resource Metadata (RFC 9728). Points MCP clients at
    // Clerk as the authorization server; also serve the `/mcp`-suffixed variant.
    if (req.url && req.url.startsWith(PRM_PATH)) {
      if (req.method === 'OPTIONS') {
        res.writeHead(204, corsHeaders);
        res.end();
        return;
      }
      if (req.method === 'GET') {
        const meta = generateClerkProtectedResourceMetadata({
          publishableKey: CLERK_PUBLISHABLE_KEY,
          resourceUrl: RESOURCE_URL,
          properties: { scopes_supported: ['profile', 'email'] },
        });
        res.writeHead(200, { 'content-type': 'application/json', ...corsHeaders });
        res.end(JSON.stringify(meta));
        return;
      }
    }

    if (req.method !== 'POST') {
      res.writeHead(405, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ error: 'Method not allowed' }));
      return;
    }

    // Resolve auth up front: a missing/invalid credential must be a real HTTP
    // 401 + WWW-Authenticate so MCP connectors begin the OAuth handshake (Clerk
    // sign-in). API-key/CLI clients always send the header, so they're
    // unaffected. Non-auth errors fall through to the 500 handler.
    let authed: McpAuthContext;
    try {
      authed = await resolveAuth({ headers: headersOf(req) });
    } catch (e) {
      if (e instanceof McpToolError && e.code === 'unauthenticated') {
        res.writeHead(401, {
          'content-type': 'application/json',
          'WWW-Authenticate': `Bearer resource_metadata="${MCP_PUBLIC_URL}${PRM_PATH}", error="invalid_token"`,
          ...corsHeaders,
        });
        res.end(JSON.stringify({ error: 'unauthorized', message: e.message }));
        return;
      }
      throw e;
    }

    const body = await readJson(req);
    const server = buildMcpServer(authed);
    // Stateless: one transport per request (sessionIdGenerator: undefined).
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
    res.on('close', () => {
      transport.close();
      server.close();
    });
    await server.connect(transport);
    await transport.handleRequest(req, res, body);
  } catch (e) {
    console.error('MCP request error:', e);
    if (!res.headersSent) {
      res.writeHead(500, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal error' }));
    }
  }
});

http.listen(Number(PORT), () => {
  console.log(`metrimap-mcp v${VERSION} listening on :${PORT} (POST /mcp, GET /health)`);
});
