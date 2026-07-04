-- =====================================================================
-- MCP AUTH — resolve an API key to its owner (CVS-99). SECURITY DEFINER so the
-- MCP server can look a key up pre-auth with a plain anon client (no service-role
-- key). Matches on the EXACT sha-256 hash (the caller must present the raw key),
-- bumps last_used_at, and returns the owning user + workspace. Returns no row for
-- an unknown/revoked key. This anon-executable SECURITY DEFINER grant is
-- intentional (see docs/database/SECURITY_ADVISORS.md).
-- =====================================================================
BEGIN;

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

  UPDATE public.api_keys SET last_used_at = now() WHERE key_hash = p_key_hash;

  RETURN QUERY
  SELECT k.created_by, k.workspace_id
  FROM public.api_keys k
  WHERE k.key_hash = p_key_hash
  LIMIT 1;
END;
$$;

REVOKE ALL ON FUNCTION public.mcp_resolve_api_key(text) FROM public;
GRANT EXECUTE ON FUNCTION public.mcp_resolve_api_key(text) TO anon, authenticated, service_role;

COMMIT;
