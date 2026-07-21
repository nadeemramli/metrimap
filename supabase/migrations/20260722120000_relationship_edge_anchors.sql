-- CVS-335: per-edge custom endpoints (pinned handles).
-- When set, these override the auto-layout direction when anchoring the edge
-- to a node handle; NULL means "follow the current layout direction".
ALTER TABLE "public"."relationships"
  ADD COLUMN IF NOT EXISTS "source_handle" text,
  ADD COLUMN IF NOT EXISTS "target_handle" text;

COMMENT ON COLUMN "public"."relationships"."source_handle" IS 'Pinned React Flow handle id on the source node (e.g. right-source); NULL = follow auto-layout';
COMMENT ON COLUMN "public"."relationships"."target_handle" IS 'Pinned React Flow handle id on the target node (e.g. left-target); NULL = follow auto-layout';
