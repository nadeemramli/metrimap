// GA4 Data API → canonical (CVS-143). Rows are pre-shaped by the connector adapter
// (CVS-146) into these flat objects before normalization.
import { ga4DateToIso } from '../dates';
import type { CanonicalDraft, Mapper } from '../types';

interface Ga4PageRow {
  date: string; // YYYYMMDD
  pagePath: string;
  metric: string; // e.g. 'screenPageViews'
  value: number;
  country?: string;
}

interface Ga4EventRow {
  date: string; // YYYYMMDD
  eventName: string;
  eventCount: number;
}

export const mapGa4PageMetric: Mapper = (raw): CanonicalDraft[] => {
  const r = raw as Ga4PageRow;
  return [
    {
      schema: 'page_metric',
      source_object_id: `${r.date}:${r.pagePath}:${r.metric}`,
      occurred_at: ga4DateToIso(r.date),
      attributes: {
        page_path: r.pagePath,
        metric: r.metric,
        value: r.value,
        dimensions: r.country ? { country: r.country } : undefined,
      },
    },
  ];
};

export const mapGa4Event: Mapper = (raw): CanonicalDraft[] => {
  const e = raw as Ga4EventRow;
  return [
    {
      schema: 'analytics_event',
      source_object_id: `${e.date}:${e.eventName}`,
      occurred_at: ga4DateToIso(e.date),
      attributes: { event_name: e.eventName, count: e.eventCount },
    },
  ];
};
