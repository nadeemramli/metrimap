-- =====================================================================
-- API-key hardening. MCP/metrics API keys are minted with the workspace_id
-- captured at creation time and never expire, and RLS only lets the CREATOR see
-- or revoke a key — so a workspace admin cannot audit or revoke another member's
-- key, and an expired/rotated key keeps working. This migration:
--   (1) adds api_keys.expires_at and filters it in mcp_resolve_api_key, so an
--       expired key resolves to no owner (invalid);
--   (2) adds workspace-admin SELECT + DELETE policies so an org admin can see and
--       revoke any key stamped with their workspace, keeping the existing
--       created_by (owner) policies intact.
-- Org-membership re-check at resolve time is enforced in the MCP server layer
-- (verifyOrgMembership) — this migration is the DB-side half.
-- =====================================================================
BEGIN;

ALTER TABLE public.api_keys
  ADD COLUMN IF NOT EXISTS expires_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_api_keys_workspace_id ON public.api_keys(workspace_id);

-- Resolver now skips expired keys (NULL expires_at = never expires).
CREATE OR REPLACE FUNCTION public.mcp_resolve_api_key(p_key_hash text)
RETURNS TABLE (user_id text, workspace_id text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_key_hash IS NULL OR length(p_key_hash) < 32 THEN
    RETURN;
  END IF;

  UPDATE public.api_keys SET last_used_at = now()
  WHERE key_hash = p_key_hash
    AND (expires_at IS NULL OR expires_at > now());

  RETURN QUERY
  SELECT k.created_by, k.workspace_id
  FROM public.api_keys k
  WHERE k.key_hash = p_key_hash
    AND (k.expires_at IS NULL OR k.expires_at > now())
  LIMIT 1;
END;
$$;

REVOKE ALL ON FUNCTION public.mcp_resolve_api_key(text) FROM public;
GRANT EXECUTE ON FUNCTION public.mcp_resolve_api_key(text) TO anon, authenticated, service_role;

-- ---------------------------------------------------------------------
-- Workspace-admin visibility + revocation. Additive to the owner (created_by)
-- policies from 20260630120000 — an org admin of the key's workspace can also
-- list and delete keys stamped with that workspace_id.
-- ---------------------------------------------------------------------
DROP POLICY IF EXISTS api_keys_admin_select ON public.api_keys;
CREATE POLICY api_keys_admin_select ON public.api_keys
  FOR SELECT USING (
    workspace_id IS NOT NULL
    AND workspace_id = public.requesting_org_id()
    AND public.requesting_org_role() = ANY (ARRAY['admin', 'org:admin'])
  );

DROP POLICY IF EXISTS api_keys_admin_delete ON public.api_keys;
CREATE POLICY api_keys_admin_delete ON public.api_keys
  FOR DELETE USING (
    workspace_id IS NOT NULL
    AND workspace_id = public.requesting_org_id()
    AND public.requesting_org_role() = ANY (ARRAY['admin', 'org:admin'])
  );

COMMIT;
