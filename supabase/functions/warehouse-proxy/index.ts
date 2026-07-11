// Warehouse query proxy — Data Source Phase 3.
//
// Why this exists: warehouse credentials must NEVER live in the browser bundle
// (see the product vault, Principle 3). This edge function
// is the only thing that holds/uses a connection's password. The browser calls
// it with the user's Clerk-issued Supabase JWT; the function verifies ownership
// via RLS, reads the secret with the service-role key, runs the query against the
// customer's Postgres warehouse, and returns plain rows.
//
// Actions:
//   test  { connection, password }            -> { ok }            connect + SELECT 1
//   save  { connection, password }            -> { id }            upsert connection + secret
//   query { connectionId, sql }               -> { rows }          run SQL, return rows
//
// Deploy:  npx supabase functions deploy warehouse-proxy
// Secrets: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are injected by the platform.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import postgres from 'https://deno.land/x/postgresjs@v3.4.4/mod.js';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}

interface ConnectionConfig {
  id?: string;
  name?: string;
  host: string;
  port: number;
  database: string;
  username: string;
  ssl?: boolean;
}

// Postgres ports we allow outbound connections to. Everything else is refused so
// this function can't be used to port-scan internal services.
const ALLOWED_PORTS = new Set([5432, 6543]);

// Blocks SSRF into the internal network: reject loopback/private/link-local
// targets by literal IP and by DNS resolution (defeats rebinding-to-private).
class UnsafeTargetError extends Error {}

function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split('.').map((n) => Number(n));
  if (parts.length !== 4 || parts.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) {
    return true; // not a clean dotted-quad — treat as unsafe
  }
  const [a, b] = parts;
  if (a === 0 || a === 127) return true; // 0.0.0.0/8, loopback
  if (a === 10) return true; // 10.0.0.0/8
  if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
  if (a === 192 && b === 168) return true; // 192.168.0.0/16
  if (a === 169 && b === 254) return true; // 169.254.0.0/16 (link-local, cloud metadata)
  if (a === 100 && b >= 64 && b <= 127) return true; // 100.64.0.0/10 (CGNAT)
  return false;
}

function isUnsafeIPv6(ip: string): boolean {
  const v = ip.toLowerCase().replace(/^\[|\]$/g, '');
  if (v === '::1' || v === '::' || v === '0:0:0:0:0:0:0:1') return true; // loopback / unspecified
  if (v.startsWith('fc') || v.startsWith('fd')) return true; // fc00::/7 unique-local
  if (v.startsWith('fe80')) return true; // link-local
  // IPv4-mapped (::ffff:a.b.c.d) — re-check the embedded v4.
  const mapped = v.match(/(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped && isPrivateIPv4(mapped[1])) return true;
  return false;
}

function ipLooksUnsafe(ip: string): boolean {
  return ip.includes(':') ? isUnsafeIPv6(ip) : isPrivateIPv4(ip);
}

async function assertSafeTarget(host: unknown, port: unknown): Promise<void> {
  const h = typeof host === 'string' ? host.trim() : '';
  const p = Number(port);
  if (!h) throw new UnsafeTargetError('Missing connection host.');
  if (!ALLOWED_PORTS.has(p)) {
    throw new UnsafeTargetError(`Port ${port} is not allowed (expected one of ${[...ALLOWED_PORTS].join(', ')}).`);
  }
  // Literal IP given directly.
  if (/^[0-9.]+$/.test(h) || h.includes(':')) {
    if (ipLooksUnsafe(h)) throw new UnsafeTargetError('Connection host is not permitted.');
    return;
  }
  // Hostname: resolve and re-check every resolved address.
  let addrs: string[] = [];
  try {
    const [v4, v6] = await Promise.allSettled([
      Deno.resolveDns(h, 'A'),
      Deno.resolveDns(h, 'AAAA'),
    ]);
    if (v4.status === 'fulfilled') addrs = addrs.concat(v4.value);
    if (v6.status === 'fulfilled') addrs = addrs.concat(v6.value);
  } catch {
    throw new UnsafeTargetError('Could not resolve connection host.');
  }
  if (addrs.length === 0) throw new UnsafeTargetError('Could not resolve connection host.');
  if (addrs.some(ipLooksUnsafe)) throw new UnsafeTargetError('Connection host resolves to a disallowed address.');
}

async function runQuery(
  config: ConnectionConfig,
  password: string,
  query: string
): Promise<Record<string, unknown>[]> {
  const sql = postgres({
    host: config.host,
    port: config.port,
    database: config.database,
    username: config.username,
    password,
    ssl: config.ssl === false ? false : 'require',
    max: 1,
    idle_timeout: 5,
    connect_timeout: 10,
  });
  try {
    // Tagged-template `.unsafe` runs the caller's raw SQL (their own warehouse).
    const rows = await sql.unsafe(query);
    return rows as unknown as Record<string, unknown>[];
  } finally {
    await sql.end({ timeout: 5 });
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) return json({ error: 'Missing Authorization header.' }, 401);

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // User-scoped client: RLS applies, so it can only see the caller's own rows.
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    // Admin client: service-role, bypasses RLS — the ONLY reader of secrets.
    const admin = createClient(supabaseUrl, serviceKey);

    const { action, connection, password, connectionId, sql } = await req.json();

    if (action === 'test') {
      try {
        await assertSafeTarget(connection?.host, connection?.port);
      } catch (e) {
        if (e instanceof UnsafeTargetError) return json({ error: e.message }, 400);
        throw e;
      }
      await runQuery(connection, password, 'SELECT 1 AS ok');
      return json({ ok: true });
    }

    if (action === 'save') {
      try {
        await assertSafeTarget(connection?.host, connection?.port);
      } catch (e) {
        if (e instanceof UnsafeTargetError) return json({ error: e.message }, 400);
        throw e;
      }
      // created_by defaults to requesting_user_id() under the user's JWT.
      const { data, error } = await userClient
        .from('source_connections')
        .insert({
          name: connection.name,
          warehouse_type: 'postgres',
          host: connection.host,
          port: connection.port,
          database: connection.database,
          username: connection.username,
          ssl: connection.ssl ?? true,
        })
        .select('id')
        .single();
      if (error) return json({ error: error.message }, 400);

      const { error: secretError } = await admin
        .from('source_connection_secrets')
        .upsert({ connection_id: data.id, password });
      if (secretError) return json({ error: secretError.message }, 400);

      return json({ id: data.id });
    }

    if (action === 'query') {
      // Ownership enforced by RLS: this returns a row only if the caller owns it.
      const { data: conn, error } = await userClient
        .from('source_connections')
        .select('id, host, port, database, username, ssl')
        .eq('id', connectionId)
        .single();
      if (error || !conn) return json({ error: 'Connection not found.' }, 404);

      const { data: secret, error: secretError } = await admin
        .from('source_connection_secrets')
        .select('password')
        .eq('connection_id', connectionId)
        .single();
      if (secretError || !secret) {
        return json({ error: 'Credential not found for connection.' }, 404);
      }

      // Defense-in-depth: the row is RLS-owned, but re-validate before connecting.
      try {
        await assertSafeTarget(conn.host, conn.port);
      } catch (e) {
        if (e instanceof UnsafeTargetError) return json({ error: e.message }, 400);
        throw e;
      }
      const rows = await runQuery(conn, secret.password, sql);
      return json({ rows });
    }

    return json({ error: `Unknown action: ${action}` }, 400);
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : String(err) }, 500);
  }
});
