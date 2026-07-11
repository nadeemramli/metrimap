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
import { createClerkClient } from '@clerk/backend';
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
// Older MCP clients skip PRM and probe RFC 8414 authorization-server metadata
// directly on this host — redirect them to Clerk (the real AS). The Clerk
// frontend-API domain is base64 inside the publishable key ("<domain>$").
const AS_META_PATH = '/.well-known/oauth-authorization-server';
const clerkFapiDomain = Buffer.from(
  CLERK_PUBLISHABLE_KEY.split('_')[2] ?? '',
  'base64'
)
  .toString()
  .replace(/\$$/, '');
// Browser-based MCP clients preflight POST /mcp; the Clerk corsHeaders only
// cover the metadata GETs.
const mcpCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'POST, GET, OPTIONS',
  'access-control-allow-headers':
    'authorization, content-type, mcp-session-id, mcp-protocol-version',
  'access-control-max-age': '86400',
};
// Browsers also need these headers on the actual POST /mcp response (405/401/
// transport/500 paths), not just the preflight — otherwise the response is
// blocked after a successful preflight. setHeader survives later writeHead
// merges, and the SDK transport sets no Access-Control headers of its own.
const applyMcpCors = (res: ServerResponse) => {
  for (const [k, v] of Object.entries(mcpCorsHeaders)) res.setHeader(k, v);
};

// One anon client for key lookups; the resolver mints a per-user JWT + client.
const anon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Re-check, at API-key resolve time, that the key owner is still a member of the
// key's workspace org (the api_keys row captured workspace_id once at creation).
// A definitive non-membership degrades the minted JWT to personal scope; a Clerk
// API error FAILS OPEN (returns true) so an outage can't lock out every key.
// Results are cached ~60s so this isn't a Clerk round-trip per request.
const clerkBackend = createClerkClient({
  secretKey: CLERK_SECRET_KEY,
  publishableKey: CLERK_PUBLISHABLE_KEY,
});
const MEMBERSHIP_TTL_MS = 60_000;
const membershipCache = new Map<string, { value: boolean; expires: number }>();
async function verifyOrgMembership(userId: string, orgId: string): Promise<boolean> {
  const cacheKey = `${userId}:${orgId}`;
  const hit = membershipCache.get(cacheKey);
  if (hit && hit.expires > Date.now()) return hit.value;
  let value = true; // fail open on error / pass-through
  try {
    const memberships = await clerkBackend.users.getOrganizationMembershipList({
      userId,
    });
    // Definitive answer from Clerk: member iff the org id appears in the list.
    value = memberships.data.some((m) => m.organization.id === orgId);
  } catch (e) {
    console.warn('verifyOrgMembership: Clerk lookup failed, passing through', e);
    value = true;
  }
  membershipCache.set(cacheKey, { value, expires: Date.now() + MEMBERSHIP_TTL_MS });
  return value;
}
// Two auth paths behind one endpoint: `mk_live_…` personal API keys (CLI) and
// Clerk OAuth access tokens (claude.ai / Desktop connectors). Both resolve to
// the same RLS-scoped McpAuthContext.
const resolveApiKey = createApiKeyAuthResolver({
  jwtSecret: SUPABASE_JWT_SECRET,
  supabaseUrl: SUPABASE_URL,
  anonKey: SUPABASE_ANON_KEY,
  lookupKey: supabaseApiKeyLookup(anon),
  verifyOrgMembership,
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

// Cap buffered request bodies before JSON.parse — 4MB leaves headroom above the
// 2MB per-tool payload guard (DEFAULT_MAX_PAYLOAD_BYTES) that runs post-parse.
// Without this an authenticated client could OOM the process with one giant POST.
const MAX_BODY_BYTES = 4 * 1024 * 1024;

function readJson(req: IncomingMessage, res: ServerResponse): Promise<unknown> {
  return new Promise((resolve, reject) => {
    let data = '';
    let bytes = 0;
    let tooLarge = false;
    req.on('data', (c: Buffer | string) => {
      if (tooLarge) return;
      bytes += Buffer.byteLength(c);
      if (bytes > MAX_BODY_BYTES) {
        tooLarge = true;
        if (!res.headersSent) {
          res.writeHead(413, { 'content-type': 'application/json' });
          res.end(JSON.stringify({ error: 'Payload too large' }));
        }
        req.destroy();
        reject(new Error(`Request body exceeds ${MAX_BODY_BYTES} bytes`));
        return;
      }
      data += c;
    });
    req.on('end', () => {
      if (tooLarge) return;
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
    // .shape is undefined on ZodEffects (.refine()'d schemas, e.g.
    // CreateEvidenceInput) — unwrap to the inner object or the tool would
    // advertise NO input fields and every connector call would fail.
    const schemaLike = t.inputSchema as {
      shape?: ZodRawShape;
      _def?: { schema?: { shape?: ZodRawShape } };
    };
    const shape = schemaLike.shape ?? schemaLike._def?.schema?.shape;
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

    // RFC 8414 fallback for clients that don't speak RFC 9728 — Clerk is the AS.
    if (req.url && req.url.startsWith(AS_META_PATH) && clerkFapiDomain) {
      res.writeHead(req.method === 'OPTIONS' ? 204 : 307, {
        ...corsHeaders,
        location: `https://${clerkFapiDomain}${AS_META_PATH}`,
      });
      res.end();
      return;
    }

    // Everything past the metadata routes is the MCP endpoint proper — apply
    // the MCP CORS headers to all its responses (preflight, 405, 401, transport
    // success, and the 500 catch below).
    applyMcpCors(res);

    // CORS preflight for browser-based MCP clients hitting POST /mcp.
    if (req.method === 'OPTIONS') {
      res.writeHead(204, mcpCorsHeaders);
      res.end();
      return;
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

    const body = await readJson(req, res);
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
