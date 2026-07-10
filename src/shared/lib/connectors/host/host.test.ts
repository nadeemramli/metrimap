// Run host tests (CVS-320): the composed pipeline over a fake Supabase client —
// secrets (real AES-GCM) → GA4 adapter (mock fetch) → normalize → bind → metric_values,
// plus cursor persistence across runs, token refresh, auth failure, and preview mode.
import { describe, it, expect, vi } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/shared/lib/supabase/types';
import { storeAccountSecret } from '../connections/secrets';
import { cursorKeyFor } from '../runtime';
import { parseRecipe } from './bindings';
import { SupabaseCursorStore } from './cursorStore';
import { resolveCredentials } from './credentials';
import { runConnectorStream } from './runConnector';

const SECRET_KEY = btoa(String.fromCharCode(...new Array(32).fill(7)));

// --- minimal fake Supabase client (tables in memory, thenable builders) ------------
type Row = Record<string, unknown>;

class FakeQuery {
  private filters: [string, unknown][] = [];
  private op: 'select' | 'insert' | 'upsert' | 'update' | 'delete' = 'select';
  private payload: unknown;
  private conflictKeys: string[] = [];

  constructor(
    private readonly tables: Record<string, Row[]>,
    private readonly table: string
  ) {}

  select(): this { return this; }
  eq(col: string, val: unknown): this { this.filters.push([col, val]); return this; }
  in(): this { return this; }
  order(): this { return this; }
  limit(): this { return this; }
  insert(rows: unknown): this { this.op = 'insert'; this.payload = rows; return this; }
  update(patch: unknown): this { this.op = 'update'; this.payload = patch; return this; }
  delete(): this { this.op = 'delete'; return this; }
  upsert(rows: unknown, opts?: { onConflict?: string }): this {
    this.op = 'upsert';
    this.payload = rows;
    this.conflictKeys = (opts?.onConflict ?? '').split(',').filter(Boolean);
    return this;
  }

  private matching(): Row[] {
    return this.tables[this.table].filter((r) => this.filters.every(([c, v]) => r[c] === v));
  }

  private exec(): { data: Row[] | null; error: null } {
    const rows = this.tables[this.table];
    if (this.op === 'select') return { data: this.matching(), error: null };
    if (this.op === 'insert') {
      const arr = Array.isArray(this.payload) ? this.payload : [this.payload];
      rows.push(...arr.map((r) => ({ ...(r as Row) })));
      return { data: null, error: null };
    }
    if (this.op === 'upsert') {
      const arr = Array.isArray(this.payload) ? this.payload : [this.payload];
      for (const raw of arr) {
        const row = raw as Row;
        const idx = this.conflictKeys.length
          ? rows.findIndex((r) => this.conflictKeys.every((k) => r[k] === row[k]))
          : -1;
        if (idx >= 0) rows[idx] = { ...rows[idx], ...row };
        else rows.push({ ...row });
      }
      return { data: null, error: null };
    }
    if (this.op === 'update') {
      for (const r of this.matching()) Object.assign(r, this.payload as Row);
      return { data: null, error: null };
    }
    // delete
    this.tables[this.table] = rows.filter((r) => !this.filters.every(([c, v]) => r[c] === v));
    return { data: null, error: null };
  }

  maybeSingle(): Promise<{ data: Row | null; error: null }> {
    const { data } = this.exec();
    return Promise.resolve({ data: data?.[0] ?? null, error: null });
  }
  single(): Promise<{ data: Row | null; error: null }> { return this.maybeSingle(); }
  then<T>(res: (v: { data: Row[] | null; error: null }) => T, rej?: (e: unknown) => T): Promise<T> {
    return Promise.resolve(this.exec()).then(res, rej);
  }
}

function fakeDb(): { client: SupabaseClient<Database>; tables: Record<string, Row[]> } {
  const tables: Record<string, Row[]> = {
    connected_accounts: [],
    connected_account_secrets: [],
    connector_cursors: [],
    metric_bindings: [],
    metric_values: [],
    connector_runs: [],
  };
  const client = { from: (table: string) => new FakeQuery(tables, table) } as unknown as SupabaseClient<Database>;
  return { client, tables };
}

// --- fixtures -----------------------------------------------------------------------
const ACCOUNT = {
  id: 'acc-1',
  created_by: 'user_1',
  workspace_id: 'org_1',
  connector_id: 'ga4',
  auth_type: 'oauth2',
  source_account_id: 'properties/123',
  source_account_label: 'Metrimap GA4',
  granted_scopes: [],
  status: 'connected',
  status_detail: null,
  last_synced_at: null,
  last_query_at: null,
  revoked_at: null,
  created_at: '2026-07-01T00:00:00.000Z',
  updated_at: '2026-07-01T00:00:00.000Z',
};

const BINDING_ROW = {
  id: 'bind-1',
  created_by: 'user_1',
  workspace_id: 'org_1',
  connected_account_id: 'acc-1',
  connector_id: 'ga4',
  stream: 'page_metrics',
  canonical_schema: 'page_metric',
  recipe: { aggregation: 'sum', grain: 'day', field: 'attributes.value', filter: { path: 'attributes.metric', equals: 'screenPageViews' } },
  tracked_metric_id: 'tm-1',
  enabled: true,
};

const GA4_RESPONSE = {
  dimensionHeaders: [{ name: 'date' }, { name: 'pagePath' }],
  metricHeaders: [{ name: 'screenPageViews' }, { name: 'sessions' }],
  rows: [
    { dimensionValues: [{ value: '20260701' }, { value: '/pricing' }], metricValues: [{ value: '1240' }, { value: '300' }] },
    { dimensionValues: [{ value: '20260702' }, { value: '/pricing' }], metricValues: [{ value: '900' }, { value: '210' }] },
  ],
  rowCount: 2,
};

const TOKENS = { access_token: 'fresh-at', expires_in: 3599, token_type: 'Bearer' };

/** Routes Google token refreshes and GA4 runReport calls; records GA4 request bodies. */
function routedFetch(opts: { tokenStatus?: number } = {}) {
  const ga4Bodies: Record<string, unknown>[] = [];
  const impl = vi.fn(async (url: unknown, init?: RequestInit) => {
    const u = String(url);
    if (u.includes('oauth2.googleapis.com')) {
      const status = opts.tokenStatus ?? 200;
      return { ok: status < 400, status, json: async () => TOKENS } as unknown as Response;
    }
    ga4Bodies.push(JSON.parse(String(init?.body ?? '{}')));
    return { ok: true, status: 200, json: async () => GA4_RESPONSE } as unknown as Response;
  });
  return { impl: impl as unknown as typeof fetch, ga4Bodies };
}

async function seedAccount(
  client: SupabaseClient<Database>,
  tables: Record<string, Row[]>,
  secret: { accessToken?: string; refreshToken?: string; apiKey?: string; expiresAt?: string | null }
) {
  tables.connected_accounts.push({ ...ACCOUNT });
  await storeAccountSecret(client, ACCOUNT.id, secret, SECRET_KEY);
  tables.connected_accounts[0].status = 'connected'; // storeAccountSecret flips it anyway
}

const FUTURE = new Date(Date.now() + 3600_000).toISOString();
const PAST = new Date(Date.now() - 3600_000).toISOString();

// --- tests ---------------------------------------------------------------------------
describe('parseRecipe', () => {
  it('parses a full recipe and rejects malformed ones', () => {
    expect(parseRecipe(BINDING_ROW.recipe)).toEqual(BINDING_ROW.recipe);
    expect(parseRecipe({ aggregation: 'sum' })).toBeUndefined();
    expect(parseRecipe({ aggregation: 'max', grain: 'day' })).toBeUndefined();
    expect(parseRecipe(null)).toBeUndefined();
    expect(parseRecipe({ aggregation: 'count', grain: 'week' })).toEqual({ aggregation: 'count', grain: 'week' });
  });
});

describe('SupabaseCursorStore', () => {
  it('round-trips a cursor keyed by account+stream', async () => {
    const { client, tables } = fakeDb();
    const store = new SupabaseCursorStore(client, { workspaceId: 'org_1', createdBy: 'user_1' });
    const key = cursorKeyFor('acc-1', 'ga4', 'page_metrics');
    expect(await store.read(key)).toBeUndefined();
    await store.write(key, '20260702');
    expect(await store.read(key)).toBe('20260702');
    await store.write(key, '20260703'); // upsert replaces
    expect(tables.connector_cursors).toHaveLength(1);
    expect(tables.connector_cursors[0]).toMatchObject({ cursor: '20260703', workspace_id: 'org_1' });
  });
});

describe('resolveCredentials', () => {
  it('returns an api_key credential without refreshing', async () => {
    const { client, tables } = fakeDb();
    await seedAccount(client, tables, { apiKey: 'sk-live-x', expiresAt: null });
    const creds = await resolveCredentials(client, {
      accountId: ACCOUNT.id, connectorId: 'ga4', secretKey: SECRET_KEY, env: {},
    });
    expect(creds).toEqual({ api_key: 'sk-live-x' });
  });

  it('refreshes an expiring OAuth token, persists the rotation, and logs the event', async () => {
    const { client, tables } = fakeDb();
    await seedAccount(client, tables, { accessToken: 'old-at', refreshToken: 'rt-1', expiresAt: PAST });
    const { impl } = routedFetch();
    const creds = await resolveCredentials(client, {
      accountId: ACCOUNT.id, connectorId: 'ga4', secretKey: SECRET_KEY,
      env: { googleClientId: 'cid', googleClientSecret: 'sec' }, fetchImpl: impl,
    });
    expect(creds).toEqual({ access_token: 'fresh-at' });
    expect(tables.connector_runs.some((r) => r.event === 'connection_refreshed')).toBe(true);
    // rotated token was persisted (encrypted — decrypt via another resolve, no refresh now)
    const again = await resolveCredentials(client, {
      accountId: ACCOUNT.id, connectorId: 'ga4', secretKey: SECRET_KEY, env: {},
    });
    expect(again).toEqual({ access_token: 'fresh-at' });
  });

  it('marks the connection error + records auth_failed when refresh fails', async () => {
    const { client, tables } = fakeDb();
    await seedAccount(client, tables, { accessToken: 'old-at', refreshToken: 'rt-1', expiresAt: PAST });
    const { impl } = routedFetch({ tokenStatus: 500 });
    await expect(
      resolveCredentials(client, {
        accountId: ACCOUNT.id, connectorId: 'ga4', secretKey: SECRET_KEY,
        env: { googleClientId: 'cid', googleClientSecret: 'sec' }, fetchImpl: impl,
      })
    ).rejects.toThrow(/refresh failed/);
    expect(tables.connected_accounts[0].status).toBe('error');
    expect(tables.connector_runs.some((r) => r.event === 'auth_failed')).toBe(true);
  });
});

describe('runConnectorStream (full pipeline)', () => {
  it('fetches, normalizes, binds, and persists metric values + cursor + audit row', async () => {
    const { client, tables } = fakeDb();
    await seedAccount(client, tables, { accessToken: 'at', expiresAt: FUTURE });
    tables.metric_bindings.push({ ...BINDING_ROW });
    const { impl } = routedFetch();

    const summary = await runConnectorStream(
      { service: client, secretKey: SECRET_KEY, fetchImpl: impl },
      { accountId: ACCOUNT.id, stream: 'page_metrics' }
    );

    expect(summary.ok).toBe(true);
    expect(summary.bindingsApplied).toBe(1);
    expect(summary.materialized).toBe(2);
    expect(tables.metric_values).toEqual([
      expect.objectContaining({ tracked_metric_id: 'tm-1', period: '2026-07-01', value: 1240 }),
      expect.objectContaining({ tracked_metric_id: 'tm-1', period: '2026-07-02', value: 900 }),
    ]);
    expect(String(tables.metric_values[0].source)).toContain('connector=ga4');
    expect(tables.connector_cursors[0]).toMatchObject({ connected_account_id: 'acc-1', stream: 'page_metrics', cursor: '20260702' });
    expect(tables.connector_runs.some((r) => r.event === 'run_finished' && r.materialized === 2)).toBe(true);
    expect(tables.connected_accounts[0].last_synced_at).toBeTruthy();
  });

  it('resumes from the persisted cursor and stays idempotent on re-run', async () => {
    const { client, tables } = fakeDb();
    await seedAccount(client, tables, { accessToken: 'at', expiresAt: FUTURE });
    tables.metric_bindings.push({ ...BINDING_ROW });
    const { impl, ga4Bodies } = routedFetch();

    const deps = { service: client, secretKey: SECRET_KEY, fetchImpl: impl };
    await runConnectorStream(deps, { accountId: ACCOUNT.id, stream: 'page_metrics' });
    await runConnectorStream(deps, { accountId: ACCOUNT.id, stream: 'page_metrics' });

    expect(ga4Bodies[0].dateRanges).toEqual([{ startDate: '90daysAgo', endDate: 'today' }]);
    expect(ga4Bodies[1].dateRanges).toEqual([{ startDate: '2026-07-02', endDate: 'today' }]); // resumed
    expect(tables.metric_values).toHaveLength(2); // upsert by (metric, period) — no duplicates
    expect(tables.connector_cursors).toHaveLength(1);
  });

  it('preview mode returns a sample and persists nothing', async () => {
    const { client, tables } = fakeDb();
    await seedAccount(client, tables, { accessToken: 'at', expiresAt: FUTURE });
    tables.metric_bindings.push({ ...BINDING_ROW });
    const { impl } = routedFetch();

    const summary = await runConnectorStream(
      { service: client, secretKey: SECRET_KEY, fetchImpl: impl },
      { accountId: ACCOUNT.id, stream: 'page_metrics', preview: true, maxRecords: 3 }
    );

    expect(summary.ok).toBe(true);
    expect(summary.sample).toHaveLength(3); // capped fetch, normalized in memory
    expect(summary.sample?.[0]).toMatchObject({ schema: 'page_metric', source: 'ga4' });
    expect(tables.metric_values).toHaveLength(0);
    expect(tables.connector_cursors).toHaveLength(0);
    expect(tables.connector_runs.filter((r) => r.event === 'run_finished')).toHaveLength(0);
  });

  it('surfaces auth failure as a payload-free summary and marks the connection', async () => {
    const { client, tables } = fakeDb();
    await seedAccount(client, tables, { accessToken: 'old', refreshToken: 'rt', expiresAt: PAST });
    const { impl } = routedFetch({ tokenStatus: 401 });

    const summary = await runConnectorStream(
      { service: client, secretKey: SECRET_KEY, env: { googleClientId: 'cid', googleClientSecret: 'sec' }, fetchImpl: impl },
      { accountId: ACCOUNT.id, stream: 'page_metrics' }
    );

    expect(summary.ok).toBe(false);
    expect(summary.errorClass).toBe('auth');
    expect(summary.error).not.toContain('old'); // never echoes token material
    expect(tables.connected_accounts[0].status).toBe('error');
    expect(tables.metric_values).toHaveLength(0);
  });

  it('rejects unknown streams and unregistered connectors with readable errors', async () => {
    const { client, tables } = fakeDb();
    await seedAccount(client, tables, { accessToken: 'at', expiresAt: FUTURE });
    const bad = await runConnectorStream(
      { service: client, secretKey: SECRET_KEY },
      { accountId: ACCOUNT.id, stream: 'nope' }
    );
    expect(bad.ok).toBe(false);
    expect(bad.error).toMatch(/no stream 'nope'/);

    tables.connected_accounts[0].connector_id = 'not-a-connector';
    const worse = await runConnectorStream(
      { service: client, secretKey: SECRET_KEY },
      { accountId: ACCOUNT.id, stream: 'page_metrics' }
    );
    expect(worse.error).toMatch(/unknown connector/);
  });
});
