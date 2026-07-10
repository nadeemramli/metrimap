// SERVER-ONLY DB-backed cursor store (CVS-320). Persists the CVS-142 runtime's opaque
// incremental cursors in `connector_cursors` so a run resumes across invocations.
// Written with a SERVICE-ROLE client only — the table has no client write policies;
// workspace members can read for debug surfaces. Payload-free by construction.
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/shared/lib/supabase/types';
import type { CursorStore } from '../runtime';

type ServiceClient = SupabaseClient<Database>;

/** Split a `${accountId}:${connectorId}:${stream}` cursor key (see cursorKeyFor). */
function parseKey(key: string): { accountId: string; connectorId: string; stream: string } {
  const first = key.indexOf(':');
  const second = key.indexOf(':', first + 1);
  if (first < 0 || second < 0) throw new Error(`invalid cursor key: expected accountId:connectorId:stream`);
  return { accountId: key.slice(0, first), connectorId: key.slice(first + 1, second), stream: key.slice(second + 1) };
}

/** CursorStore over `connector_cursors`, scoped to one account's workspace/owner. */
export class SupabaseCursorStore implements CursorStore {
  constructor(
    private readonly service: ServiceClient,
    private readonly scope: { workspaceId: string | null; createdBy: string | null }
  ) {}

  async read(key: string): Promise<string | undefined> {
    const { accountId, stream } = parseKey(key);
    const { data, error } = await this.service
      .from('connector_cursors')
      .select('cursor')
      .eq('connected_account_id', accountId)
      .eq('stream', stream)
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data?.cursor ?? undefined;
  }

  async write(key: string, cursor: string): Promise<void> {
    const { accountId, connectorId, stream } = parseKey(key);
    const { error } = await this.service.from('connector_cursors').upsert(
      {
        connected_account_id: accountId,
        connector_id: connectorId,
        stream,
        cursor,
        workspace_id: this.scope.workspaceId,
        created_by: this.scope.createdBy,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'connected_account_id,stream' }
    );
    if (error) throw new Error(error.message);
  }
}
