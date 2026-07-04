-- =====================================================================
-- Evidence notebook content persistence (Metrimap, CVS-34)
-- evidence_items stored metadata only (title/type/summary/hypothesis/…); the
-- EditorJS notebook (`content`) was never persisted — it lived in the local
-- Zustand store and was lost on reload. Add a jsonb column so the notebook is a
-- persisted, single source of truth. Nullable + idempotent (safe additive).
-- =====================================================================
ALTER TABLE public.evidence_items ADD COLUMN IF NOT EXISTS content jsonb;
COMMENT ON COLUMN public.evidence_items.content IS 'EditorJS notebook JSON — the canonical evidence document (CVS-34).';
