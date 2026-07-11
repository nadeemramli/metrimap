-- =====================================================================
-- CONNECTOR RUN HOST — cursors + metric bindings (CVS-320)
-- Metrimap : iqrclwolhookzzmiedun. Clerk-via-Supabase-native auth.
-- Identity = public.requesting_user_id() (text); workspace = public.requesting_org_id().
-- Idempotent: safe to apply/re-apply. RLS ENABLED on both tables.
--
--   * connector_cursors — one opaque incremental cursor per (connected account,
--     stream). Payload-free by construction (CVS-142). Written ONLY by the run
--     host (service role); workspace members may read for debug surfaces.
--   * metric_bindings   — persisted CVS-144 MetricBinding recipes: "aggregate this
--     connector stream into this tracked metric". Workspace-scoped CRUD so the
--     Connect/binding UI can manage them; the run host reads them per run.
-- See docs/data/connector-run-host.md and Linear CVS-320.
-- =====================================================================
BEGIN;

-- ---------------------------------------------------------------------
-- 1. CURSOR STORE (service-role write, workspace read)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.connector_cursors (
  connected_account_id uuid NOT NULL
                         REFERENCES public.connected_accounts(id) ON DELETE CASCADE,
  connector_id         text NOT NULL,
  stream               text NOT NULL,
  -- opaque incremental cursor (e.g. a GA4 date '20260710') — never payload data
  cursor               text NOT NULL,
  -- denormalized from connected_accounts for the read policy
  workspace_id         text,
  created_by           text,
  updated_at           timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (connected_account_id, stream)
);

CREATE INDEX IF NOT EXISTS idx_connector_cursors_workspace_id
  ON public.connector_cursors(workspace_id);

ALTER TABLE public.connector_cursors ENABLE ROW LEVEL SECURITY;

-- Workspace-scoped read (creator or org member) — mirrors connector_runs_select.
DROP POLICY IF EXISTS connector_cursors_select ON public.connector_cursors;
CREATE POLICY connector_cursors_select ON public.connector_cursors
  FOR SELECT USING (
    created_by = public.requesting_user_id()
    OR (public.requesting_org_id() IS NOT NULL AND workspace_id = public.requesting_org_id())
  );

-- No INSERT/UPDATE/DELETE policies => clients cannot write; only the service-role
-- run host advances cursors (safe-resume guarantee stays server-owned).

-- ---------------------------------------------------------------------
-- 2. METRIC BINDINGS (workspace-scoped CRUD)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.metric_bindings (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by           text NOT NULL DEFAULT public.requesting_user_id(),
  workspace_id         text DEFAULT public.requesting_org_id(),
  connected_account_id uuid NOT NULL
                         REFERENCES public.connected_accounts(id) ON DELETE CASCADE,
  connector_id         text NOT NULL,
  stream               text NOT NULL,
  canonical_schema     text NOT NULL,
  -- CVS-144 MetricRecipe: { aggregation, grain, field?, filter? }
  recipe               jsonb NOT NULL,
  tracked_metric_id    uuid NOT NULL
                         REFERENCES public.tracked_metrics(id) ON DELETE CASCADE,
  enabled              boolean NOT NULL DEFAULT true,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now(),
  -- one binding per (account, stream, target metric)
  UNIQUE (connected_account_id, stream, tracked_metric_id)
);

CREATE INDEX IF NOT EXISTS idx_metric_bindings_workspace_id
  ON public.metric_bindings(workspace_id);
CREATE INDEX IF NOT EXISTS idx_metric_bindings_account_stream
  ON public.metric_bindings(connected_account_id, stream);

ALTER TABLE public.metric_bindings ENABLE ROW LEVEL SECURITY;

-- Workspace-scoped CRUD — mirrors the audited connected_accounts policy shape.
DROP POLICY IF EXISTS metric_bindings_select ON public.metric_bindings;
CREATE POLICY metric_bindings_select ON public.metric_bindings
  FOR SELECT USING (
    created_by = public.requesting_user_id()
    OR (public.requesting_org_id() IS NOT NULL AND workspace_id = public.requesting_org_id())
  );

DROP POLICY IF EXISTS metric_bindings_insert ON public.metric_bindings;
CREATE POLICY metric_bindings_insert ON public.metric_bindings
  FOR INSERT WITH CHECK (
    created_by = public.requesting_user_id()
    AND (workspace_id IS NULL OR workspace_id = public.requesting_org_id())
  );

DROP POLICY IF EXISTS metric_bindings_update ON public.metric_bindings;
CREATE POLICY metric_bindings_update ON public.metric_bindings
  FOR UPDATE USING (
    created_by = public.requesting_user_id()
    OR (public.requesting_org_id() IS NOT NULL AND workspace_id = public.requesting_org_id())
  ) WITH CHECK (
    created_by = public.requesting_user_id()
    OR (public.requesting_org_id() IS NOT NULL AND workspace_id = public.requesting_org_id())
  );

DROP POLICY IF EXISTS metric_bindings_delete ON public.metric_bindings;
CREATE POLICY metric_bindings_delete ON public.metric_bindings
  FOR DELETE USING (
    created_by = public.requesting_user_id()
    OR (public.requesting_org_id() IS NOT NULL AND workspace_id = public.requesting_org_id())
  );

COMMIT;
