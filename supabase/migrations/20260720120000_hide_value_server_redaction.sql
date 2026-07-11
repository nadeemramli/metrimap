-- Server-side enforcement of hide_value node visibility (bug-hunt #18).
--
-- Problem: hide_value access tags were only masked in the CLIENT. The
-- metric_cards SELECT policy filters hide_node rows but returns the full `data`
-- value series to every project viewer, so a restricted viewer could read the
-- masked numbers straight from the REST response / Zustand state.
--
-- Fix: block direct reads of the value column and expose a redacting VIEW that
-- blanks `data` for viewers who fail node_visible_to_me. The view is a DEFINER
-- view (so it can read the revoked column), but it re-imposes the SAME row-level
-- access the base RLS policy enforces via an explicit WHERE clause — so it can
-- NEVER leak rows from other projects even though it bypasses table RLS. All the
-- predicate functions read requesting_user_id()/org from the JWT, which reflects
-- the CALLER even inside a definer view.
--
-- Column-level REVOKE (not table-level) keeps INSERT/UPDATE/DELETE and non-`data`
-- SELECTs working; only reads of the value series are forced through the view.
--
-- ⚠️ COORDINATED RELEASE: apply this migration together with the client changes
-- that route data reads through public.metric_cards_visible and drop `data` from
-- write RETURNING clauses, and run `npm run test:rls` before deploying. The
-- client keeps a fallback to the base table until the view exists.

-- 1) Redacting view: same shape as metric_cards, data blanked when not visible,
--    same row scope as the metric_cards_select policy.
CREATE OR REPLACE VIEW public.metric_cards_visible
WITH (security_invoker = false) AS
SELECT
  mc.id,
  mc.project_id,
  mc.title,
  mc.description,
  mc.category,
  mc.sub_category,
  mc.position_x,
  mc.position_y,
  CASE
    WHEN public.node_visible_to_me(mc.id) THEN mc.data
    ELSE '[]'::jsonb
  END AS data,
  mc.source_type,
  mc.formula,
  mc.causal_factors,
  mc.dimensions,
  mc.owner_id,
  mc.assignees,
  mc.created_at,
  mc.updated_at,
  mc.created_by,
  mc.updated_by,
  mc.status,
  mc.workflow,
  mc.z_index,
  mc.tracked_metric_id
FROM public.metric_cards mc
WHERE public.can_view_project(mc.project_id)
  AND NOT public.node_hidden_from_me(mc.id);

-- 2) Block direct reads of the value column; everything else stays readable.
REVOKE SELECT (data) ON public.metric_cards FROM anon, authenticated;

-- 3) Expose the redacting view to clients.
GRANT SELECT ON public.metric_cards_visible TO anon, authenticated;

COMMENT ON VIEW public.metric_cards_visible IS
  'Redacting read path for metric_cards: blanks data for viewers failing '
  'node_visible_to_me and re-imposes the metric_cards_select row scope. '
  'Reads of metric_cards.data are REVOKEd from anon/authenticated; use this view. '
  'Keep the column list in sync when metric_cards gains columns.';
