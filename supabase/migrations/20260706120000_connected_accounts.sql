-- =====================================================================
-- CONNECTED ACCOUNTS — native SaaS connectors (CVS-141)
-- Metrimap : iqrclwolhookzzmiedun. Clerk-via-Supabase-native auth.
-- Identity = public.requesting_user_id() (text); workspace = public.requesting_org_id().
-- Idempotent: safe to apply/re-apply. RLS ENABLED on both tables.
--
-- These are the OAuth / API-key "connected accounts" (GA4, Stripe, WooCommerce,
-- Shopify, PostHog, …) — DISTINCT from the warehouse `source_connections` (Data
-- hub). Same two-table security shape as source_connections:
--   * connected_accounts        — NON-secret connection metadata. Workspace-scoped
--                                  RLS (created_by OR workspace_id = requesting_org_id()).
--   * connected_account_secrets — encrypted tokens/keys. RLS ENABLED with NO
--     POLICIES + REVOKE from client roles, so ONLY the service-role key (server
--     side: OAuth-callback edge fn / fetch runtime) can touch it. Token material
--     is AES-256-GCM ciphertext (see src/shared/lib/connectors/connections/crypto.ts);
--     the plaintext key never reaches the DB or the browser.
-- See docs/data/connected-accounts.md and the locked decision on Linear CVS-137.
-- =====================================================================
BEGIN;

-- ---------------------------------------------------------------------
-- 1. CONNECTION METADATA (workspace-visible, no secrets)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.connected_accounts (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by           text NOT NULL DEFAULT public.requesting_user_id(),
  workspace_id         text DEFAULT public.requesting_org_id(),
  -- connector id from the manifest registry (CVS-140), e.g. 'ga4' | 'stripe'.
  -- Intentionally NOT a CHECK constraint so new connectors ship without a migration;
  -- the manifest registry is the source of truth for valid ids.
  connector_id         text NOT NULL,
  auth_type            text NOT NULL CHECK (auth_type IN ('oauth2', 'api_key')),
  -- provider account / property / store id (null until the connect flow resolves it)
  source_account_id    text,
  source_account_label text,
  granted_scopes       text[] NOT NULL DEFAULT '{}',
  status               text NOT NULL DEFAULT 'pending'
                         CHECK (status IN ('pending', 'connected', 'error', 'revoked')),
  -- payload-free status detail (error class / short message only — never a payload)
  status_detail        text,
  last_synced_at       timestamptz,
  last_query_at        timestamptz,
  revoked_at           timestamptz,
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now(),
  -- one live connection per (workspace, connector, source account)
  UNIQUE (workspace_id, connector_id, source_account_id)
);

CREATE INDEX IF NOT EXISTS idx_connected_accounts_workspace_id
  ON public.connected_accounts(workspace_id);
CREATE INDEX IF NOT EXISTS idx_connected_accounts_connector
  ON public.connected_accounts(workspace_id, connector_id);

ALTER TABLE public.connected_accounts ENABLE ROW LEVEL SECURITY;

-- Workspace-scoped RLS (matches the workspace_org_scoping pattern): the creator is
-- never locked out, and org members share the workspace's connections.
DROP POLICY IF EXISTS connected_accounts_select ON public.connected_accounts;
CREATE POLICY connected_accounts_select ON public.connected_accounts
  FOR SELECT USING (
    created_by = public.requesting_user_id()
    OR (public.requesting_org_id() IS NOT NULL AND workspace_id = public.requesting_org_id())
  );

DROP POLICY IF EXISTS connected_accounts_insert ON public.connected_accounts;
CREATE POLICY connected_accounts_insert ON public.connected_accounts
  FOR INSERT WITH CHECK (
    created_by = public.requesting_user_id()
    AND (workspace_id IS NULL OR workspace_id = public.requesting_org_id())
  );

DROP POLICY IF EXISTS connected_accounts_update ON public.connected_accounts;
CREATE POLICY connected_accounts_update ON public.connected_accounts
  FOR UPDATE USING (
    created_by = public.requesting_user_id()
    OR (public.requesting_org_id() IS NOT NULL AND workspace_id = public.requesting_org_id())
  ) WITH CHECK (
    created_by = public.requesting_user_id()
    OR (public.requesting_org_id() IS NOT NULL AND workspace_id = public.requesting_org_id())
  );

DROP POLICY IF EXISTS connected_accounts_delete ON public.connected_accounts;
CREATE POLICY connected_accounts_delete ON public.connected_accounts
  FOR DELETE USING (
    created_by = public.requesting_user_id()
    OR (public.requesting_org_id() IS NOT NULL AND workspace_id = public.requesting_org_id())
  );

-- ---------------------------------------------------------------------
-- 2. SECRET STORE (service-role only; ciphertext)
-- ---------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.connected_account_secrets (
  account_id      uuid PRIMARY KEY
                    REFERENCES public.connected_accounts(id) ON DELETE CASCADE,
  -- AES-256-GCM ciphertext (base64). Nulls where a given auth type doesn't use it.
  access_token    text,
  refresh_token   text,
  api_key         text,
  token_type      text,
  expires_at      timestamptz,
  updated_at      timestamptz NOT NULL DEFAULT now()
);

-- RLS enabled, intentionally NO policies => anon/authenticated cannot touch this
-- table at all. Server-side code uses the service-role key (bypasses RLS).
ALTER TABLE public.connected_account_secrets ENABLE ROW LEVEL SECURITY;

-- Defense in depth: revoke privileges from client roles at the grant level too, so
-- the token table is locked down beyond RLS (also clears the GraphQL discoverability
-- lint). service_role keeps access.
REVOKE ALL ON public.connected_account_secrets FROM anon, authenticated;

COMMIT;
