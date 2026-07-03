// System Health intake bridge: Supabase error_report_groups -> Linear issues.
//
// The browser only ever writes raw crash reports to Supabase (see ErrorBoundary).
// A DB trigger rolls each report into a per-fingerprint group. THIS function is
// the only place a Linear credential exists. Each run does two passes:
//   1. SYNC   — 'pending' groups -> create one Linear issue per fingerprint
//               (Intake/Triage), comment on repeats (rate-limited), reopen on
//               regression.
//   2. RESOLVE (Loop A) — 'synced' groups whose fingerprint has gone quiet for
//               N days -> comment + move the still-open issue to Done, mark the
//               group 'resolved'. A recurrence flips it back to 'pending' via the
//               rollup trigger, so it auto-reopens.
//
// Invoked every ~5 min by pg_cron (migration 20260703140000) or manually via
// scripts/sync-error-reports.mjs. Auth is a shared secret (x-sync-secret).
//
// Config comes from Supabase Vault via public.error_sync_config(), or function-
// secret env (env wins): ERROR_SYNC_SECRET, LINEAR_API_KEY, LINEAR_TEAM_ID.
// Optional env: LINEAR_STATE_ID, LINEAR_PROJECT_ID, LINEAR_LABEL_NAMES,
// ERROR_SYNC_INCLUDE_DEV, ERROR_SYNC_BATCH, ERROR_SYNC_COMMENT_WINDOW_MIN,
// ERROR_RESOLVE_AFTER_DAYS (default 7), ERROR_RESOLVE_BATCH (default 25).

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const LINEAR_URL = 'https://api.linear.app/graphql';
const DEFAULT_LABELS = 'source:system-health,type:bug,runtime-error,from:error-boundary';

const Q_ISSUE_STATE = `query($id:String!){ issue(id:$id){ state{ type } } }`;
const M_COMMENT = `mutation($input: CommentCreateInput!){ commentCreate(input:$input){ success } }`;
const M_SET_STATE = `mutation($id:String!,$s:String!){ issueUpdate(id:$id, input:{stateId:$s}){ success } }`;
const M_CREATE = `mutation($input: IssueCreateInput!){ issueCreate(input:$input){ success issue{ id identifier url } } }`;

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

function isDevUrl(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    const h = new URL(url).hostname;
    return h === 'localhost' || h === '127.0.0.1' || h === '0.0.0.0';
  } catch {
    return false;
  }
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

/** Intake/Triage target for new + reopened issues. */
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

/** "Done" target for auto-resolved issues. */
function pickDoneState(states: State[]): string | undefined {
  return states
    .filter((s) => s.type === 'completed')
    .sort((a, b) => a.position - b.position)[0]?.id;
}

async function resolveLabelIds(apiKey: string, teamId: string): Promise<string[]> {
  const wanted = (Deno.env.get('LINEAR_LABEL_NAMES') ?? DEFAULT_LABELS)
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

type Group = {
  fingerprint: string;
  occurrence_count: number;
  last_synced_count: number;
  first_seen_at: string;
  last_seen_at: string;
  severity: string;
  sample_report_id: string | null;
  linear_issue_id: string | null;
  linear_synced_at: string | null;
};

type Report = {
  message: string | null;
  error_stack: string | null;
  component_stack: string | null;
  note: string | null;
  url: string | null;
  user_agent: string | null;
  client_time: string | null;
  clerk_user_id: string | null;
};

function buildTitle(route: string, message: string | null): string {
  const msg = (message ?? 'Unknown error').replace(/\s+/g, ' ').slice(0, 80);
  return `Runtime error on ${route}: ${msg}`;
}

function buildBody(g: Group, r: Report, route: string, priorityLabel: string): string {
  return [
    '## Summary',
    '',
    'Runtime crash reported by the in-app ErrorBoundary.',
    '',
    '## Classification',
    '',
    '- Source group: System Health',
    '- Source detail: Runtime error report',
    '- Task type: Bug',
    `- Product area: ${route.split('/').filter(Boolean)[0] ?? 'app'}`,
    `- Severity: ${g.severity}`,
    `- Priority: ${priorityLabel}`,
    '',
    '## Impact',
    '',
    `- Occurrences: ${g.occurrence_count}`,
    `- First seen: ${g.first_seen_at}`,
    `- Last seen: ${g.last_seen_at}`,
    `- Affected route: ${route}`,
    `- Reporter (Clerk id, if signed in): ${r.clerk_user_id ?? '—'}`,
    '',
    '## User note',
    '',
    r.note ? truncate(r.note, 1000) : '_none provided_',
    '',
    '## Error',
    '',
    `- Message: ${r.message ?? '—'}`,
    `- Fingerprint: \`${g.fingerprint}\``,
    `- Client time: ${r.client_time ?? '—'}`,
    `- User agent: ${r.user_agent ?? '—'}`,
    '',
    '## Stack',
    '',
    '```',
    truncate(r.error_stack, 4000) || '(none)',
    '```',
    '',
    '## React component stack',
    '',
    '```',
    truncate(r.component_stack, 4000) || '(none)',
    '```',
    '',
    '## Links',
    '',
    '- Supabase table: `error_reports` (raw) / `error_report_groups` (rollup)',
  ].join('\n');
}

/** Config from function-secret env, falling back to Vault (public.error_sync_config). */
async function loadConfig(admin: ReturnType<typeof createClient>) {
  let apiKey = Deno.env.get('LINEAR_API_KEY') || undefined;
  let teamId = Deno.env.get('LINEAR_TEAM_ID') || undefined;
  let secret = Deno.env.get('ERROR_SYNC_SECRET') || undefined;
  if (!apiKey || !teamId || !secret) {
    try {
      const { data } = await admin.rpc('error_sync_config');
      const row = Array.isArray(data) ? data[0] : data;
      if (row) {
        apiKey = apiKey || row.linear_api_key || undefined;
        teamId = teamId || row.linear_team_id || undefined;
        secret = secret || row.error_sync_secret || undefined;
      }
    } catch {
      /* Vault RPC unavailable; rely on env */
    }
  }
  return { apiKey, teamId, secret };
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const admin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const { apiKey, teamId, secret } = await loadConfig(admin);
  if (!secret || req.headers.get('x-sync-secret') !== secret) {
    return json({ error: 'Unauthorized' }, 401);
  }
  if (!apiKey || !teamId) {
    return json({ error: 'LINEAR_API_KEY and LINEAR_TEAM_ID must be configured' }, 500);
  }

  const includeDev = Deno.env.get('ERROR_SYNC_INCLUDE_DEV') === 'true';
  const batch = Number(Deno.env.get('ERROR_SYNC_BATCH') ?? '25');
  const windowMin = Number(Deno.env.get('ERROR_SYNC_COMMENT_WINDOW_MIN') ?? '45');
  const projectId = Deno.env.get('LINEAR_PROJECT_ID') || undefined;
  const resolveDays = Number(Deno.env.get('ERROR_RESOLVE_AFTER_DAYS') ?? '7');
  const resolveBatch = Number(Deno.env.get('ERROR_RESOLVE_BATCH') ?? '25');

  const summary = {
    processed: 0, created: 0, commented: 0, reopened: 0,
    skipped: 0, deferred: 0, resolved: 0, failed: 0,
  };

  // Resolve Linear metadata once (states + labels).
  let triageStateId: string | undefined;
  let doneStateId: string | undefined;
  let labelIds: string[] = [];
  try {
    const states = await teamStates(apiKey, teamId);
    triageStateId = pickTriageState(states);
    doneStateId = pickDoneState(states);
    labelIds = await resolveLabelIds(apiKey, teamId);
  } catch (e) {
    return json({ error: `Linear metadata: ${e instanceof Error ? e.message : e}` }, 502);
  }

  // ---- PASS 1: SYNC pending groups ----
  const { data: pending, error: gErr } = await admin
    .from('error_report_groups')
    .select(
      'fingerprint, occurrence_count, last_synced_count, first_seen_at, last_seen_at, severity, sample_report_id, linear_issue_id, linear_synced_at'
    )
    .eq('sync_status', 'pending')
    .order('last_seen_at', { ascending: true })
    .limit(batch);
  if (gErr) return json({ error: gErr.message }, 500);

  for (const g of (pending ?? []) as Group[]) {
    summary.processed++;
    try {
      const { data: r } = await admin
        .from('error_reports')
        .select('message, error_stack, component_stack, note, url, user_agent, client_time, clerk_user_id')
        .eq('id', g.sample_report_id)
        .maybeSingle();
      const report = (r ?? {}) as Report;
      const route = routeOf(report.url);

      if (isDevUrl(report.url) && !includeDev) {
        await admin
          .from('error_report_groups')
          .update({ sync_status: 'skipped', updated_at: new Date().toISOString() })
          .eq('fingerprint', g.fingerprint);
        summary.skipped++;
        continue;
      }

      const priority = g.occurrence_count >= 10 ? 2 : 3;
      const priorityLabel = priority === 2 ? 'High' : 'Medium';
      const nowIso = new Date().toISOString();

      if (!g.linear_issue_id) {
        const data = await linear(apiKey, M_CREATE, {
          input: {
            teamId,
            title: buildTitle(route, report.message),
            description: buildBody(g, report, route, priorityLabel),
            priority,
            ...(triageStateId ? { stateId: triageStateId } : {}),
            ...(labelIds.length ? { labelIds } : {}),
            ...(projectId ? { projectId } : {}),
          },
        });
        const issue = data?.issueCreate?.issue;
        await admin
          .from('error_report_groups')
          .update({
            linear_issue_id: issue?.id ?? null,
            linear_issue_identifier: issue?.identifier ?? null,
            linear_issue_url: issue?.url ?? null,
            title: buildTitle(route, report.message),
            last_synced_count: g.occurrence_count,
            sync_status: 'synced',
            sync_error: null,
            linear_synced_at: nowIso,
            updated_at: nowIso,
          })
          .eq('fingerprint', g.fingerprint);
        summary.created++;
        continue;
      }

      const newOccurrences = g.occurrence_count - g.last_synced_count;
      const withinWindow =
        g.linear_synced_at != null &&
        Date.now() - new Date(g.linear_synced_at).getTime() < windowMin * 60_000;

      if (newOccurrences <= 0) {
        await admin
          .from('error_report_groups')
          .update({ sync_status: 'synced', sync_error: null, updated_at: nowIso })
          .eq('fingerprint', g.fingerprint);
        continue;
      }
      if (withinWindow) {
        summary.deferred++;
        continue;
      }

      // Reopen if it recurred after being closed (regression), else just comment.
      const st = await linear(apiKey, Q_ISSUE_STATE, { id: g.linear_issue_id });
      const closed = ['completed', 'canceled'].includes(st?.issue?.state?.type);
      if (closed && triageStateId) {
        await linear(apiKey, M_SET_STATE, { id: g.linear_issue_id, s: triageStateId });
      }
      await linear(apiKey, M_COMMENT, {
        input: {
          issueId: g.linear_issue_id,
          body: closed
            ? `🔁 **Regression** — recurred after being resolved, reopened. **${newOccurrences}** new occurrence(s), now **${g.occurrence_count}** total. Last seen ${g.last_seen_at} on \`${route}\`.`
            : `🔁 **${newOccurrences}** new occurrence(s) since last sync — now **${g.occurrence_count}** total. Last seen ${g.last_seen_at} on \`${route}\`.`,
        },
      });
      await admin
        .from('error_report_groups')
        .update({
          last_synced_count: g.occurrence_count,
          sync_status: 'synced',
          sync_error: null,
          linear_synced_at: nowIso,
          updated_at: nowIso,
        })
        .eq('fingerprint', g.fingerprint);
      if (closed) summary.reopened++;
      else summary.commented++;
    } catch (e) {
      summary.failed++;
      await admin
        .from('error_report_groups')
        .update({
          sync_status: 'failed',
          sync_error: e instanceof Error ? e.message : String(e),
          updated_at: new Date().toISOString(),
        })
        .eq('fingerprint', g.fingerprint);
    }
  }

  // ---- PASS 2: RESOLVE quiet groups (Loop A) ----
  const cutoff = new Date(Date.now() - resolveDays * 86_400_000).toISOString();
  const { data: stale } = await admin
    .from('error_report_groups')
    .select('fingerprint, last_seen_at, occurrence_count, linear_issue_id')
    .eq('sync_status', 'synced')
    .not('linear_issue_id', 'is', null)
    .lt('last_seen_at', cutoff)
    .limit(resolveBatch);

  for (const g of (stale ?? []) as Array<
    Pick<Group, 'fingerprint' | 'last_seen_at' | 'occurrence_count' | 'linear_issue_id'>
  >) {
    try {
      const d = await linear(apiKey, Q_ISSUE_STATE, { id: g.linear_issue_id });
      const t = d?.issue?.state?.type as string | undefined;
      const nowIso = new Date().toISOString();

      if (t === 'triage' || t === 'backlog' || t === 'unstarted') {
        // Still-open, untouched issue that's gone quiet → auto-resolve.
        await linear(apiKey, M_COMMENT, {
          input: {
            issueId: g.linear_issue_id,
            body: `✅ **Auto-resolved** — no recurrence in ${resolveDays} days (last seen ${g.last_seen_at}, ${g.occurrence_count} total occurrence(s)). Reopens automatically if the crash recurs.`,
          },
        });
        if (doneStateId) {
          await linear(apiKey, M_SET_STATE, { id: g.linear_issue_id, s: doneStateId });
        }
        await admin
          .from('error_report_groups')
          .update({ sync_status: 'resolved', updated_at: nowIso })
          .eq('fingerprint', g.fingerprint);
        summary.resolved++;
      } else if (t === 'completed' || t === 'canceled') {
        // Someone already closed it — stop tracking (recurrence still reopens via trigger).
        await admin
          .from('error_report_groups')
          .update({ sync_status: 'resolved', updated_at: nowIso })
          .eq('fingerprint', g.fingerprint);
        summary.resolved++;
      }
      // 'started' (In Progress/In Review): a human/agent owns it — leave as synced.
    } catch {
      /* leave as synced; retry next run */
    }
  }

  return json({ ok: true, ...summary });
});
