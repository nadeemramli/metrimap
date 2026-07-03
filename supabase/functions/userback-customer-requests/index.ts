// User & Ops Signals bridge: Userback feedback -> Linear Customer Requests.
//
// Same server-side shape as the System Health bridge (sync-error-reports): the
// Linear API key lives ONLY here (never in the browser). Userback POSTs a webhook
// on new feedback; we persist it insert-only into `userback_feedback` (idempotent
// by Userback id), then for each pending row:
//   1. resolve/create a Linear Customer keyed by the reporter's email domain
//      (cached via our own table so repeat feedback reuses the same customer),
//   2. create a Linear issue in Triage (labels attached only if they exist),
//   3. attach the feedback as a Customer Request (customerNeed) on that issue.
//
// Two entry shapes (both authenticated by the x-userback-secret shared secret):
//   - Webhook delivery: body carries the feedback -> upsert it, then sweep.
//   - Manual/replay:     body {} (optionally {retryFailed:true}) -> sweep only.
//     Invoke via scripts/sync-userback.mjs.
//
// Config comes from Supabase Vault via public.userback_sync_config(), or function-
// secret env (env wins): USERBACK_SYNC_SECRET, LINEAR_API_KEY, LINEAR_TEAM_ID.
// Optional env: LINEAR_STATE_ID, LINEAR_PROJECT_ID, USERBACK_LABEL_NAMES,
// USERBACK_SYNC_BATCH (default 25).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const LINEAR_URL = 'https://api.linear.app/graphql';
const DEFAULT_LABELS = 'source:user-signal,type:feedback,from:userback';
const PERSONAL_DOMAINS = new Set([
  'gmail.com', 'googlemail.com', 'outlook.com', 'hotmail.com', 'live.com',
  'yahoo.com', 'icloud.com', 'me.com', 'proton.me', 'protonmail.com', 'aol.com',
]);

const M_CREATE_ISSUE = `mutation($input: IssueCreateInput!){ issueCreate(input:$input){ success issue{ id identifier url } } }`;
const M_CREATE_CUSTOMER = `mutation($input: CustomerCreateInput!){ customerCreate(input:$input){ success customer{ id name } } }`;
const M_CREATE_NEED = `mutation($input: CustomerNeedCreateInput!){ customerNeedCreate(input:$input){ success need{ id } } }`;

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

function truncate(s: string | null | undefined, n: number): string {
  if (!s) return '';
  return s.length > n ? s.slice(0, n) + '\n…(truncated)' : s;
}

function routeOf(url: string | null | undefined): string {
  if (!url) return '/';
  try {
    return new URL(url).pathname || '/';
  } catch {
    return '/';
  }
}

function domainOf(email: string | null | undefined): string | null {
  if (!email || !email.includes('@')) return null;
  const d = email.split('@').pop()?.trim().toLowerCase();
  return d || null;
}

async function linear(apiKey: string, query: string, variables: Record<string, unknown>) {
  const res = await fetch(LINEAR_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: apiKey },
    body: JSON.stringify({ query, variables }),
  });
  const body = await res.json().catch(() => null);
  if (!res.ok || body?.errors) {
    const msg = body?.errors?.map((e: { message: string }) => e.message).join('; ') ??
      `Linear HTTP ${res.status}`;
    throw new Error(msg);
  }
  return body.data;
}

type State = { id: string; name: string; type: string; position: number };

async function teamStates(apiKey: string, teamId: string): Promise<State[]> {
  const data = await linear(
    apiKey,
    `query($teamId:String!){ team(id:$teamId){ states{ nodes{ id name type position } } } }`,
    { teamId }
  );
  return data?.team?.states?.nodes ?? [];
}

/** Intake/Triage target for new feedback issues. */
function pickTriageState(states: State[]): string | undefined {
  const envState = Deno.env.get('LINEAR_STATE_ID');
  if (envState) return envState;
  return (
    states.find((s) => s.type === 'triage')?.id ??
    states.find((s) => /intake|triage/i.test(s.name))?.id ??
    states
      .filter((s) => s.type === 'backlog' || s.type === 'unstarted')
      .sort((a, b) => a.position - b.position)[0]?.id
  );
}

async function resolveLabelIds(apiKey: string, teamId: string): Promise<string[]> {
  const wanted = (Deno.env.get('USERBACK_LABEL_NAMES') ?? DEFAULT_LABELS)
    .split(',')
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (wanted.length === 0) return [];
  const data = await linear(
    apiKey,
    `query($teamId:String!){ team(id:$teamId){ labels{ nodes{ id name } } } }`,
    { teamId }
  );
  const nodes: Array<{ id: string; name: string }> = data?.team?.labels?.nodes ?? [];
  return nodes.filter((l) => wanted.includes(l.name.toLowerCase())).map((l) => l.id);
}

/** Normalise the many shapes Userback can POST into one flat record. */
function normalizeFeedback(raw: Record<string, unknown>) {
  const fb = (raw.feedback ?? raw.data ?? raw) as Record<string, unknown>;
  const pick = (...keys: string[]): string | null => {
    for (const k of keys) {
      const v = fb[k];
      if (typeof v === 'string' && v.trim()) return v.trim();
      if (typeof v === 'number') return String(v);
    }
    return null;
  };
  const reporter = (fb.reporter ?? fb.user ?? {}) as Record<string, unknown>;
  const email =
    pick('email', 'reporter_email', 'user_email') ??
    (typeof reporter.email === 'string' ? reporter.email : null);
  const ratingRaw = pick('rating', 'nps', 'score');
  const rating = ratingRaw != null && /^\d+$/.test(ratingRaw) ? Number(ratingRaw) : null;
  return {
    userback_id: pick('id', 'feedback_id', 'ticket_id') ?? null,
    reporter_email: email,
    reporter_name:
      pick('name', 'reporter_name', 'user_name') ??
      (typeof reporter.name === 'string' ? reporter.name : null),
    title: pick('title', 'subject', 'summary'),
    body: pick('description', 'message', 'comment', 'body', 'text'),
    rating,
    category: pick('category', 'type', 'kind'),
    page_url: pick('page_url', 'url', 'pageUrl'),
    raw: fb,
  };
}

type FeedbackRow = {
  id: string;
  userback_id: string;
  reporter_email: string | null;
  reporter_name: string | null;
  reporter_domain: string | null;
  title: string | null;
  body: string | null;
  rating: number | null;
  category: string | null;
  page_url: string | null;
  linear_customer_id: string | null;
};

function buildIssueTitle(r: FeedbackRow): string {
  const base = (r.title || r.body || 'User feedback').replace(/\s+/g, ' ').slice(0, 80);
  return `Feedback: ${base}`;
}

function buildIssueBody(r: FeedbackRow): string {
  const route = routeOf(r.page_url);
  return [
    '## Summary',
    '',
    'Customer feedback captured via Userback and bridged into Linear Customer Requests.',
    '',
    '## Classification',
    '',
    '- Source group: User & Ops Signals',
    '- Source detail: Userback feedback',
    '- Task type: Feedback',
    `- Rating: ${r.rating != null ? r.rating : '—'}`,
    `- Category: ${r.category ?? '—'}`,
    '',
    '## Reporter',
    '',
    `- Name: ${r.reporter_name ?? '—'}`,
    `- Email: ${r.reporter_email ?? '—'}`,
    `- Domain (→ Customer): ${r.reporter_domain ?? '—'}`,
    `- Page: ${r.page_url ?? '—'} (route \`${route}\`)`,
    '',
    '## Feedback',
    '',
    r.body ? truncate(r.body, 4000) : '_none provided_',
    '',
    '## Links',
    '',
    `- Userback feedback id: \`${r.userback_id}\``,
    '- Supabase table: `userback_feedback` (raw + sync state)',
  ].join('\n');
}

/** Config from function-secret env, falling back to Vault (public.userback_sync_config). */
async function loadConfig(admin: ReturnType<typeof createClient>) {
  let apiKey = Deno.env.get('LINEAR_API_KEY') || undefined;
  let teamId = Deno.env.get('LINEAR_TEAM_ID') || undefined;
  let secret = Deno.env.get('USERBACK_SYNC_SECRET') || undefined;
  if (!apiKey || !teamId || !secret) {
    try {
      const { data } = await admin.rpc('userback_sync_config');
      const row = Array.isArray(data) ? data[0] : data;
      if (row) {
        apiKey = apiKey || row.linear_api_key || undefined;
        teamId = teamId || row.linear_team_id || undefined;
        secret = secret || row.userback_sync_secret || undefined;
      }
    } catch {
      /* Vault RPC unavailable; rely on env */
    }
  }
  return { apiKey, teamId, secret };
}

/** Resolve (or create) the Linear Customer for a feedback row's email domain. */
async function resolveCustomerId(
  admin: ReturnType<typeof createClient>,
  apiKey: string,
  r: FeedbackRow
): Promise<string> {
  const domain = r.reporter_domain;
  // 1. Reuse a customer we already created for this domain (our own cache — no
  //    reliance on Linear filter capabilities). Personal domains never share a
  //    customer; each such reporter is their own "individual" customer by email.
  if (domain && !PERSONAL_DOMAINS.has(domain)) {
    const { data: prior } = await admin
      .from('userback_feedback')
      .select('linear_customer_id')
      .eq('reporter_domain', domain)
      .not('linear_customer_id', 'is', null)
      .limit(1)
      .maybeSingle();
    if (prior?.linear_customer_id) return prior.linear_customer_id as string;
  }

  // 2. Create a new customer. Company domain -> org customer; personal/no email ->
  //    individual customer keyed by email (or anonymous).
  const isCompany = domain && !PERSONAL_DOMAINS.has(domain);
  const name = isCompany ? domain : r.reporter_email || r.reporter_name || 'Anonymous (Userback)';
  const externalId = isCompany
    ? `userback:domain:${domain}`
    : `userback:email:${(r.reporter_email ?? 'anonymous').toLowerCase()}`;
  const data = await linear(apiKey, M_CREATE_CUSTOMER, {
    input: {
      name,
      externalIds: [externalId],
      ...(isCompany ? { domains: [domain] } : {}),
    },
  });
  const id = data?.customerCreate?.customer?.id;
  if (!id) throw new Error('customerCreate returned no customer id');
  return id;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const admin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const { apiKey, teamId, secret } = await loadConfig(admin);
  if (!secret || req.headers.get('x-userback-secret') !== secret) {
    return json({ error: 'Unauthorized' }, 401);
  }
  if (!apiKey || !teamId) {
    return json({ error: 'LINEAR_API_KEY and LINEAR_TEAM_ID must be configured' }, 500);
  }

  const batch = Number(Deno.env.get('USERBACK_SYNC_BATCH') ?? '25');
  const projectId = Deno.env.get('LINEAR_PROJECT_ID') || undefined;
  const summary = { intake: 0, processed: 0, created: 0, skipped: 0, deduped: 0, failed: 0 };

  let payload: Record<string, unknown> = {};
  try {
    payload = (await req.json()) as Record<string, unknown>;
  } catch {
    payload = {};
  }

  // --- Optional intake: a webhook delivery carries the feedback itself. ---
  const looksLikeFeedback =
    payload && (payload.feedback || payload.data ||
      payload.id || payload.description || payload.message || payload.title);
  if (looksLikeFeedback && !payload.retryFailed) {
    const n = normalizeFeedback(payload);
    if (!n.userback_id) {
      return json({ error: 'Feedback payload missing an id' }, 422);
    }
    const { error } = await admin.from('userback_feedback').upsert(
      {
        userback_id: n.userback_id,
        reporter_email: n.reporter_email,
        reporter_name: n.reporter_name,
        reporter_domain: domainOf(n.reporter_email),
        title: n.title,
        body: n.body,
        rating: n.rating,
        category: n.category,
        page_url: n.page_url,
        raw: n.raw,
      },
      { onConflict: 'userback_id', ignoreDuplicates: true }
    );
    if (error) return json({ error: error.message }, 500);
    summary.intake++;
  }

  if (payload.retryFailed) {
    await admin
      .from('userback_feedback')
      .update({ sync_status: 'pending', updated_at: new Date().toISOString() })
      .eq('sync_status', 'failed');
  }

  // Resolve Linear metadata once.
  let triageStateId: string | undefined;
  let labelIds: string[] = [];
  try {
    const states = await teamStates(apiKey, teamId);
    triageStateId = pickTriageState(states);
    labelIds = await resolveLabelIds(apiKey, teamId);
  } catch (e) {
    return json({ error: `Linear metadata: ${e instanceof Error ? e.message : e}` }, 502);
  }

  // --- Sweep pending rows -> Linear (Customer + Issue + Customer Request). ---
  const { data: pending, error: pErr } = await admin
    .from('userback_feedback')
    .select(
      'id, userback_id, reporter_email, reporter_name, reporter_domain, title, body, rating, category, page_url, linear_customer_id'
    )
    .eq('sync_status', 'pending')
    .order('created_at', { ascending: true })
    .limit(batch);
  if (pErr) return json({ error: pErr.message }, 500);

  for (const r of (pending ?? []) as FeedbackRow[]) {
    summary.processed++;
    const nowIso = new Date().toISOString();
    try {
      const customerId = await resolveCustomerId(admin, apiKey, r);

      const issueData = await linear(apiKey, M_CREATE_ISSUE, {
        input: {
          teamId,
          title: buildIssueTitle(r),
          description: buildIssueBody(r),
          ...(triageStateId ? { stateId: triageStateId } : {}),
          ...(labelIds.length ? { labelIds } : {}),
          ...(projectId ? { projectId } : {}),
        },
      });
      const issue = issueData?.issueCreate?.issue;
      if (!issue?.id) throw new Error('issueCreate returned no issue id');

      // Mark-important when the reporter is unhappy (low rating).
      const important = r.rating != null && r.rating <= 2 ? 1 : 0;
      const needData = await linear(apiKey, M_CREATE_NEED, {
        input: {
          body: r.body || r.title || 'User feedback (see linked issue)',
          customerId,
          issueId: issue.id,
          priority: important,
        },
      });
      const needId = needData?.customerNeedCreate?.need?.id ?? null;

      await admin
        .from('userback_feedback')
        .update({
          linear_customer_id: customerId,
          linear_issue_id: issue.id,
          linear_issue_identifier: issue.identifier ?? null,
          linear_issue_url: issue.url ?? null,
          linear_need_id: needId,
          sync_status: 'synced',
          sync_error: null,
          linear_synced_at: nowIso,
          updated_at: nowIso,
        })
        .eq('id', r.id);
      summary.created++;
    } catch (e) {
      summary.failed++;
      await admin
        .from('userback_feedback')
        .update({
          sync_status: 'failed',
          sync_error: e instanceof Error ? e.message : String(e),
          updated_at: nowIso,
        })
        .eq('id', r.id);
    }
  }

  return json({ ok: true, ...summary });
});
