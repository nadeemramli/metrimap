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
import { z } from 'zod';
import {
  listTools,
  dispatchTool,
  McpToolError,
  createApiKeyAuthResolver,
  supabaseApiKeyLookup,
  supabaseAuditSink,
  RateLimiter,
  DEFAULT_MAX_PAYLOAD_BYTES,
} from '@/shared/lib/api/mcp';

const VERSION = '0.1.0';
const {
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  SUPABASE_JWT_SECRET,
  PORT = '8787',
} = process.env;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_JWT_SECRET) {
  console.error(
    'Missing env. Required: SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_JWT_SECRET.'
  );
  process.exit(1);
}

// One anon client for key lookups; the resolver mints a per-user JWT + client.
const anon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const resolveAuth = createApiKeyAuthResolver({
  jwtSecret: SUPABASE_JWT_SECRET,
  supabaseUrl: SUPABASE_URL,
  anonKey: SUPABASE_ANON_KEY,
  lookupKey: supabaseApiKeyLookup(anon),
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

// Build a fresh MCP server bound to one HTTP request's headers. Auth is resolved
// lazily + once per request; each tool runs under that user's RLS + guards.
function buildMcpServer(reqHeaders: Record<string, string | undefined>): McpServer {
  const server = new McpServer({ name: 'metrimap', version: VERSION });
  let ctx: ReturnType<typeof resolveAuth> | undefined;
  const getCtx = () => {
    if (!ctx) ctx = resolveAuth({ headers: reqHeaders });
    return ctx;
  };

  for (const t of listTools()) {
    const shape =
      t.inputSchema instanceof z.ZodObject ? t.inputSchema.shape : undefined;
    server.registerTool(
      t.name,
      {
        title: t.title,
        description: t.description,
        ...(shape ? { inputSchema: shape } : {}),
      },
      async (args: unknown) => {
        try {
          const authed = await getCtx();
          const result = await dispatchTool(t.name, args, authed, {
            rateLimiter,
            maxPayloadBytes: DEFAULT_MAX_PAYLOAD_BYTES,
            audit: supabaseAuditSink(authed.client),
          });
          return { content: [{ type: 'text' as const, text: JSON.stringify(result) }] };
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
    if (req.method !== 'POST') {
      res.writeHead(405, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ error: 'Method not allowed' }));
      return;
    }

    const body = await readJson(req);
    const server = buildMcpServer(headersOf(req));
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
