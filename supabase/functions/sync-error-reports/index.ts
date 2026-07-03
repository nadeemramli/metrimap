// System Health intake bridge: Supabase error_report_groups -> Linear issues.
//
// The browser only ever writes raw crash reports to Supabase (see ErrorBoundary).
// A DB trigger rolls each report into a per-fingerprint group. THIS function is
// the only place a Linear credential exists — it processes 'pending' groups and
// creates one Linear issue per fingerprint (in Intake/Triage), commenting on
// repeats. Invoked every ~5 min by pg_cron (migration 20260703140000) or manually
// via scripts/sync-error-reports.mjs. Auth is a shared secret (x-sync-secret).
//
// Deploy: npx supabase functions deploy sync-error-reports
// (Set verify_jwt off — it authenticates via x-sync-secret, not a user JWT.)
//
// Required env (function secrets):
//   ERROR_SYNC_SECRET        shared secret; must match the x-sync-secret header
//   LINEAR_API_KEY           Linear personal API key (server-side only)
//   LINEAR_TEAM_ID           target Linear team id
// Optional env:
//   LINEAR_STATE_ID          Intake/Triage state id (else auto-resolved by type/name)
//   LINEAR_PROJECT_ID        attach issues to a project
//   LINEAR_LABEL_NAMES       comma list; default below. Only EXISTING labels are attached.
//   ERROR_SYNC_INCLUDE_DEV   'true' to also sync localhost crashes (default: skip)
//   ERROR_SYNC_BATCH         max groups per run (default 25)
//   ERROR_SYNC_COMMENT_WINDOW_MIN  min minutes between occurrence comments (default 45)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const LINEAR_URL = 'https://api.linear.app/graphql';
const DEFAULT_LABELS = 'source:system-health,type:bug,runtime-error,from:error-boundary';

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

// --- Linear metadata resolution (cached per invocation) ---

async function resolveStateId(apiKey: string, teamId: string): Promise<string | undefined> {
  const envState = Deno.env.get('LINEAR_STATE_ID');
  if (envState) return envState;
  const data = await linear(
    apiKey,
    `query($teamId:String!){ team(id:$teamId){ states{ nodes{ id name type position } } } }`,
    { teamId }
  );
  const nodes: Array<{ id: string; name: string; type: string; position: number }> =
    data?.team?.states?.nodes ?? [];
  const byType = nodes.find((s) => s.type === 'triage');
  if (byType) return byType.id;
  const byName = nodes.find((s) => /intake|triage/i.test(s.name));
  if (byName) return byName.id;
  const backlog = nodes
    .filter((s) => s.type === 'backlog' || s.type === 'unstarted')
    .sort((a, b) => a.position - b.position)[0];
  return backlog?.id;
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
  // Only attach labels that already exist (don't clutter the workspace).
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

Deno.serve(async (req) => {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const secret = Deno.env.get('ERROR_SYNC_SECRET');
  if (!secret || req.headers.get('x-sync-secret') !== secret) {
    return json({ error: 'Unauthorized' }, 401);
  }

  const apiKey = Deno.env.get('LINEAR_API_KEY');
  const teamId = Deno.env.get('LINEAR_TEAM_ID');
  if (!apiKey || !teamId) {
    return json({ error: 'LINEAR_API_KEY and LINEAR_TEAM_ID must be set' }, 500);
  }

  const admin = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );

  const includeDev = Deno.env.get('ERROR_SYNC_INCLUDE_DEV') === 'true';
  const batch = Number(Deno.env.get('ERROR_SYNC_BATCH') ?? '25');
  const windowMin = Number(Deno.env.get('ERROR_SYNC_COMMENT_WINDOW_MIN') ?? '45');
  const projectId = Deno.env.get('LINEAR_PROJECT_ID') || undefined;

  const { data: groups, error: gErr } = await admin
    .from('error_report_groups')
    .select(
      'fingerprint, occurrence_count, last_synced_count, first_seen_at, last_seen_at, severity, sample_report_id, linear_issue_id, linear_synced_at'
    )
    .eq('sync_status', 'pending')
    .order('last_seen_at', { ascending: true })
    .limit(batch);
  if (gErr) return json({ error: gErr.message }, 500);

  const summary = { processed: 0, created: 0, commented: 0, skipped: 0, deferred: 0, failed: 0 };
  if (!groups || groups.length === 0) return json({ ok: true, ...summary });

  // Resolve Linear metadata once per run (cheap, avoids per-issue lookups).
  let stateId: string | undefined;
  let labelIds: string[] = [];
  try {
    stateId = await resolveStateId(apiKey, teamId);
    labelIds = await resolveLabelIds(apiKey, teamId);
  } catch (e) {
    return json({ error: `Linear metadata: ${e instanceof Error ? e.message : e}` }, 502);
  }

  for (const g of groups as Group[]) {
    summary.processed++;
    try {
      const { data: r } = await admin
        .from('error_reports')
        .select('message, error_stack, component_stack, note, url, user_agent, client_time, clerk_user_id')
        .eq('id', g.sample_report_id)
        .maybeSingle();
      const report = (r ?? {}) as Report;
      const route = routeOf(report.url);

      // Skip local-dev crashes unless explicitly enabled.
      if (isDevUrl(report.url) && !includeDev) {
        await admin
          .from('error_report_groups')
          .update({ sync_status: 'skipped', updated_at: new Date().toISOString() })
          .eq('fingerprint', g.fingerprint);
        summary.skipped++;
        continue;
      }

      const priority = g.occurrence_count >= 10 ? 2 : 3; // high if it repeats a lot, else medium
      const priorityLabel = priority === 2 ? 'High' : 'Medium';
      const nowIso = new Date().toISOString();

      if (!g.linear_issue_id) {
        // First time we see this fingerprint -> create an Intake/Triage issue.
        const data = await linear(
          apiKey,
          `mutation($input: IssueCreateInput!){ issueCreate(input:$input){ success issue{ id identifier url } } }`,
          {
            input: {
              teamId,
              title: buildTitle(route, report.message),
              description: buildBody(g, report, route, priorityLabel),
              priority,
              ...(stateId ? { stateId } : {}),
              ...(labelIds.length ? { labelIds } : {}),
              ...(projectId ? { projectId } : {}),
            },
          }
        );
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

      // Existing issue: comment on new occurrences, rate-limited.
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
        // Defer: leave 'pending' so a later run posts the update once the window passes.
        summary.deferred++;
        continue;
      }

      await linear(
        apiKey,
        `mutation($input: CommentCreateInput!){ commentCreate(input:$input){ success } }`,
        {
          input: {
            issueId: g.linear_issue_id,
            body: `🔁 **${newOccurrences}** new occurrence(s) since last sync — now **${g.occurrence_count}** total. Last seen ${g.last_seen_at} on \`${route}\`.`,
          },
        }
      );
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
      summary.commented++;
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

  return json({ ok: true, ...summary });
});
