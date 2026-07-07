/**
 * Local MCP agent run for the loop recordings — drives the SAME registry tools
 * the deployed MCP server dispatches (src/shared/lib/api/mcp/registry.ts),
 * authenticated exactly like the server: mint a short-lived Supabase JWT for
 * the demo (e2e) user → RLS-scoped client → dispatchTool. No service role.
 *
 * Usage:
 *   npx tsx e2e/agent-run.mts prep              # create the demo canvas, store id
 *   npx tsx e2e/agent-run.mts seed              # the "agent run": build the tree
 *   npx tsx e2e/agent-run.mts enrich            # give metric cards value series
 *   npx tsx e2e/agent-run.mts cleanup           # delete the demo canvas
 *
 * Needs .env (Supabase URL/anon key) + ~/.metrimap-deploy.env (SUPABASE_JWT_SECRET).
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/shared/lib/supabase/types';
import { mintSupabaseJwt } from '@/shared/lib/api/mcp/auth/jwt';
import { dispatchTool } from '@/shared/lib/api/mcp/registry';
import type { McpAuthContext } from '@/shared/lib/api/mcp/authContext';
import { updateMetricCard } from '@/shared/lib/supabase/services/metric-cards';
import {
  upsertContract,
  setMetricLinks,
} from '@/shared/lib/supabase/services/strategyImpact';
import type { MetricValue } from '@/shared/types';

function loadEnv(path: string) {
  try {
    for (const line of readFileSync(path, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch {
    /* optional */
  }
}
loadEnv('.env');
loadEnv(join(homedir(), '.metrimap-deploy.env'));

// The demo (e2e) account — nodes are attributed to it and land in its org
// workspace so the recording session sees them. Ids observed via list_canvases.
const DEMO_USER = 'user_3FoUYMmZF6S93LC3uacGZ6VaC2t';
const DEMO_ORG = 'org_3FoSILwCPoJqixKBkoMyC8P8OQ0';
const STATE_FILE = 'e2e/loops/demo-canvas.json';

async function ctx(): Promise<McpAuthContext> {
  const url = process.env.VITE_SUPABASE_URL!;
  const anon = process.env.VITE_SUPABASE_ANON_KEY!;
  const secret = process.env.SUPABASE_JWT_SECRET!;
  const jwt = await mintSupabaseJwt({ sub: DEMO_USER, orgId: DEMO_ORG }, secret, 1800);
  const client = createClient<Database>(url, anon, {
    global: { headers: { Authorization: `Bearer ${jwt}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return { userId: DEMO_USER, client, scopes: ['read', 'write'] };
}

const call = async (c: McpAuthContext, tool: string, args: unknown) => {
  const res = (await dispatchTool(tool, args, c)) as Record<string, unknown>;
  console.log(`[agent] ${tool} ok${res && 'id' in res ? ` → ${res.id}` : ''}`);
  return res;
};

function series(base: number, growth: number, pct = true): MetricValue[] {
  const out: MetricValue[] = [];
  let v = base;
  for (let w = 12; w >= 1; w--) {
    const bump = 1 + growth + (Math.sin(w * 2.7) + Math.cos(w * 1.3)) * 0.012;
    v = v * bump;
    const prev = out[out.length - 1]?.value ?? v / bump;
    const change = ((v - prev) / prev) * 100;
    const monday = new Date(Date.UTC(2026, 3, 13) + (12 - w) * 7 * 86400_000)
      .toISOString()
      .slice(0, 10);
    out.push({
      period: monday,
      value: Math.round(pct ? v * 10 : v) / (pct ? 10 : 1),
      change_percent: Math.round(change * 10) / 10,
      trend: change > 0.5 ? 'up' : change < -0.5 ? 'down' : 'neutral',
    });
  }
  return out;
}

const mode = process.argv[2] ?? 'prep';
const c = await ctx();

if (mode === 'prep') {
  const canvas = (await call(c, 'create_canvas', {
    name: 'Growth Operating Map',
    description:
      'SaaS growth tree — how onboarding work moves activation, usage, and revenue.',
  })) as { id: string };
  writeFileSync(STATE_FILE, JSON.stringify({ canvasId: canvas.id }, null, 2));
  console.log(`[agent] demo canvas ${canvas.id} → ${STATE_FILE}`);
} else if (mode === 'seed') {
  const { canvasId } = JSON.parse(readFileSync(STATE_FILE, 'utf8'));
  const projectId = canvasId;
  const mrr = (await call(c, 'create_value', {
    projectId,
    title: 'MRR',
    description: 'Monthly recurring revenue — the outcome the tree explains.',
  })) as { id: string };
  const wau = (await call(c, 'create_metric', {
    projectId,
    title: 'Weekly Active Users',
    description: 'Accounts with ≥1 core action in the trailing 7 days.',
  })) as { id: string };
  const activation = (await call(c, 'create_metric', {
    projectId,
    title: 'Activation Rate',
    description: 'Share of signups reaching the aha moment within 7 days.',
    formula: 'activated_signups / signups',
  })) as { id: string };
  const signups = (await call(c, 'create_driver_node', {
    projectId,
    title: 'New Signups',
    description: 'Weekly new workspace signups.',
  })) as { id: string };
  const churn = (await call(c, 'create_metric', {
    projectId,
    title: 'Net Revenue Churn',
    description: 'MRR lost to downgrades + cancellations, net of expansion.',
  })) as { id: string };
  const onboarding = (await call(c, 'create_action', {
    projectId,
    title: 'Onboarding revamp',
    description: 'Checklist + templates so new users hit the aha moment faster.',
  })) as { id: string };

  await call(c, 'create_relationship', {
    projectId, sourceId: onboarding.id, targetId: activation.id,
    type: 'Causal', confidence: 'Medium',
  });
  await call(c, 'create_relationship', {
    projectId, sourceId: activation.id, targetId: wau.id,
    type: 'Probabilistic', confidence: 'High',
  });
  await call(c, 'create_relationship', {
    projectId, sourceId: signups.id, targetId: wau.id,
    type: 'Probabilistic', confidence: 'High',
  });
  await call(c, 'create_relationship', {
    projectId, sourceId: wau.id, targetId: mrr.id,
    type: 'Probabilistic', confidence: 'Medium',
  });
  await call(c, 'create_relationship', {
    projectId, sourceId: churn.id, targetId: mrr.id,
    type: 'Deterministic', confidence: 'High',
  });
  await call(c, 'layout_tree', { projectId, direction: 'LR' });
  writeFileSync(
    STATE_FILE,
    JSON.stringify(
      {
        canvasId,
        nodes: {
          mrr: mrr.id, wau: wau.id, activation: activation.id,
          signups: signups.id, churn: churn.id, onboarding: onboarding.id,
        },
      },
      null,
      2
    )
  );
  console.log('[agent] tree built + laid out');
} else if (mode === 'enrich') {
  const { canvasId, nodes } = JSON.parse(readFileSync(STATE_FILE, 'utf8'));
  void canvasId;
  const data: Record<string, MetricValue[]> = {
    mrr: series(84000, 0.021, false),
    wau: series(3100, 0.018, false),
    activation: series(31, 0.012),
    signups: series(410, 0.015, false),
    churn: series(2.4, -0.01),
  };
  for (const [key, s] of Object.entries(data)) {
    await updateMetricCard(nodes[key], { data: s }, c.client);
    console.log(`[agent] ${key}: ${s.length} periods`);
  }
  console.log('[agent] value series attached');
} else if (mode === 'hypothesis') {
  const state = JSON.parse(readFileSync(STATE_FILE, 'utf8'));
  const hyp = (await call(c, 'create_hypothesis', {
    projectId: state.canvasId,
    title: 'Faster time-to-aha lifts activation',
    description:
      'If new users reach the aha moment in their first session, activation rate rises.',
  })) as { id: string };
  await call(c, 'create_relationship', {
    projectId: state.canvasId,
    sourceId: hyp.id,
    targetId: state.nodes.onboarding,
    type: 'Causal',
    confidence: 'Medium',
  });
  await call(c, 'layout_tree', { projectId: state.canvasId, direction: 'LR' });
  state.nodes.hypothesis = hyp.id;
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
  console.log('[agent] hypothesis card added');
} else if (mode === 'impact') {
  const { canvasId, nodes } = JSON.parse(readFileSync(STATE_FILE, 'utf8'));
  const contract = await upsertContract(
    {
      strategyNodeId: nodes.onboarding,
      projectId: canvasId,
      expectedDirection: 'increase',
      expectedDeltaValue: 3,
      expectedDeltaUnit: 'pp',
      baselineStart: '2026-05-04',
      baselineEnd: '2026-05-31',
      measureStart: '2026-06-01',
      measureEnd: '2026-07-05',
      confidence: 'medium',
      impactStatus: 'measuring',
    },
    c.client
  );
  await setMetricLinks(
    contract.id,
    [
      { role: 'target', refSource: 'card', cardId: nodes.activation },
      { role: 'leading', refSource: 'card', cardId: nodes.signups },
      { role: 'guardrail', refSource: 'card', cardId: nodes.churn },
    ],
    c.client
  );
  await c.client
    .from('strategy_impact_contracts')
    .update({ result_note: null })
    .eq('id', contract.id);
  await c.client
    .from('evidence_items')
    .delete()
    .eq('project_id', canvasId)
    .like('title', 'Impact review:%');
  console.log('[agent] impact contract seeded on Onboarding revamp');
} else if (mode === 'clear-evidence') {
  const { canvasId } = JSON.parse(readFileSync(STATE_FILE, 'utf8'));
  const { error } = await c.client
    .from('evidence_items')
    .delete()
    .eq('project_id', canvasId);
  if (error) throw new Error(error.message);
  console.log('[agent] evidence cleared');
} else if (mode === 'ungroup') {
  const { canvasId } = JSON.parse(readFileSync(STATE_FILE, 'utf8'));
  const { error } = await c.client.from('groups').delete().eq('project_id', canvasId);
  if (error) throw new Error(error.message);
  console.log('[agent] groups cleared');
} else if (mode === 'cleanup') {
  const { canvasId } = JSON.parse(readFileSync(STATE_FILE, 'utf8'));
  await call(c, 'delete_canvas', { id: canvasId });
  console.log('[agent] demo canvas deleted');
} else {
  throw new Error(`unknown mode: ${mode}`);
}
