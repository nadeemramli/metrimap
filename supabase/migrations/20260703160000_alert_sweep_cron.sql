-- =====================================================================
-- ALERTING — scheduled server-side sweep (Metrimap)
-- Complements the client-side evaluation (canvasStore.persistNodeUpdate): a
-- pg_cron job periodically re-checks every enabled alert rule against its card's
-- latest value and fires 'alert' notifications for any that trip. This catches
-- cases the client path misses — e.g. a rule added to an ALREADY-breaching
-- metric (client only fires on the NEXT value change). Debounced by
-- last_triggered_value, shared with the client path, so no double-firing.
-- =====================================================================
BEGIN;

CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Evaluate all enabled rules; returns how many fired. SECURITY DEFINER so it can
-- insert notifications for other users (mirrors emit_card_alert). Reads the
-- latest point from metric_cards.data (kept in sync by the app on every edit).
CREATE OR REPLACE FUNCTION public.run_alert_sweep()
RETURNS integer
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  r        record;
  latest   jsonb;
  v        double precision;
  chg      double precision;
  per      text;
  cfg      jsonb;
  tripped  boolean;
  fired    integer := 0;
  t        text;
  title    text;
BEGIN
  FOR r IN
    SELECT ar.id, ar.card_id, ar.rule_type, ar.config, ar.created_by,
           ar.last_triggered_value,
           mc.data AS card_data, mc.title AS card_title,
           mc.owner_id, mc.created_by AS card_creator
    FROM public.alert_rules ar
    JOIN public.metric_cards mc ON mc.id = ar.card_id
    WHERE ar.enabled = true
      AND jsonb_typeof(mc.data) = 'array'
      AND jsonb_array_length(mc.data) > 0
  LOOP
    latest := r.card_data -> (jsonb_array_length(r.card_data) - 1);
    v   := (latest->>'value')::double precision;
    chg := coalesce((latest->>'change_percent')::double precision, 0);
    per := latest->>'period';
    cfg := r.config;
    tripped := false;

    IF r.rule_type = 'threshold' THEN
      tripped := CASE cfg->>'comparator'
        WHEN 'gt'  THEN v >  (cfg->>'value')::double precision
        WHEN 'gte' THEN v >= (cfg->>'value')::double precision
        WHEN 'lt'  THEN v <  (cfg->>'value')::double precision
        WHEN 'lte' THEN v <= (cfg->>'value')::double precision
        ELSE false END;
    ELSIF r.rule_type = 'change' THEN
      tripped := CASE cfg->>'direction'
        WHEN 'up'   THEN chg >=  (cfg->>'pct')::double precision
        WHEN 'down' THEN chg <= -(cfg->>'pct')::double precision
        ELSE false END;
    ELSIF r.rule_type = 'band' THEN
      tripped := v < (cfg->>'min')::double precision
              OR v > (cfg->>'max')::double precision;
    END IF;

    IF tripped AND r.last_triggered_value IS DISTINCT FROM v THEN
      title := coalesce(r.card_title, 'Metric');
      FOR t IN
        SELECT DISTINCT uid FROM (
          SELECT r.created_by AS uid
          UNION SELECT r.owner_id
          UNION SELECT r.card_creator
        ) s WHERE uid IS NOT NULL
      LOOP
        INSERT INTO public.notifications (user_id, type, title, description, metadata)
        VALUES (t, 'alert', 'Alert: ' || title,
                title || ' alert — now ' || v || ' (' || coalesce(per, '') || ')',
                jsonb_build_object('cardId', r.card_id, 'ruleId', r.id,
                                   'period', per, 'value', v));
      END LOOP;
      UPDATE public.alert_rules
        SET last_triggered_at = now(), last_triggered_value = v
        WHERE id = r.id;
      fired := fired + 1;
    END IF;
  END LOOP;
  RETURN fired;
END;
$$;

-- Schedule every 15 minutes (cron.schedule upserts by job name).
SELECT cron.schedule('metrimap-alert-sweep', '*/15 * * * *',
                     'SELECT public.run_alert_sweep();');

COMMIT;
