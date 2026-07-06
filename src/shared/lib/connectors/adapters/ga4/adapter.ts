// GA4 Data API adapter (CVS-146). Implements the CVS-142 ConnectorAdapter: fetches one
// page of a GA4 `runReport` and flattens rows into the shape the CVS-143 GA4 mappers
// expect. Credentials (access token) are injected per-run by the runtime — the adapter
// never reads secrets. Property id + report window are bound at creation from the
// connection. `fetchImpl` is injectable for tests.
import {
  ConnectorFetchError,
  type ConnectorAdapter,
  type ConnectorErrorClass,
  type FetchPageInput,
  type FetchPageResult,
} from '../../runtime';

const GA4_API = 'https://analyticsdata.googleapis.com/v1beta';
const DEFAULT_PAGE_SIZE = 10_000;
const DEFAULT_LOOKBACK_DAYS = 90;

interface HeaderName {
  name: string;
}
interface GaValue {
  value: string;
}
interface GaRow {
  dimensionValues?: GaValue[];
  metricValues?: GaValue[];
}
interface RunReportResponse {
  dimensionHeaders?: HeaderName[];
  metricHeaders?: HeaderName[];
  rows?: GaRow[];
  rowCount?: number;
}

function classifyHttp(status: number): ConnectorErrorClass {
  if (status === 401 || status === 403) return 'auth';
  if (status === 429) return 'rate_limit';
  if (status === 408) return 'timeout';
  if (status >= 500) return 'transient';
  return 'permanent';
}

/** `20260701` (GA4 cursor) → `2026-07-01` for the runReport dateRange. */
function toDateRange(cursor: string): string {
  return cursor.length === 8 ? `${cursor.slice(0, 4)}-${cursor.slice(4, 6)}-${cursor.slice(6, 8)}` : cursor;
}

/** Flatten GA4 rows into the flat objects the CVS-143 mappers consume (one row per metric
 *  for the page_metrics stream; one row per event for the events stream). */
function flatten(streamName: string, res: RunReportResponse): unknown[] {
  const dimHeaders = res.dimensionHeaders ?? [];
  const metricHeaders = res.metricHeaders ?? [];
  const out: unknown[] = [];
  for (const row of res.rows ?? []) {
    const dims: Record<string, string> = {};
    dimHeaders.forEach((h, i) => (dims[h.name] = row.dimensionValues?.[i]?.value ?? ''));
    if (streamName === 'events') {
      const idx = Math.max(0, metricHeaders.findIndex((h) => h.name === 'eventCount'));
      out.push({ date: dims.date, eventName: dims.eventName, eventCount: Number(row.metricValues?.[idx]?.value ?? 0) });
    } else {
      metricHeaders.forEach((h, i) =>
        out.push({ date: dims.date, pagePath: dims.pagePath, metric: h.name, value: Number(row.metricValues?.[i]?.value ?? 0) })
      );
    }
  }
  return out;
}

/** Highest `date` dimension seen this page → the incremental cursor for the next run. */
function maxDate(res: RunReportResponse): string | undefined {
  const dateIdx = (res.dimensionHeaders ?? []).findIndex((h) => h.name === 'date');
  if (dateIdx < 0) return undefined;
  let max: string | undefined;
  for (const row of res.rows ?? []) {
    const v = row.dimensionValues?.[dateIdx]?.value;
    if (v && (!max || v > max)) max = v;
  }
  return max;
}

export interface Ga4AdapterOptions {
  propertyId: string; // GA4 property id (from the connection's source_account_id)
  pageSize?: number;
  lookbackDays?: number;
  fetchImpl?: typeof fetch;
}

/** Create a GA4 ConnectorAdapter for one connected property. */
export function createGa4Adapter(opts: Ga4AdapterOptions): ConnectorAdapter {
  const pageSize = opts.pageSize ?? DEFAULT_PAGE_SIZE;
  const lookbackDays = opts.lookbackDays ?? DEFAULT_LOOKBACK_DAYS;
  const doFetch = opts.fetchImpl ?? fetch;

  return {
    connectorId: 'ga4',
    async fetchPage(input: FetchPageInput): Promise<FetchPageResult> {
      const dims = input.stream.default_dimensions ?? (input.stream.name === 'events' ? ['date', 'eventName'] : ['date', 'pagePath']);
      const metrics = input.stream.default_metrics ?? (input.stream.name === 'events' ? ['eventCount'] : ['screenPageViews', 'sessions']);
      const offset = input.pageToken ? Number(input.pageToken) : 0;
      const startDate = input.syncMode === 'incremental' && input.cursor ? toDateRange(input.cursor) : `${lookbackDays}daysAgo`;

      const body = {
        dateRanges: [{ startDate, endDate: 'today' }],
        dimensions: dims.map((name) => ({ name })),
        metrics: metrics.map((name) => ({ name })),
        limit: pageSize,
        offset,
        orderBys: [{ dimension: { dimensionName: 'date' } }],
        keepEmptyRows: false,
      };

      const propPath = opts.propertyId.startsWith('properties/') ? opts.propertyId : `properties/${opts.propertyId}`;
      const res = await doFetch(`${GA4_API}/${propPath}:runReport`, {
        method: 'POST',
        headers: { authorization: `Bearer ${input.credentials.access_token ?? ''}`, 'content-type': 'application/json' },
        body: JSON.stringify(body),
        signal: input.signal,
      });
      if (!res.ok) throw new ConnectorFetchError(classifyHttp(res.status), `GA4 runReport failed (${res.status})`);

      const json = (await res.json()) as RunReportResponse;
      const records = flatten(input.stream.name, json);
      const rowCount = json.rowCount ?? json.rows?.length ?? 0;
      const nextOffset = offset + pageSize;
      return {
        records,
        nextPageToken: nextOffset < rowCount ? String(nextOffset) : undefined,
        cursor: maxDate(json) ?? input.cursor,
      };
    },
  };
}
