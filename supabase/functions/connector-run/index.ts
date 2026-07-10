// Connector run host entrypoint (CVS-320). Executes one connected account's stream
// through the full pipeline (secrets → fetch → normalize → bind → metric_values)
// using the shared library at src/shared/lib/connectors/host (mapped via deno.json).
//
//   POST /connector-run  { account_id, stream, sync_mode?, preview?, max_records? }
//     -> RunHostSummary (payload-free unless preview, which returns the in-memory sample)
//
// Auth (verify_jwt stays ON — the gateway checks the JWT signature):
//   * user JWT     — caller must be able to SEE the connected account under RLS
//                    ("Sync now" from the app). The run itself uses the service role.
//   * service JWT  — role=service_role (scheduler/pg_cron, CVS-323) is trusted as-is.
//
// Required function secrets: CONNECTOR_SECRET_KEY (+ GOOGLE_OAUTH_CLIENT_ID/_SECRET
// for GA4 refresh). Deploy: npx supabase functions deploy connector-run
import { createClient } from '@supabase/supabase-js';
import { runConnectorStream } from '@/shared/lib/connectors/host/index.ts';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}

/** Role claim from an already-gateway-verified JWT (no signature re-check needed). */
function jwtRole(authHeader: string | null): string | undefined {
  const token = authHeader?.replace(/^Bearer\s+/i, '');
  if (!token) return undefined;
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return typeof payload.role === 'string' ? payload.role : undefined;
  } catch {
    return undefined;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  if (req.method !== 'POST') return json({ error: 'POST only' }, 405);

  const secretKey = Deno.env.get('CONNECTOR_SECRET_KEY');
  if (!secretKey) return json({ error: 'CONNECTOR_SECRET_KEY is not configured' }, 500);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'invalid JSON body' }, 400);
  }
  const accountId = typeof body.account_id === 'string' ? body.account_id : null;
  const stream = typeof body.stream === 'string' ? body.stream : null;
  if (!accountId || !stream) return json({ error: 'account_id and stream are required' }, 400);

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const service = createClient(supabaseUrl, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

  // Authorization: a user must be able to see the account under their own RLS.
  const authHeader = req.headers.get('authorization');
  if (jwtRole(authHeader) !== 'service_role') {
    const rls = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader ?? '' } },
    });
    const { data: visible } = await rls
      .from('connected_accounts')
      .select('id')
      .eq('id', accountId)
      .maybeSingle();
    if (!visible) return json({ error: 'connection not found' }, 404);
  }

  try {
    const summary = await runConnectorStream(
      {
        service,
        secretKey,
        env: {
          googleClientId: Deno.env.get('GOOGLE_OAUTH_CLIENT_ID') ?? undefined,
          googleClientSecret: Deno.env.get('GOOGLE_OAUTH_CLIENT_SECRET') ?? undefined,
        },
      },
      {
        accountId,
        stream,
        syncMode: body.sync_mode === 'full_refresh' ? 'full_refresh' : undefined,
        preview: body.preview === true,
        maxRecords: typeof body.max_records === 'number' ? body.max_records : undefined,
      }
    );
    return json(summary, summary.ok ? 200 : 422);
  } catch (err) {
    // Library errors are already payload-free; still avoid echoing unknown shapes.
    const msg = err instanceof Error ? err.message : 'run failed';
    return json({ error: msg.slice(0, 300) }, 500);
  }
});
