// Public read/write metrics API — lets scripts/pipelines push and pull metric
// values programmatically. Auth is a workspace API key (header `x-api-key`); only
// the key's SHA-256 hash is stored (public.api_keys). All access is scoped to the
// key's workspace_id. Uses the service role internally, so it must enforce
// scoping itself — never trust client-supplied workspace/ids.
//
//   GET  /metrics-api?metric=<id|name>            -> { metric, values: [...] }
//   POST /metrics-api  { metric, values:[{period,value,change_percent?,trend?}] }
//                                                  -> { ok, written }
//
// Deploy: npx supabase functions deploy metrics-api
// (verify_jwt is disabled for this function — it authenticates via x-api-key.)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-api-key',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...cors, 'Content-Type': 'application/json' },
  });
}

async function sha256hex(s: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(buf)]
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors });

  const apiKey = req.headers.get('x-api-key');
  if (!apiKey) return json({ error: 'Missing x-api-key header' }, 401);

  const admin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const keyHash = await sha256hex(apiKey);
  const { data: key } = await admin
    .from('api_keys')
    .select('id, workspace_id, created_by')
    .eq('key_hash', keyHash)
    .maybeSingle();
  if (!key) return json({ error: 'Invalid API key' }, 401);
  if (!key.workspace_id)
    return json({ error: 'Key is not bound to a workspace' }, 400);

  // fire-and-forget last_used_at
  admin
    .from('api_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', key.id)
    .then(() => {});

  const findMetric = async (ref: string | null) => {
    if (!ref) return null;
    const q = admin
      .from('tracked_metrics')
      .select('id, name, unit')
      .eq('workspace_id', key.workspace_id);
    const { data } = UUID.test(ref)
      ? await q.eq('id', ref).maybeSingle()
      : await q.eq('name', ref).maybeSingle();
    return data;
  };

  try {
    if (req.method === 'GET') {
      const ref = new URL(req.url).searchParams.get('metric');
      const metric = await findMetric(ref);
      if (!metric) return json({ error: 'Metric not found' }, 404);
      const { data: values, error } = await admin
        .from('metric_values')
        .select('period, value, change_percent, trend')
        .eq('tracked_metric_id', metric.id)
        .order('period', { ascending: true });
      if (error) return json({ error: error.message }, 500);
      return json({ metric, values: values ?? [] });
    }

    if (req.method === 'POST') {
      const body = await req.json().catch(() => null);
      const metric = await findMetric(body?.metric ?? null);
      if (!metric) return json({ error: 'Metric not found' }, 404);
      if (!Array.isArray(body?.values) || body.values.length === 0)
        return json({ error: 'Body must include a non-empty values[]' }, 400);

      const rows = body.values.map((v: any) => {
        if (v?.period == null || v?.value == null)
          throw new Error('Each value needs a period and a value');
        return {
          tracked_metric_id: metric.id,
          period: String(v.period),
          value: Number(v.value),
          change_percent: v.change_percent != null ? Number(v.change_percent) : null,
          trend: v.trend ?? null,
          source: 'api',
          created_by: key.created_by,
          workspace_id: key.workspace_id,
          updated_at: new Date().toISOString(),
        };
      });
      const { error } = await admin
        .from('metric_values')
        .upsert(rows, { onConflict: 'tracked_metric_id,period' });
      if (error) return json({ error: error.message }, 500);
      return json({ ok: true, written: rows.length });
    }

    return json({ error: 'Method not allowed' }, 405);
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'Bad request' }, 400);
  }
});
