// PostHog source mappers (CVS-143).
//
// PostHog events map directly to `analytics_event`; the event's uuid is the source id and
// its `properties` bag carries through into canonical attributes.
import type { CanonicalDraft, SourceMapper } from '../types';
import { asObject, optNum, optStr, requireId, toIso } from './util';

/** PostHog event → canonical `analytics_event`. */
export const posthogEvent: SourceMapper = (input): CanonicalDraft[] => {
  const obj = asObject(input, 'analytics_event');
  const id = requireId(obj, ['uuid', 'id'], 'analytics_event');
  return [
    {
      schema: 'analytics_event',
      source_object_id: id,
      occurred_at: toIso(obj.timestamp, 'timestamp', 'analytics_event'),
      attributes: {
        event_name: optStr(obj, 'event'),
        user_source_id: optStr(obj, 'distinct_id'),
        session_id:
          typeof obj.properties === 'object' && obj.properties !== null
            ? optStr(obj.properties as Record<string, unknown>, '$session_id')
            : undefined,
        count: optNum(obj, 'count') ?? 1,
        properties: obj.properties,
      },
    },
  ];
};

export const POSTHOG_MAPPERS = { events: posthogEvent };
