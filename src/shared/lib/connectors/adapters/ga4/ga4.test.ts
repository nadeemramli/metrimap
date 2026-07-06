import { describe, it, expect, vi } from 'vitest';
import type { StreamManifest } from '../../manifests';
import type { FetchPageInput } from '../../runtime';
import { getMapper, normalizeRecords, type NormalizationContext } from '../../normalize';
import { createGa4Adapter } from './adapter';
import { GA4_SCOPE, buildGoogleAuthUrl, exchangeGoogleCode, refreshGoogleToken } from './oauth';

const pageStream: StreamManifest = {
  name: 'page_metrics', display_name: 'Page metrics', canonical_schema: 'page_metric', cursor_field: 'date',
  supported_sync_modes: ['full_refresh', 'incremental'], default_dimensions: ['date', 'pagePath'], default_metrics: ['screenPageViews', 'sessions'],
};
const eventStream: StreamManifest = {
  name: 'events', display_name: 'Events', canonical_schema: 'analytics_event', cursor_field: 'date',
  supported_sync_modes: ['full_refresh', 'incremental'], default_dimensions: ['date', 'eventName'], default_metrics: ['eventCount'],
};

const input = (stream: StreamManifest, over: Partial<FetchPageInput> = {}): FetchPageInput => ({
  stream, syncMode: 'incremental', credentials: { access_token: 'tok' }, signal: new AbortController().signal, ...over,
});

const okFetch = (body: unknown, status = 200) =>
  vi.fn(async () => ({ ok: status < 400, status, json: async () => body }) as unknown as Response);

/** Read a recorded fetch call as [url, init] (vi.fn infers no params, so cast). */
const callOf = (f: ReturnType<typeof okFetch>, i = 0) => f.mock.calls[i] as unknown as [string, RequestInit];

const PAGE_RESPONSE = {
  dimensionHeaders: [{ name: 'date' }, { name: 'pagePath' }],
  metricHeaders: [{ name: 'screenPageViews' }, { name: 'sessions' }],
  rows: [{ dimensionValues: [{ value: '20260701' }, { value: '/pricing' }], metricValues: [{ value: '1240' }, { value: '300' }] }],
  rowCount: 1,
};

describe('GA4 OAuth', () => {
  it('builds a consent URL with offline access + read-only scope', () => {
    const u = buildGoogleAuthUrl({ clientId: 'cid', redirectUri: 'https://app/cb', state: 'st' });
    expect(u).toContain('client_id=cid');
    expect(u).toContain('access_type=offline');
    expect(u).toContain('state=st');
    expect(decodeURIComponent(u)).toContain(GA4_SCOPE);
  });

  it('exchanges a code for tokens', async () => {
    const f = okFetch({ access_token: 'at1', refresh_token: 'rt1', expires_in: 3599, token_type: 'Bearer' });
    const t = await exchangeGoogleCode({ code: 'c', clientId: 'id', clientSecret: 'sec', redirectUri: 'https://app/cb' }, f);
    expect(t).toMatchObject({ accessToken: 'at1', refreshToken: 'rt1', tokenType: 'Bearer' });
    expect(t.expiresAt).toBeTruthy();
    expect(String(callOf(f)[1].body)).toContain('grant_type=authorization_code');
  });

  it('refreshes an access token', async () => {
    const f = okFetch({ access_token: 'at2', expires_in: 3599 });
    const t = await refreshGoogleToken({ refreshToken: 'rt1', clientId: 'id', clientSecret: 'sec' }, f);
    expect(t.accessToken).toBe('at2');
    expect(String(callOf(f)[1].body)).toContain('grant_type=refresh_token');
  });

  it('throws on a token error', async () => {
    await expect(exchangeGoogleCode({ code: 'c', clientId: 'i', clientSecret: 's', redirectUri: 'r' }, okFetch({}, 400))).rejects.toThrow(/token endpoint/);
  });
});

describe('GA4 adapter — fetchPage', () => {
  it('flattens page_metrics into one row per metric', async () => {
    const adapter = createGa4Adapter({ propertyId: 'properties/123', fetchImpl: okFetch(PAGE_RESPONSE) });
    const res = await adapter.fetchPage(input(pageStream));
    expect(res.records).toEqual([
      { date: '20260701', pagePath: '/pricing', metric: 'screenPageViews', value: 1240 },
      { date: '20260701', pagePath: '/pricing', metric: 'sessions', value: 300 },
    ]);
    expect(res.cursor).toBe('20260701');
    expect(res.nextPageToken).toBeUndefined();
  });

  it('flattens events into one row per event', async () => {
    const body = { dimensionHeaders: [{ name: 'date' }, { name: 'eventName' }], metricHeaders: [{ name: 'eventCount' }], rows: [{ dimensionValues: [{ value: '20260701' }, { value: 'sign_up' }], metricValues: [{ value: '42' }] }], rowCount: 1 };
    const adapter = createGa4Adapter({ propertyId: 'properties/1', fetchImpl: okFetch(body) });
    const res = await adapter.fetchPage(input(eventStream));
    expect(res.records).toEqual([{ date: '20260701', eventName: 'sign_up', eventCount: 42 }]);
  });

  it('paginates via offset when more rows remain', async () => {
    const adapter = createGa4Adapter({ propertyId: 'p', pageSize: 1, fetchImpl: okFetch({ ...PAGE_RESPONSE, rowCount: 2 }) });
    const res = await adapter.fetchPage(input(pageStream));
    expect(res.nextPageToken).toBe('1');
  });

  it('classifies a 401 as an auth error (so the runtime surfaces needs_reconnect)', async () => {
    const adapter = createGa4Adapter({ propertyId: 'p', fetchImpl: okFetch({}, 401) });
    await expect(adapter.fetchPage(input(pageStream))).rejects.toMatchObject({ class: 'auth' });
  });

  it('sends the property runReport request with a bearer token', async () => {
    const f = okFetch(PAGE_RESPONSE);
    await createGa4Adapter({ propertyId: 'properties/999', fetchImpl: f }).fetchPage(input(pageStream));
    const [url, init] = callOf(f);
    expect(url).toBe('https://analyticsdata.googleapis.com/v1beta/properties/999:runReport');
    expect((init.headers as Record<string, string>).authorization).toBe('Bearer tok');
  });
});

describe('GA4 adapter → CVS-143 mapper → canonical (end-to-end)', () => {
  it('adapter rows normalize into valid page_metric records', async () => {
    const adapter = createGa4Adapter({ propertyId: 'p', fetchImpl: okFetch(PAGE_RESPONSE) });
    const { records } = await adapter.fetchPage(input(pageStream));
    const mapper = getMapper('ga4', 'page_metrics');
    expect(mapper).toBeDefined();
    const ctx: NormalizationContext = { source: 'ga4', sourceAccountId: 'properties/123', workspaceId: 'ws', connectorVersion: 'ga4@1.0.0', observedAt: '2026-07-02T00:00:00Z' };
    const report = normalizeRecords(records, mapper!, ctx);
    expect(report.rejectedCount).toBe(0);
    expect(report.accepted.map((r) => r.schema)).toEqual(['page_metric', 'page_metric']);
    if (report.accepted[0].schema === 'page_metric') expect(report.accepted[0].attributes.value).toBe(1240);
  });
});
