// PostHog → canonical (CVS-143). Events carry an ISO timestamp and a properties bag.
import type { CanonicalDraft, Mapper } from '../types';

interface PosthogEvent {
  id?: string;
  uuid?: string;
  event: string;
  distinct_id?: string;
  timestamp: string; // ISO-8601
  properties?: Record<string, unknown>;
}

export const mapPosthogEvent: Mapper = (raw): CanonicalDraft[] => {
  const e = raw as PosthogEvent;
  const sessionId = e.properties?.['$session_id'];
  return [
    {
      schema: 'analytics_event',
      source_object_id: e.uuid ?? e.id ?? '',
      occurred_at: e.timestamp,
      attributes: {
        event_name: e.event,
        user_source_id: e.distinct_id,
        session_id: typeof sessionId === 'string' ? sessionId : undefined,
        count: 1,
        properties: e.properties,
      },
    },
  ];
};
