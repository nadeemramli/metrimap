-- =====================================================================
-- STRATEGY IMPACT — measurable "impact contracts" for Action/Hypothesis nodes.
-- Turns the Strategy page from a task board into the operating layer between
-- the metric tree and the dashboard: every work card can carry a bet
-- (target/leading/guardrail metrics, expected delta, baseline + measurement
-- window, confidence, result). See CVS-166 "Decision (locked)" and the vault
-- doc PRD/4. Product/6. Strategy Impact and Dashboard Trace.md.
--
-- SCOPE = workspace-wide (Clerk org): rows carry workspace_id defaulting to
-- requesting_org_id(), RLS = creator OR org-member (mirrors tracked_metrics /
-- metric_values). project_id keeps the ORIGIN canvas for a canvas filter +
-- lineage (nullable; a bet survives its canvas). One contract per node.
-- =====================================================================
BEGIN;

-- --- Impact contract: the measurable bet attached to a work card --------------
CREATE TABLE IF NOT EXISTS public.strategy_impact_contracts (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id         text DEFAULT public.requesting_org_id(),
  -- origin canvas (nullable → bet outlives the canvas; used for the canvas filter)
  project_id           uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  -- the Action/Hypothesis card that owns the bet (category enforced app-side)
  strategy_node_id     uuid NOT NULL REFERENCES public.metric_cards(id) ON DELETE CASCADE,
  expected_direction   text CHECK (expected_direction IN ('increase', 'decrease', 'stabilize')),
  expected_delta_value double precision,
  expected_delta_unit  text,               -- 'percent' | 'absolute' | free unit label
  baseline_start       text,               -- canonical 'YYYY-MM'
  baseline_end         text,
  measure_start        text,
  measure_end          text,
  baseline_is_manual   boolean NOT NULL DEFAULT false,
  confidence           text CHECK (confidence IN ('low', 'medium', 'high')),
  impact_status        text NOT NULL DEFAULT 'draft'
                         CHECK (impact_status IN ('draft', 'planned', 'measuring', 'won', 'lost', 'inconclusive')),
  owner_label          text,
  result_note          text,
  created_by           text NOT NULL DEFAULT public.requesting_user_id(),
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now(),
  UNIQUE (strategy_node_id)                 -- one contract per work card
);

ALTER TABLE public.strategy_impact_contracts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS strategy_impact_contracts_select ON public.strategy_impact_contracts;
CREATE POLICY strategy_impact_contracts_select ON public.strategy_impact_contracts
  FOR SELECT USING (
    created_by = public.requesting_user_id()
    OR (public.requesting_org_id() IS NOT NULL AND workspace_id = public.requesting_org_id())
  );

DROP POLICY IF EXISTS strategy_impact_contracts_insert ON public.strategy_impact_contracts;
CREATE POLICY strategy_impact_contracts_insert ON public.strategy_impact_contracts
  FOR INSERT WITH CHECK (
    created_by = public.requesting_user_id()
    AND (workspace_id IS NULL OR workspace_id = public.requesting_org_id())
  );

DROP POLICY IF EXISTS strategy_impact_contracts_update ON public.strategy_impact_contracts;
CREATE POLICY strategy_impact_contracts_update ON public.strategy_impact_contracts
  FOR UPDATE USING (
    created_by = public.requesting_user_id()
    OR (public.requesting_org_id() IS NOT NULL AND workspace_id = public.requesting_org_id())
  ) WITH CHECK (
    created_by = public.requesting_user_id()
    OR (public.requesting_org_id() IS NOT NULL AND workspace_id = public.requesting_org_id())
  );

DROP POLICY IF EXISTS strategy_impact_contracts_delete ON public.strategy_impact_contracts;
CREATE POLICY strategy_impact_contracts_delete ON public.strategy_impact_contracts
  FOR DELETE USING (
    created_by = public.requesting_user_id()
    OR (public.requesting_org_id() IS NOT NULL AND workspace_id = public.requesting_org_id())
  );

CREATE INDEX IF NOT EXISTS idx_strategy_impact_contracts_node      ON public.strategy_impact_contracts(strategy_node_id);
CREATE INDEX IF NOT EXISTS idx_strategy_impact_contracts_project   ON public.strategy_impact_contracts(project_id);
CREATE INDEX IF NOT EXISTS idx_strategy_impact_contracts_workspace ON public.strategy_impact_contracts(workspace_id);

DROP TRIGGER IF EXISTS update_strategy_impact_contracts_updated_at ON public.strategy_impact_contracts;
CREATE TRIGGER update_strategy_impact_contracts_updated_at
  BEFORE UPDATE ON public.strategy_impact_contracts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- --- Metric links: target / leading / guardrail refs (many per contract) ------
-- A ref points EITHER at a catalogued tracked metric (workspace-scoped, the
-- preferred cross-canvas anchor) OR a canvas metric card (canvas-local).
CREATE TABLE IF NOT EXISTS public.strategy_metric_links (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id       uuid NOT NULL REFERENCES public.strategy_impact_contracts(id) ON DELETE CASCADE,
  workspace_id      text DEFAULT public.requesting_org_id(),
  role              text NOT NULL CHECK (role IN ('target', 'leading', 'guardrail')),
  ref_source        text NOT NULL CHECK (ref_source IN ('tracked', 'card')),
  tracked_metric_id uuid REFERENCES public.tracked_metrics(id) ON DELETE CASCADE,
  card_id           uuid REFERENCES public.metric_cards(id) ON DELETE CASCADE,
  created_by        text NOT NULL DEFAULT public.requesting_user_id(),
  created_at        timestamptz NOT NULL DEFAULT now(),
  -- exactly one ref column populated, matching ref_source
  CONSTRAINT strategy_metric_links_ref_ck CHECK (
    (ref_source = 'tracked' AND tracked_metric_id IS NOT NULL AND card_id IS NULL)
    OR (ref_source = 'card' AND card_id IS NOT NULL AND tracked_metric_id IS NULL)
  )
);

ALTER TABLE public.strategy_metric_links ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS strategy_metric_links_select ON public.strategy_metric_links;
CREATE POLICY strategy_metric_links_select ON public.strategy_metric_links
  FOR SELECT USING (
    created_by = public.requesting_user_id()
    OR (public.requesting_org_id() IS NOT NULL AND workspace_id = public.requesting_org_id())
  );

DROP POLICY IF EXISTS strategy_metric_links_insert ON public.strategy_metric_links;
CREATE POLICY strategy_metric_links_insert ON public.strategy_metric_links
  FOR INSERT WITH CHECK (
    created_by = public.requesting_user_id()
    AND (workspace_id IS NULL OR workspace_id = public.requesting_org_id())
  );

DROP POLICY IF EXISTS strategy_metric_links_update ON public.strategy_metric_links;
CREATE POLICY strategy_metric_links_update ON public.strategy_metric_links
  FOR UPDATE USING (
    created_by = public.requesting_user_id()
    OR (public.requesting_org_id() IS NOT NULL AND workspace_id = public.requesting_org_id())
  ) WITH CHECK (
    created_by = public.requesting_user_id()
    OR (public.requesting_org_id() IS NOT NULL AND workspace_id = public.requesting_org_id())
  );

DROP POLICY IF EXISTS strategy_metric_links_delete ON public.strategy_metric_links;
CREATE POLICY strategy_metric_links_delete ON public.strategy_metric_links
  FOR DELETE USING (
    created_by = public.requesting_user_id()
    OR (public.requesting_org_id() IS NOT NULL AND workspace_id = public.requesting_org_id())
  );

CREATE INDEX IF NOT EXISTS idx_strategy_metric_links_contract  ON public.strategy_metric_links(contract_id);
CREATE INDEX IF NOT EXISTS idx_strategy_metric_links_tracked   ON public.strategy_metric_links(tracked_metric_id);
CREATE INDEX IF NOT EXISTS idx_strategy_metric_links_card      ON public.strategy_metric_links(card_id);
CREATE INDEX IF NOT EXISTS idx_strategy_metric_links_workspace ON public.strategy_metric_links(workspace_id);

COMMIT;
