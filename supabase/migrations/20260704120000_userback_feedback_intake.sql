-- =====================================================================
-- USER & OPS SIGNALS INTAKE — Userback feedback -> Linear Customer Requests.
-- `userback_feedback` is the raw, insert-only evidence store + idempotency/sync
-- ledger for the `userback-customer-requests` edge function (the ONLY holder of
-- the Linear API key). The browser never touches this table — Userback POSTs the
-- edge function directly. RLS is ON with NO policies: only the service role (the
-- edge function) can read/write. Deduped by the Userback feedback id.
-- See docs/features/userback-customer-requests.md.
-- =====================================================================
BEGIN;

CREATE TABLE IF NOT EXISTS public.userback_feedback (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Userback's own feedback id — unique so repeat webhook deliveries no-op.
  userback_id             text NOT NULL UNIQUE,
  reporter_email          text,
  reporter_name           text,
  -- email domain -> Linear Customer mapping key (company domains only).
  reporter_domain         text,
  title                   text,
  body                    text,
  rating                  integer,
  category                text,
  page_url                text,
  -- full normalized Userback payload for audit / replay.
  raw                     jsonb,
  -- Linear sync metadata (server-side bridge only)
  linear_customer_id      text,
  linear_issue_id         text,
  linear_issue_identifier text,
  linear_issue_url        text,
  linear_need_id          text,
  sync_status             text NOT NULL DEFAULT 'pending'
                            CHECK (sync_status IN ('pending','synced','failed','skipped')),
  sync_error              text,
  linear_synced_at        timestamptz,
  created_at              timestamptz NOT NULL DEFAULT now(),
  updated_at              timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_userback_feedback_sync_status
  ON public.userback_feedback (sync_status);
-- Lookup used to reuse an existing Customer for a company domain.
CREATE INDEX IF NOT EXISTS idx_userback_feedback_reporter_domain
  ON public.userback_feedback (reporter_domain);

-- Client can never touch this table: RLS on, no policies. The edge function
-- writes via service_role (bypasses RLS).
ALTER TABLE public.userback_feedback ENABLE ROW LEVEL SECURITY;

-- ---------------------------------------------------------------------
-- Read sync secrets from Vault (no function-secret env required). Mirrors
-- public.error_sync_config(). Deno.env still wins if set. Execute restricted to
-- service_role, so only the edge function can read the secrets. Set with:
--   select vault.create_secret('<linear-api-key>', 'linear_api_key');
--   select vault.create_secret('<team-uuid>',      'linear_team_id');
--   select vault.create_secret('<shared-secret>',  'userback_sync_secret');
-- (linear_api_key / linear_team_id are shared with error_sync_config.)
-- ---------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.userback_sync_config()
RETURNS TABLE (
  linear_api_key       text,
  linear_team_id       text,
  userback_sync_secret text
)
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'linear_api_key'),
    (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'linear_team_id'),
    (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'userback_sync_secret');
$$;

REVOKE ALL ON FUNCTION public.userback_sync_config() FROM public, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.userback_sync_config() TO service_role;

COMMIT;
