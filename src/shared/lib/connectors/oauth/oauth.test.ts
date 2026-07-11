// OAuth connect flow tests (CVS-322): signed-state integrity, the Google/GA4
// provider module, and the start → callback → sources flow over a fake Supabase
// client with real AES-GCM secret storage.
import { describe, it, expect, vi } from 'vitest';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/shared/lib/supabase/types';
import { readAccountSecret, storeAccountSecret } from '../connections/secrets';
import { completeCallback, listSources, startConnect } from './flow';
import { OAUTH_PROVIDERS } from './providers';
import { signState, verifyState } from './state';

const KEY = btoa(String.fromCharCode(...new Array(32).fill(7)));
const OTHER_KEY = btoa(String.fromCharCode(...new Array(32).fill(9)));

// --- minimal fake Supabase client ----------------------------------------------------
type Row = Record<string, unknown>;

class FakeQuery {
  private filters: [string, unknown][] = [];
  private op: 'select' | 'insert' | 'upsert' | 'update' | 'delete' = 'select';
  private payload: unknown;
  private conflictKeys: string[] = [];

  constructor(private readonly tables: Record<string, Row[]>, private readonly table: string) {}

  select(): this { return this; }
  eq(col: string, val: unknown): this { this.filters.push([col, val]); return this; }
  insert(rows: unknown): this { this.op = 'insert'; this.payload = rows; return this; }
  update(patch: unknown): this { this.op = 'update'; this.payload = patch; return this; }
  delete(): this { this.op = 'delete'; return this; }
  upsert(rows: unknown, opts?: { onConflict?: string }): this {
    this.op = 'upsert'; this.payload = rows;
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

function fakeDb() {
  const tables: Record<string, Row[]> = {
    connected_accounts: [],
    connected_account_secrets: [],
    connector_runs: [],
  };
  const client = { from: (t: string) => new FakeQuery(tables, t) } as unknown as SupabaseClient<Database>;
  return { client, tables };
}

const ACCOUNT: Row = {
  id: 'acc-1', created_by: 'user_1', workspace_id: 'org_1', connector_id: 'ga4',
  auth_type: 'oauth2', source_account_id: null, source_account_label: null,
  granted_scopes: [], status: 'pending', status_detail: null,
};

const SUMMARIES = {
  accountSummaries: [
    { displayName: 'Canvasm', propertySummaries: [{ property: 'properties/123', displayName: 'use.canvasm.app' }] },
  ],
};

/** Routes Google token + Admin API calls. */
function googleFetch(opts: { tokenStatus?: number; summaries?: unknown } = {}) {
  return vi.fn(async (url: unknown) => {
    const u = String(url);
    if (u.includes('oauth2.googleapis.com')) {
      const status = opts.tokenStatus ?? 200;
      return {
        ok: status < 400, status,
        json: async () => ({ access_token: 'at-1', refresh_token: 'rt-1', expires_in: 3599, token_type: 'Bearer' }),
      } as unknown as Response;
    }
    return { ok: true, status: 200, json: async () => opts.summaries ?? SUMMARIES } as unknown as Response;
  }) as unknown as typeof fetch;
}

const flowDeps = (client: SupabaseClient<Database>, fetchImpl?: typeof fetch) => ({
  service: client,
  secretKey: KEY,
  getEnv: (k: string) =>
    ({ GOOGLE_OAUTH_CLIENT_ID: 'cid', GOOGLE_OAUTH_CLIENT_SECRET: 'sec' })[k],
  redirectUri: 'https://ref.functions.supabase.co/connector-oauth/callback',
  fetchImpl,
});

// --- tests ---------------------------------------------------------------------------
describe('signed state', () => {
  it('round-trips a valid token', async () => {
    const token = await signState({ accountId: 'acc-1', connectorId: 'ga4' }, KEY);
    const state = await verifyState(token, KEY);
    expect(state).toMatchObject({ accountId: 'acc-1', connectorId: 'ga4' });
    expect(state!.nonce).toBeTruthy();
  });

  it('rejects tampering, wrong keys, expiry, and garbage', async () => {
    const token = await signState({ accountId: 'acc-1', connectorId: 'ga4' }, KEY);
    const [body, sig] = token.split('.');
    expect(await verifyState(`${body}x.${sig}`, KEY)).toBeNull(); // body tampered
    expect(await verifyState(`${body}.${sig.slice(0, -2)}aa`, KEY)).toBeNull(); // sig tampered
    expect(await verifyState(token, OTHER_KEY)).toBeNull(); // wrong key
    expect(await verifyState('garbage', KEY)).toBeNull();
    const expired = await signState({ accountId: 'a', connectorId: 'ga4' }, KEY, 10, Date.now() - 60_000);
    expect(await verifyState(expired, KEY)).toBeNull();
  });
});

describe('Google/GA4 provider', () => {
  const google = OAUTH_PROVIDERS.ga4;

  it('builds a consent URL carrying the signed state', () => {
    const url = google.authUrl({ env: { clientId: 'cid', clientSecret: 'sec' }, redirectUri: 'https://r/cb', state: 'st-1' });
    expect(url).toContain('client_id=cid');
    expect(url).toContain('state=st-1');
    expect(url).toContain('access_type=offline');
  });

  it('throws a readable error when client credentials are missing', () => {
    expect(() => google.authUrl({ env: {}, redirectUri: 'r', state: 's' })).toThrow(/not configured/);
  });

  it('lists GA4 properties across pages', async () => {
    const page2 = { accountSummaries: [{ displayName: 'B', propertySummaries: [{ property: 'properties/456', displayName: 'Two' }] }] };
    let calls = 0;
    const f = vi.fn(async () => ({
      ok: true, status: 200,
      json: async () => (calls++ === 0 ? { ...SUMMARIES, nextPageToken: 'p2' } : page2),
    })) as unknown as typeof fetch;
    const sources = await google.listSourceAccounts!('at', f);
    expect(sources).toEqual([
      { id: 'properties/123', label: 'Canvasm / use.canvasm.app' },
      { id: 'properties/456', label: 'B / Two' },
    ]);
  });
});

describe('startConnect', () => {
  it('returns the consent URL for a pending OAuth account', async () => {
    const { client, tables } = fakeDb();
    tables.connected_accounts.push({ ...ACCOUNT });
    const res = await startConnect(flowDeps(client), { accountId: 'acc-1' });
    expect(res.ok).toBe(true);
    if (res.ok) {
      expect(res.url).toContain('accounts.google.com');
      const state = new URL(res.url).searchParams.get('state')!;
      expect(await verifyState(state, KEY)).toMatchObject({ accountId: 'acc-1' });
    }
  });

  it('rejects non-OAuth, revoked, and unknown-provider accounts', async () => {
    const { client, tables } = fakeDb();
    tables.connected_accounts.push({ ...ACCOUNT, auth_type: 'api_key' });
    expect((await startConnect(flowDeps(client), { accountId: 'acc-1' })).ok).toBe(false);
    tables.connected_accounts[0] = { ...ACCOUNT, status: 'revoked' };
    expect((await startConnect(flowDeps(client), { accountId: 'acc-1' })).ok).toBe(false);
    tables.connected_accounts[0] = { ...ACCOUNT, connector_id: 'stripe' };
    const res = await startConnect(flowDeps(client), { accountId: 'acc-1' });
    expect(res).toMatchObject({ ok: false, error: expect.stringContaining('no OAuth provider') });
  });
});

describe('completeCallback', () => {
  it('exchanges the code, stores encrypted tokens, flips to connected, auto-binds the single property', async () => {
    const { client, tables } = fakeDb();
    tables.connected_accounts.push({ ...ACCOUNT });
    const state = await signState({ accountId: 'acc-1', connectorId: 'ga4' }, KEY);

    const res = await completeCallback(flowDeps(client, googleFetch()), { code: 'c-1', state });
    expect(res).toMatchObject({ ok: true, accountId: 'acc-1', connectorId: 'ga4' });

    const account = tables.connected_accounts[0];
    expect(account.status).toBe('connected');
    expect(account.source_account_id).toBe('properties/123'); // exactly one property → auto-bound
    expect(tables.connector_runs.some((r) => r.event === 'connection_connected')).toBe(true);

    const secret = await readAccountSecret(client, 'acc-1', KEY);
    expect(secret).toMatchObject({ accessToken: 'at-1', refreshToken: 'rt-1' });
    // ciphertext at rest — the stored row never contains the raw token
    expect(String(tables.connected_account_secrets[0].access_token)).not.toContain('at-1');
  });

  it('leaves source_account_id unbound when multiple properties exist', async () => {
    const { client, tables } = fakeDb();
    tables.connected_accounts.push({ ...ACCOUNT });
    const state = await signState({ accountId: 'acc-1', connectorId: 'ga4' }, KEY);
    const many = {
      accountSummaries: [{ propertySummaries: [{ property: 'properties/1' }, { property: 'properties/2' }] }],
    };
    await completeCallback(flowDeps(client, googleFetch({ summaries: many })), { code: 'c', state });
    expect(tables.connected_accounts[0].source_account_id).toBeNull();
    expect(tables.connected_accounts[0].status).toBe('connected');
  });

  it('rejects an invalid state without touching the account', async () => {
    const { client, tables } = fakeDb();
    tables.connected_accounts.push({ ...ACCOUNT });
    const res = await completeCallback(flowDeps(client, googleFetch()), { code: 'c', state: 'forged.token' });
    expect(res).toMatchObject({ ok: false, error: expect.stringContaining('state') });
    expect(tables.connected_accounts[0].status).toBe('pending');
  });

  it('marks the connection error (payload-free) when the exchange fails', async () => {
    const { client, tables } = fakeDb();
    tables.connected_accounts.push({ ...ACCOUNT });
    const state = await signState({ accountId: 'acc-1', connectorId: 'ga4' }, KEY);
    const res = await completeCallback(flowDeps(client, googleFetch({ tokenStatus: 500 })), { code: 'c', state });
    expect(res.ok).toBe(false);
    expect(tables.connected_accounts[0].status).toBe('error');
    expect(tables.connector_runs.some((r) => r.event === 'auth_failed')).toBe(true);
    expect(tables.connected_account_secrets).toHaveLength(0);
  });
});

describe('listSources', () => {
  it('lists with a valid token and refreshes an expired one first', async () => {
    const { client, tables } = fakeDb();
    tables.connected_accounts.push({ ...ACCOUNT, status: 'connected' });
    await storeAccountSecret(client, 'acc-1', {
      accessToken: 'stale', refreshToken: 'rt-0', expiresAt: new Date(Date.now() - 1000).toISOString(),
    }, KEY);

    const res = await listSources(flowDeps(client, googleFetch()), { accountId: 'acc-1' });
    expect(res).toMatchObject({ ok: true, sources: [{ id: 'properties/123' }] });
    // refreshed token was persisted
    const secret = await readAccountSecret(client, 'acc-1', KEY);
    expect(secret?.accessToken).toBe('at-1');
  });

  it('fails readable when no credential is stored', async () => {
    const { client, tables } = fakeDb();
    tables.connected_accounts.push({ ...ACCOUNT });
    const res = await listSources(flowDeps(client, googleFetch()), { accountId: 'acc-1' });
    expect(res).toMatchObject({ ok: false, error: expect.stringContaining('connect first') });
  });
});
