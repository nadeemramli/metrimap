-- =====================================================================
-- EVENTS TAXONOMY — Data hub governance catalog (Metrimap)
-- A governed dictionary of product/business events and their properties.
-- v1 is catalog-only (no event-stream ingestion). Owner-scoped, mirroring
-- tracked_metrics (created_by = de-facto workspace); re-scoped to the Clerk-org
-- workspace with the hierarchy epic. See docs/backlog/object-model-and-catalog.md.
-- =====================================================================
BEGIN;

CREATE TABLE IF NOT EXISTS public.event_definitions (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by        text NOT NULL DEFAULT public.requesting_user_id(),
  name              text NOT NULL,
  key               text NOT NULL,
  category          text,
  description       text,
  lifecycle_state   text NOT NULL DEFAULT 'proposed'
                       CHECK (lifecycle_state IN ('proposed', 'approved', 'deprecated')),
  source_kind       text,
  owner_label       text,
  tracked_metric_id uuid REFERENCES public.tracked_metrics(id) ON DELETE SET NULL,
  created_at        timestamptz NOT NULL DEFAULT now(),
  updated_at        timestamptz NOT NULL DEFAULT now(),
  UNIQUE (created_by, key)
);

ALTER TABLE public.event_definitions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS event_definitions_select ON public.event_definitions;
CREATE POLICY event_definitions_select ON public.event_definitions
  FOR SELECT USING (created_by = public.requesting_user_id());

DROP POLICY IF EXISTS event_definitions_insert ON public.event_definitions;
CREATE POLICY event_definitions_insert ON public.event_definitions
  FOR INSERT WITH CHECK (created_by = public.requesting_user_id());

DROP POLICY IF EXISTS event_definitions_update ON public.event_definitions;
CREATE POLICY event_definitions_update ON public.event_definitions
  FOR UPDATE USING (created_by = public.requesting_user_id())
  WITH CHECK (created_by = public.requesting_user_id());

DROP POLICY IF EXISTS event_definitions_delete ON public.event_definitions;
CREATE POLICY event_definitions_delete ON public.event_definitions
  FOR DELETE USING (created_by = public.requesting_user_id());

CREATE INDEX IF NOT EXISTS idx_event_definitions_created_by
  ON public.event_definitions(created_by);

CREATE TABLE IF NOT EXISTS public.event_properties (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id       uuid NOT NULL REFERENCES public.event_definitions(id) ON DELETE CASCADE,
  name           text NOT NULL,
  key            text NOT NULL,
  data_type      text NOT NULL DEFAULT 'string'
                    CHECK (data_type IN ('string', 'number', 'boolean', 'timestamp', 'enum')),
  required       boolean NOT NULL DEFAULT false,
  allowed_values jsonb,
  example_value  text,
  description    text,
  created_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE (event_id, key)
);

ALTER TABLE public.event_properties ENABLE ROW LEVEL SECURITY;

-- Properties inherit access from their parent event definition.
DROP POLICY IF EXISTS event_properties_select ON public.event_properties;
CREATE POLICY event_properties_select ON public.event_properties
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.event_definitions e
      WHERE e.id = event_properties.event_id
        AND e.created_by = public.requesting_user_id()
    )
  );

DROP POLICY IF EXISTS event_properties_insert ON public.event_properties;
CREATE POLICY event_properties_insert ON public.event_properties
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.event_definitions e
      WHERE e.id = event_properties.event_id
        AND e.created_by = public.requesting_user_id()
    )
  );

DROP POLICY IF EXISTS event_properties_update ON public.event_properties;
CREATE POLICY event_properties_update ON public.event_properties
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.event_definitions e
      WHERE e.id = event_properties.event_id
        AND e.created_by = public.requesting_user_id()
    )
  );

DROP POLICY IF EXISTS event_properties_delete ON public.event_properties;
CREATE POLICY event_properties_delete ON public.event_properties
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.event_definitions e
      WHERE e.id = event_properties.event_id
        AND e.created_by = public.requesting_user_id()
    )
  );

CREATE INDEX IF NOT EXISTS idx_event_properties_event_id
  ON public.event_properties(event_id);

COMMIT;
