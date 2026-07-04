-- =====================================================================
-- MCP AUDIT LOG (CVS-104). Append-only record of every MCP tool call —
-- who (user_id) / what (tool_name, scope) / when (created_at) / outcome. Written
-- by the MCP server via the acting user's RLS-scoped client, so entries are
-- always attributed and a user only ever sees their own. No UPDATE/DELETE policy
-- (append-only); service_role can prune out-of-band.
-- =====================================================================
BEGIN;

CREATE TABLE IF NOT EXISTS public.mcp_audit_log (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     text NOT NULL DEFAULT requesting_user_id(),
  tool_name   text NOT NULL,
  scope       text,
  outcome     text NOT NULL CHECK (outcome IN ('ok', 'error')),
  error_code  text,
  duration_ms integer,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_mcp_audit_log_user_time
  ON public.mcp_audit_log (user_id, created_at DESC);

ALTER TABLE public.mcp_audit_log ENABLE ROW LEVEL SECURITY;

-- Users read + append only their own entries; no update/delete (append-only).
CREATE POLICY mcp_audit_log_select ON public.mcp_audit_log FOR SELECT
  USING (user_id = requesting_user_id());
CREATE POLICY mcp_audit_log_insert ON public.mcp_audit_log FOR INSERT
  WITH CHECK (user_id = requesting_user_id());

COMMIT;
