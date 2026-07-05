-- =====================================================================
-- EXPLORATORY RELATIONSHIP TYPE — allow a loose/exploratory link that users can
-- firm up later (CVS-165 follow-up). Relaxes the relationships.type CHECK to
-- include 'Exploratory' alongside the four validated types.
-- =====================================================================
BEGIN;

ALTER TABLE public.relationships
  DROP CONSTRAINT IF EXISTS relationships_type_check;

ALTER TABLE public.relationships
  ADD CONSTRAINT relationships_type_check
  CHECK (
    type = ANY (
      ARRAY[
        'Deterministic',
        'Probabilistic',
        'Causal',
        'Compositional',
        'Exploratory'
      ]::text[]
    )
  );

COMMIT;
