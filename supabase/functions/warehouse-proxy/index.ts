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
      await runQuery(connection, password, 'SELECT 1 AS ok');
      return json({ ok: true });
    }

    if (action === 'save') {
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

      const rows = await runQuery(conn, secret.password, sql);
      return json({ rows });
    }

    return json({ error: `Unknown action: ${action}` }, 400);
  } catch (err) {
    return json({ error: err instanceof Error ? err.message : String(err) }, 500);
  }
});
