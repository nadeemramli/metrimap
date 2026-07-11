-- =====================================================================
-- HIDE_VALUE SERVER-SIDE REDACTION — VERIFICATION HARNESS (bug-hunt #18).
-- Run AFTER migration 20260720120000_hide_value_server_redaction.sql.
--
-- Proves the security fix end-to-end:
--   * metric_cards_visible blanks `data` -> '[]'::jsonb for a viewer who is NOT
--     in a hide_value access tag's audience (and is not owner/admin).
--   * that same viewer CANNOT read metric_cards.data directly (column REVOKE).
--   * the owner (visibility admin) reads the REAL value series via the view.
--   * the view never leaks a card from a project the viewer can't reach.
--   * an UNTAGGED card's value is NOT redacted (control — targeted, not blanket).
--
-- HOW IT SIMULATES A CLERK REQUEST (same as rls_clerk_verification.sql):
--   SET LOCAL ROLE authenticated;  -- Postgres role of a JWT request
--   SELECT set_config('request.jwt.claims',
--     '{"sub":"user_X","o":{"id":"org_hv","rol":"member"}}', true);
--   => requesting_user_id()='user_X', requesting_org_id()='org_hv',
--      requesting_org_role()='member'.
--
-- Wrapped in BEGIN ... ROLLBACK so prod data is untouched. Every result row
-- must show pass = true.
--
-- NOTE FOR THE OWNER: this is a psql/`npx supabase db` harness like
-- rls_clerk_verification.sql (the TS `npm run test:rls` runner is anon-only and
-- cannot seed two tenants). Run against a DB that HAS the migration applied,
-- e.g.  psql "$DATABASE_URL" -f scripts/rls-test/rls_hide_value_redaction.sql
-- and confirm every row reports pass = true.
-- =====================================================================
BEGIN;

CREATE TEMP TABLE _r(test text, expect text, got text) ON COMMIT DROP;
GRANT INSERT, SELECT ON _r TO authenticated, anon;

-- ---- seed (runs as migration/superuser role, bypassing RLS + column REVOKE) ----
INSERT INTO public.users(id,email,name) VALUES
  ('user_OWNER','owner@x.com','Owner A'),
  ('user_VIEWER','viewer@x.com','Viewer B'),
  ('user_OTHER','other@x.com','Other C');

-- P = private project in workspace org_hv, owned by A. P_OTHER = a different
-- workspace B is not a member of.
INSERT INTO public.projects(id,name,created_by,is_public,workspace_id) VALUES
  ('11111111-1111-1111-1111-111111111111','HV project','user_OWNER',false,'org_hv'),
  ('22222222-2222-2222-2222-222222222222','Other-ws project','user_OTHER',false,'org_other');

-- Two workspace groups in org_hv. B is in Marketing only; the tag audience is
-- Finance only -> B is excluded from the value.
INSERT INTO public.workspace_groups(id,workspace_id,name,created_by) VALUES
  ('a1111111-0000-0000-0000-000000000001','org_hv','Finance','user_OWNER'),
  ('a2222222-0000-0000-0000-000000000002','org_hv','Marketing','user_OWNER');
INSERT INTO public.group_members(group_id,user_id,added_by) VALUES
  ('a2222222-0000-0000-0000-000000000002','user_VIEWER','user_OWNER');

-- hide_value access tag on P, audience = Finance.
INSERT INTO public.tags(id,name,is_access,redaction_mode,project_id,created_by) VALUES
  ('b1111111-0000-0000-0000-000000000001','Finance-only',true,'hide_value',
   '11111111-1111-1111-1111-111111111111','user_OWNER');
INSERT INTO public.tag_audiences(tag_id,group_id) VALUES
  ('b1111111-0000-0000-0000-000000000001','a1111111-0000-0000-0000-000000000001');

-- Cards: HV = tagged hide_value; CTRL = untagged control (same project); OTHER =
-- in the other workspace. All carry a real value series.
INSERT INTO public.metric_cards(id,project_id,title,category,created_by,data) VALUES
  ('c1111111-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111',
   'Secret revenue','Core/Value','user_OWNER',
   '[{"period":"2026-01","value":123}]'::jsonb),
  ('c2222222-0000-0000-0000-000000000002','11111111-1111-1111-1111-111111111111',
   'Public metric','Core/Value','user_OWNER',
   '[{"period":"2026-01","value":456}]'::jsonb),
  ('c3333333-0000-0000-0000-000000000003','22222222-2222-2222-2222-222222222222',
   'Other-ws metric','Core/Value','user_OTHER',
   '[{"period":"2026-01","value":789}]'::jsonb);
INSERT INTO public.metric_card_tags(metric_card_id,tag_id) VALUES
  ('c1111111-0000-0000-0000-000000000001','b1111111-0000-0000-0000-000000000001');

-- =================== VIEWER B (member of Marketing, NOT in the audience) ======
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims',
  '{"sub":"user_VIEWER","o":{"id":"org_hv","rol":"member"}}', true);

-- 1) The hide_value card's ROW is still visible (hide_value keeps structure)...
INSERT INTO _r SELECT 'B sees hide_value row via view','1',
  count(*)::text FROM public.metric_cards_visible
  WHERE id='c1111111-0000-0000-0000-000000000001';
-- ...but its value series is REDACTED to [].
INSERT INTO _r SELECT 'B value REDACTED via view','[]',
  (SELECT data::text FROM public.metric_cards_visible
   WHERE id='c1111111-0000-0000-0000-000000000001');
-- 2) The untagged control card's value is NOT redacted (targeted, not blanket).
INSERT INTO _r SELECT 'B sees untagged control value','has-456',
  (SELECT CASE WHEN data::text LIKE '%456%' THEN 'has-456' ELSE 'redacted' END
   FROM public.metric_cards_visible
   WHERE id='c2222222-0000-0000-0000-000000000002');
-- 3) A card in a workspace B cannot reach is NOT returned by the view.
INSERT INTO _r SELECT 'B CANNOT see other-workspace card','0',
  count(*)::text FROM public.metric_cards_visible
  WHERE id='c3333333-0000-0000-0000-000000000003';
-- 4) B CANNOT read the real value straight off the base table (column REVOKE).
DO $$ BEGIN
  BEGIN
    PERFORM data FROM public.metric_cards
      WHERE id='c1111111-0000-0000-0000-000000000001';
    INSERT INTO _r VALUES ('B base-table data read blocked','DENIED','ALLOWED(bad)');
  EXCEPTION WHEN insufficient_privilege THEN
    INSERT INTO _r VALUES ('B base-table data read blocked','DENIED','DENIED');
  END;
END $$;
RESET ROLE;

-- =================== OWNER A (visibility admin -> sees the real value) ========
SET LOCAL ROLE authenticated;
SELECT set_config('request.jwt.claims',
  '{"sub":"user_OWNER","o":{"id":"org_hv","rol":"member"}}', true);
-- Owner/admin exemption: the view returns the REAL series through the view.
INSERT INTO _r SELECT 'A sees REAL value via view','has-123',
  (SELECT CASE WHEN data::text LIKE '%123%' THEN 'has-123' ELSE 'redacted' END
   FROM public.metric_cards_visible
   WHERE id='c1111111-0000-0000-0000-000000000001');
-- The column REVOKE is unconditional for role authenticated: even the owner must
-- go through the view, never the base column.
DO $$ BEGIN
  BEGIN
    PERFORM data FROM public.metric_cards
      WHERE id='c1111111-0000-0000-0000-000000000001';
    INSERT INTO _r VALUES ('A base-table data read blocked','DENIED','ALLOWED(bad)');
  EXCEPTION WHEN insufficient_privilege THEN
    INSERT INTO _r VALUES ('A base-table data read blocked','DENIED','DENIED');
  END;
END $$;
RESET ROLE;

-- ---- RESULT: every row must be pass = true ----
SELECT test, expect, got, (got = expect) AS pass FROM _r ORDER BY pass, test;

ROLLBACK;
