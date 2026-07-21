import { describe, expect, it } from 'vitest';
import type { EvidenceItem } from '@/shared/types';
import {
  applyEvidenceLayout,
  buildEvidenceLayoutEntry,
  buildEvidenceLayoutMap,
  partitionLegacyEvidence,
  remapDataFlowEdges,
} from './hydrateProjectEvidence';

const UUID_A = '11111111-1111-4111-8111-111111111111';
const UUID_B = '22222222-2222-4222-8222-222222222222';

function item(overrides: Partial<EvidenceItem>): EvidenceItem {
  return {
    id: UUID_A,
    title: 'Item',
    type: 'Analysis',
    date: '2026-07-01',
    owner: '',
    summary: '',
    ...overrides,
  } as EvidenceItem;
}

describe('partitionLegacyEvidence', () => {
  it('matches existing rows by id', () => {
    const row = item({ id: UUID_A, title: 'Row' });
    const blob = item({ id: UUID_A, title: 'Blob' });
    const p = partitionLegacyEvidence([blob], [row]);
    expect(p.existing).toEqual([{ blob, row }]);
    expect(p.insertKeepId).toEqual([]);
    expect(p.insertNewId).toEqual([]);
  });

  it('matches existing rows by title/date/createdBy fingerprint (repository dual-write)', () => {
    const row = item({ id: UUID_B, title: 'Same', createdBy: 'user_x' });
    const blob = item({
      id: 'evidence_123',
      title: 'Same',
      createdBy: 'user_x',
    });
    const p = partitionLegacyEvidence([blob], [row]);
    expect(p.existing).toEqual([{ blob, row }]);
    expect(p.insertNewId).toEqual([]);
  });

  it('keeps UUID ids for insert, sends legacy ids to insertNewId', () => {
    const keep = item({ id: UUID_B, title: 'Keep' });
    const legacy = item({ id: 'evidence_456', title: 'Legacy' });
    const p = partitionLegacyEvidence([keep, legacy], []);
    expect(p.insertKeepId).toEqual([keep]);
    expect(p.insertNewId).toEqual([legacy]);
    expect(p.existing).toEqual([]);
  });
});

describe('evidence layout map', () => {
  it('extracts only layout fields and context targetName', () => {
    const e = item({
      position: { x: 1, y: 2 },
      isExpanded: true,
      links: [{ targetId: 'c1', targetName: 'Card' }],
      context: { type: 'card', targetId: 'c1', targetName: 'Card' },
      content: { time: 1, blocks: [], version: 'x' } as EvidenceItem['content'],
    });
    const entry = buildEvidenceLayoutEntry(e)!;
    expect(entry.position).toEqual({ x: 1, y: 2 });
    expect(entry.isExpanded).toBe(true);
    expect(entry.links).toHaveLength(1);
    expect(entry.contextTargetName).toBe('Card');
    expect('content' in entry).toBe(false);
    expect('title' in entry).toBe(false);
  });

  it('returns null for items with no layout', () => {
    expect(buildEvidenceLayoutEntry(item({}))).toBeNull();
    expect(buildEvidenceLayoutMap([item({})])).toEqual({});
  });

  it('applyEvidenceLayout overlays layout and re-attaches targetName', () => {
    const row = item({
      id: UUID_A,
      context: { type: 'card', targetId: 'c1' },
    });
    const merged = applyEvidenceLayout(row, {
      position: { x: 5, y: 6 },
      contextTargetName: 'Revenue',
    });
    expect(merged.position).toEqual({ x: 5, y: 6 });
    expect(merged.context).toEqual({
      type: 'card',
      targetId: 'c1',
      targetName: 'Revenue',
    });
  });
});

describe('remapDataFlowEdges', () => {
  it('remaps source/target and ref-edge ids', () => {
    const edges = [
      {
        id: 'ref-evidence_123-card1',
        source: 'evidence_123',
        target: 'card1',
      },
      { id: 'other', source: 'a', target: 'b' },
    ];
    const remapped = remapDataFlowEdges(edges, { evidence_123: UUID_A })!;
    expect(remapped[0]).toEqual({
      id: `ref-${UUID_A}-card1`,
      source: UUID_A,
      target: 'card1',
    });
    expect(remapped[1]).toEqual(edges[1]);
  });

  it('returns null when nothing changes', () => {
    expect(
      remapDataFlowEdges([{ id: 'x', source: 'a', target: 'b' }], {
        evidence_9: UUID_A,
      })
    ).toBeNull();
    expect(remapDataFlowEdges('not-an-array', { a: 'b' })).toBeNull();
  });
});
