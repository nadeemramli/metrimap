// OAuth connect flow entrypoint (CVS-322). Three routes over the shared flow library
// (src/shared/lib/connectors/oauth, mapped via deno.json):
//
//   POST /connector-oauth/start    { account_id }  -> { ok, url }        (user JWT)
//   GET  /connector-oauth/callback ?code&state     -> 302 back to app    (public)
//   POST /connector-oauth/sources  { account_id }  -> { ok, sources }    (user JWT)
//
// ⚠️ Deploy with --no-verify-jwt (the provider redirects the browser to /callback
// with no Authorization header). /start and /sources therefore validate the caller
// themselves: the user's JWT must be able to SEE the account under RLS.
//
// Function secrets: CONNECTOR_SECRET_KEY (state signing + token encryption),
// GOOGLE_OAUTH_CLIENT_ID / GOOGLE_OAUTH_CLIENT_SECRET, APP_URL (redirect target).
// The Google OAuth client must register:  https://<ref>.functions.supabase.co/connector-oauth/callback
// Deploy: npx supabase functions deploy connector-oauth --no-verify-jwt
import { createClient } from '@supabase/supabase-js';
import { completeCallback, listSources, startConnect } from '@/shared/lib/connectors/oauth/index.ts';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}

function deps(req: Request) {
  const service = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const redirectUri = `${new URL(req.url).origin}/connector-oauth/callback`;
  return {
    service,
    secretKey: Deno.env.get('CONNECTOR_SECRET_KEY') ?? '',
    getEnv: (k: string) => Deno.env.get(k),
    redirectUri,
  };
}

/** The caller's JWT must see the account under RLS — otherwise 404, no info leak. */
async function callerCanSee(req: Request, accountId: string): Promise<boolean> {
  const auth = req.headers.get('authorization');
  if (!auth) return false;
  const rls = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
    global: { headers: { Authorization: auth } },
  });
  const { data } = await rls.from('connected_accounts').select('id').eq('id', accountId).maybeSingle();
  return Boolean(data);
}

async function accountIdFrom(req: Request): Promise<string | null> {
  try {
    const body = await req.json();
    return typeof body.account_id === 'string' ? body.account_id : null;
  } catch {
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });
  const url = new URL(req.url);
  const route = url.pathname.split('/').filter(Boolean).pop();
  const d = deps(req);
  if (!d.secretKey) return json({ error: 'CONNECTOR_SECRET_KEY is not configured' }, 500);

  if (route === 'callback' && req.method === 'GET') {
    const appUrl = Deno.env.get('APP_URL') ?? 'https://use.canvasm.app';
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const back = (params: Record<string, string>) =>
      new Response(null, {
        status: 302,
        headers: { Location: `${appUrl}/?${new URLSearchParams(params).toString()}` },
      });

    if (!code || !state) return back({ connector_oauth: 'error', reason: 'missing code or state' });
    const result = await completeCallback(d, { code, state });
    return result.ok
      ? back({ connector_oauth: 'success', account_id: result.accountId, connector: result.connectorId })
      : back({ connector_oauth: 'error', reason: result.error.slice(0, 120) });
  }

  if ((route === 'start' || route === 'sources') && req.method === 'POST') {
    const accountId = await accountIdFrom(req);
    if (!accountId) return json({ error: 'account_id is required' }, 400);
    if (!(await callerCanSee(req, accountId))) return json({ error: 'connection not found' }, 404);
    const result =
      route === 'start'
        ? await startConnect(d, { accountId })
        : await listSources(d, { accountId });
    return json(result, result.ok ? 200 : 422);
  }

  return json({ error: 'not found' }, 404);
});
