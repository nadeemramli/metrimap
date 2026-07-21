import { describe, expect, it } from 'vitest';
import { splitEvidenceUpdates } from './evidenceSync';
import { isEvidenceUuid, rowToEvidence } from '@/shared/lib/supabase/services/evidence';
import type { Tables } from '@/shared/lib/supabase/types';

describe('splitEvidenceUpdates', () => {
  it('routes content fields to db and canvas fields to layout', () => {
    const { db, layout } = splitEvidenceUpdates({
      title: 'T',
      content: { time: 1, blocks: [], version: 'x' } as never,
      context: { type: 'general' },
      position: { x: 1, y: 2 },
      isExpanded: true,
      links: [],
    });
    expect(Object.keys(db).sort()).toEqual(['content', 'context', 'title']);
    expect(Object.keys(layout).sort()).toEqual([
      'isExpanded',
      'links',
      'position',
    ]);
  });

  it('returns empty db for layout-only updates', () => {
    const { db } = splitEvidenceUpdates({ position: { x: 0, y: 0 } });
    expect(Object.keys(db)).toHaveLength(0);
  });
});

describe('isEvidenceUuid', () => {
  it('accepts UUIDs, rejects legacy ids', () => {
    expect(isEvidenceUuid('11111111-1111-4111-8111-111111111111')).toBe(true);
    expect(isEvidenceUuid('evidence_1699999999999')).toBe(false);
    expect(isEvidenceUuid(undefined)).toBe(false);
  });
});

describe('rowToEvidence context mapping', () => {
  const base = {
    id: '11111111-1111-4111-8111-111111111111',
    title: 'T',
    type: 'Analysis',
    date: '2026-07-01',
    owner_id: null,
    link: null,
    hypothesis: null,
    summary: 'S',
    impact_on_confidence: null,
    is_public: false,
    content: null,
    card_id: null,
    relationship_id: null,
    project_id: 'p1',
    created_at: '2026-07-01T00:00:00Z',
    updated_at: '2026-07-02T00:00:00Z',
    created_by: 'user_abc',
  } as unknown as Tables<'evidence_items'>;

  it('maps card_id to card context', () => {
    const e = rowToEvidence({ ...base, card_id: 'c1' });
    expect(e.context).toEqual({ type: 'card', targetId: 'c1' });
  });

  it('maps relationship_id to relationship context', () => {
    const e = rowToEvidence({ ...base, relationship_id: 'r1' });
    expect(e.context).toEqual({ type: 'relationship', targetId: 'r1' });
  });

  it('defaults to general context and maps timestamps', () => {
    const e = rowToEvidence(base);
    expect(e.context).toEqual({ type: 'general' });
    expect(e.createdAt).toBe('2026-07-01T00:00:00Z');
    expect(e.updatedAt).toBe('2026-07-02T00:00:00Z');
    expect(e.createdBy).toBe('user_abc');
  });
});
