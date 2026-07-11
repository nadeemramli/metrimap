import { describe, expect, it, vi } from 'vitest';

// comments.ts pulls in the Supabase service layer at module load; mock it so
// the pure resolveMentionIds parser can be tested in isolation.
vi.mock('@/shared/lib/supabase/services/collaboration', () => ({
  addMention: vi.fn(),
  createComment: vi.fn(),
  createCommentThread: vi.fn(),
  createNotification: vi.fn(),
}));
vi.mock('@/shared/utils/authenticatedClient', () => ({
  getClientForEnvironment: vi.fn(),
}));

import { resolveMentionIds } from './comments';

describe('resolveMentionIds', () => {
  const ali = { id: 'u-ali', name: 'Ali' };
  const alice = { id: 'u-alice', name: 'Alice' };
  const nadeem = { id: 'u-nadeem', name: 'Nadeem' };
  const nadeemRamli = { id: 'u-nadeem-ramli', name: 'Nadeem Ramli' };

  it('does not match a member whose name is a prefix of the mentioned name', () => {
    expect(
      resolveMentionIds('thanks @Alice for the analysis', [ali, alice])
    ).toEqual([alice.id]);
  });

  it('still matches the short name when it is the one mentioned', () => {
    expect(resolveMentionIds('ping @Ali about this', [ali, alice])).toEqual([
      ali.id,
    ]);
  });

  it('claims the longest name first for multi-word names', () => {
    expect(
      resolveMentionIds('cc @Nadeem Ramli on the rollout', [
        nadeem,
        nadeemRamli,
      ])
    ).toEqual([nadeemRamli.id]);
  });

  it('resolves both members when both are genuinely mentioned', () => {
    const ids = resolveMentionIds('@Nadeem and @Nadeem Ramli please review', [
      nadeem,
      nadeemRamli,
    ]);
    expect(ids.sort()).toEqual([nadeem.id, nadeemRamli.id].sort());
  });

  it('is boundary-safe at end of string and before punctuation', () => {
    expect(resolveMentionIds('over to @Ali', [ali, alice])).toEqual([ali.id]);
    expect(resolveMentionIds('over to @Ali, thanks', [ali, alice])).toEqual([
      ali.id,
    ]);
  });

  it('escapes regex metacharacters in names', () => {
    const weird = { id: 'u-weird', name: 'A. (Team)' };
    expect(resolveMentionIds('hi @A. (Team) hello', [weird, ali])).toEqual([
      weird.id,
    ]);
  });

  it('returns an empty list when nothing matches', () => {
    expect(resolveMentionIds('no mentions here', [ali, alice])).toEqual([]);
    expect(resolveMentionIds('', [ali])).toEqual([]);
  });

  it('ignores members with empty names', () => {
    expect(
      resolveMentionIds('hello @Ali', [{ id: 'u-empty', name: '' }, ali])
    ).toEqual([ali.id]);
  });
});
