// Audit log for MCP tool calls (CVS-104): who / what / when / outcome. The sink
// is pluggable so dispatch stays transport-agnostic and unit-testable. The
// Supabase sink writes to public.mcp_audit_log (RLS-scoped, append-only) via the
// caller's own client, so an entry is always attributed to the acting user.
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/shared/lib/supabase/types';
import type { McpScope } from './authContext';

export interface McpAuditEntry {
  userId: string;
  tool: string;
  scope: McpScope;
  outcome: 'ok' | 'error';
  errorCode?: string | null;
  durationMs?: number;
}

export interface AuditSink {
  record(entry: McpAuditEntry): Promise<void>;
}

export const noopAuditSink: AuditSink = {
  record: async () => {},
};

export function supabaseAuditSink(
  client: SupabaseClient<Database>
): AuditSink {
  return {
    record: async (e) => {
      await client.from('mcp_audit_log').insert({
        user_id: e.userId,
        tool_name: e.tool,
        scope: e.scope,
        outcome: e.outcome,
        error_code: e.errorCode ?? null,
        duration_ms: e.durationMs ?? null,
      });
    },
  };
}
