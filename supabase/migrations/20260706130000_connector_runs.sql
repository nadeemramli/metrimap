-- =====================================================================
-- CONNECTOR OBSERVABILITY — payload-free run/audit log (CVS-145)
-- Metrimap : iqrclwolhookzzmiedun. Identity = requesting_user_id(); workspace =
-- requesting_org_id(). Idempotent. RLS ENABLED, workspace-scoped, APPEND-ONLY
-- (select + insert only — an audit log is never edited or deleted by clients).
--
-- Records connector run health + connection events WITHOUT raw source payloads:
-- only counts, cursor tokens, error CLASSES, and safe/redacted messages. There is
-- deliberately no column for request bodies, tokens, or record contents. See
-- docs/data/connector-observability.md.
-- =====================================================================
BEGIN;

CREATE TABLE IF NOT EXISTS public.connector_runs (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by           text NOT NULL DEFAULT public.requesting_user_id(),
  workspace_id         text DEFAULT public.requesting_org_id(),
  connected_account_id uuid REFERENCES public.connected_accounts(id) ON DELETE SET NULL,
  connector_id         text NOT NULL,
  stream               text,
  -- 'run' events (run_started/finished/failed) or 'connection' events
  -- (connected/refreshed/revoked/disconnected/auth_failed). Free text, app-validated.
  event                text NOT NULL,
  status               text NOT NULL DEFAULT 'success'
                         CHECK (status IN ('running', 'success', 'error', 'partial')),
  sync_mode            text,
  -- counts (payload-free)
  pages                integer NOT NULL DEFAULT 0,
  fetched              integer NOT NULL DEFAULT 0,
  accepted             integer NOT NULL DEFAULT 0,
  skipped              integer NOT NULL DEFAULT 0,
  rejected             integer NOT NULL DEFAULT 0,
  materialized         integer NOT NULL DEFAULT 0,
  -- payload-free cursor token + error class + SAFE (redacted) message only
  cursor               text,
  error_class          text,
  error_message        text,
  resumable            boolean NOT NULL DEFAULT false,
  duration_ms          integer,
  started_at           timestamptz,
  finished_at          timestamptz,
  created_at           timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_connector_runs_workspace_id
  ON public.connector_runs(workspace_id);
-- fast "latest run for this account+stream" (health derivation)
CREATE INDEX IF NOT EXISTS idx_connector_runs_account_recent
  ON public.connector_runs(connected_account_id, stream, created_at DESC);

ALTER TABLE public.connector_runs ENABLE ROW LEVEL SECURITY;

-- Workspace-scoped read (creator or org member).
DROP POLICY IF EXISTS connector_runs_select ON public.connector_runs;
CREATE POLICY connector_runs_select ON public.connector_runs
  FOR SELECT USING (
    created_by = public.requesting_user_id()
    OR (public.requesting_org_id() IS NOT NULL AND workspace_id = public.requesting_org_id())
  );

-- Insert-only for clients (append-only audit). No update/delete policies => immutable.
DROP POLICY IF EXISTS connector_runs_insert ON public.connector_runs;
CREATE POLICY connector_runs_insert ON public.connector_runs
  FOR INSERT WITH CHECK (
    created_by = public.requesting_user_id()
    AND (workspace_id IS NULL OR workspace_id = public.requesting_org_id())
  );

COMMIT;
