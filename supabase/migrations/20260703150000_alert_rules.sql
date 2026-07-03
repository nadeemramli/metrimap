-- =====================================================================
-- ALERTING / MONITORING — threshold alerts on metric cards (Metrimap)
-- A rule watches a card's latest value; when it trips (client-side, on value
-- change) the app calls emit_card_alert(), which fans a 'alert' notification to
-- the rule creator + card owner/creator. That fan-out needs SECURITY DEFINER
-- because notifications_insert RLS only lets a user insert rows for themselves.
-- =====================================================================
BEGIN;

CREATE TABLE IF NOT EXISTS public.alert_rules (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id          uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  card_id             uuid NOT NULL REFERENCES public.metric_cards(id) ON DELETE CASCADE,
  name                text,
  rule_type           text NOT NULL CHECK (rule_type IN ('threshold', 'change', 'band')),
  -- Per-type params. threshold: {comparator:gt|lt|gte|lte, value}. change:
  -- {direction:up|down, pct}. band: {min, max}.
  config              jsonb NOT NULL DEFAULT '{}'::jsonb,
  enabled             boolean NOT NULL DEFAULT true,
  created_by          text NOT NULL DEFAULT public.requesting_user_id(),
  last_triggered_at   timestamptz,
  last_triggered_value double precision,
  created_at          timestamptz NOT NULL DEFAULT now(),
  updated_at          timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.alert_rules ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS alert_rules_select ON public.alert_rules;
CREATE POLICY alert_rules_select ON public.alert_rules
  FOR SELECT USING (public.has_project_access(project_id, false));

DROP POLICY IF EXISTS alert_rules_insert ON public.alert_rules;
CREATE POLICY alert_rules_insert ON public.alert_rules
  FOR INSERT WITH CHECK (public.has_project_access(project_id, true));

DROP POLICY IF EXISTS alert_rules_update ON public.alert_rules;
CREATE POLICY alert_rules_update ON public.alert_rules
  FOR UPDATE USING (public.has_project_access(project_id, true))
  WITH CHECK (public.has_project_access(project_id, true));

DROP POLICY IF EXISTS alert_rules_delete ON public.alert_rules;
CREATE POLICY alert_rules_delete ON public.alert_rules
  FOR DELETE USING (public.has_project_access(project_id, true));

CREATE INDEX IF NOT EXISTS idx_alert_rules_card ON public.alert_rules(card_id);

DROP TRIGGER IF EXISTS update_alert_rules_updated_at ON public.alert_rules;
CREATE TRIGGER update_alert_rules_updated_at
  BEFORE UPDATE ON public.alert_rules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Fan a triggered alert to the rule creator + card owner/creator. Caller must
-- have (read) access to the card's project — normally the person who just edited
-- it. Runs as definer so it can insert notifications for OTHER users.
CREATE OR REPLACE FUNCTION public.emit_card_alert(
  p_rule_id    uuid,
  p_title      text,
  p_description text,
  p_metadata   jsonb DEFAULT '{}'::jsonb
) RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  v_project uuid;
  v_card    uuid;
  t         text;
BEGIN
  SELECT project_id, card_id INTO v_project, v_card
  FROM public.alert_rules WHERE id = p_rule_id;
  IF v_project IS NULL THEN RETURN; END IF;
  IF NOT public.has_project_access(v_project, false) THEN
    RAISE EXCEPTION 'not authorized to emit alert for this project';
  END IF;

  FOR t IN
    SELECT DISTINCT uid FROM (
      SELECT created_by AS uid FROM public.alert_rules WHERE id = p_rule_id
      UNION SELECT owner_id  FROM public.metric_cards WHERE id = v_card
      UNION SELECT created_by FROM public.metric_cards WHERE id = v_card
    ) s WHERE uid IS NOT NULL
  LOOP
    INSERT INTO public.notifications (user_id, type, title, description, metadata)
    VALUES (t, 'alert', p_title, p_description, coalesce(p_metadata, '{}'::jsonb));
  END LOOP;
END;
$$;

GRANT EXECUTE ON FUNCTION public.emit_card_alert(uuid, text, text, jsonb) TO authenticated;

COMMIT;
