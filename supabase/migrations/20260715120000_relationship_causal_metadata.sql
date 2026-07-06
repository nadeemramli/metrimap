-- =====================================================================
-- CAUSAL VALIDATION STATE — persist a causal relationship's validation checklist
-- and its validated/refuted status so it survives reload and can surface on the
-- edge (last CVS-165 AC). Stored as jsonb: { status, checklist:[{id,checked,notes}] }.
-- =====================================================================
BEGIN;

ALTER TABLE public.relationships
  ADD COLUMN IF NOT EXISTS causal_metadata jsonb;

COMMIT;
