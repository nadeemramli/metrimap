// GA4 source mappers (CVS-143).
//
// GA4 Data API report rows arrive already flattened into date + dimensions + a metric
// value. Page rows become `page_metric`; event rows become `analytics_event`. The source
// object id is synthesized from the row's identifying dimensions so re-fetched rows dedupe.
import type { CanonicalDraft, SourceMapper } from '../types';
import { asObject, optNum, optStr, toIso } from './util';
import { MappingError } from '../types';

/** GA4 page report row → canonical `page_metric`. */
export const ga4PageMetric: SourceMapper = (input): CanonicalDraft[] => {
  const obj = asObject(input, 'page_metric');
  const date = optStr(obj, 'date');
  const pagePath = optStr(obj, 'pagePath');
  const metric = optStr(obj, 'metric');
  if (!date || !pagePath || !metric) {
    throw new MappingError('missing_source_id', 'GA4 page row needs date, pagePath, and metric', { schema: 'page_metric' });
  }
  return [
    {
      schema: 'page_metric',
      source_object_id: `ga4:${date}:${pagePath}:${metric}`,
      occurred_at: toIso(date, 'date', 'page_metric'),
      attributes: {
        page_path: pagePath,
        metric,
        value: optNum(obj, 'value'),
        dimensions: obj.dimensions,
      },
    },
  ];
};

/** GA4 event report row → canonical `analytics_event`. */
export const ga4Event: SourceMapper = (input): CanonicalDraft[] => {
  const obj = asObject(input, 'analytics_event');
  const date = optStr(obj, 'date');
  const eventName = optStr(obj, 'eventName');
  if (!date || !eventName) {
    throw new MappingError('missing_source_id', 'GA4 event row needs date and eventName', { schema: 'analytics_event' });
  }
  return [
    {
      schema: 'analytics_event',
      source_object_id: `ga4:${date}:${eventName}`,
      occurred_at: toIso(date, 'date', 'analytics_event'),
      attributes: {
        event_name: eventName,
        count: optNum(obj, 'eventCount') ?? 1,
        properties: obj.dimensions,
      },
    },
  ];
};

export const GA4_MAPPERS = { page_metrics: ga4PageMetric, events: ga4Event };
