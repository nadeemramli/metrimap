-- Focused validation of the Postgres semantics the #18 migration relies on.
\set ON_ERROR_STOP on

CREATE ROLE authenticated NOLOGIN;

CREATE SCHEMA app;
CREATE OR REPLACE FUNCTION app.viewer() RETURNS text
  LANGUAGE sql STABLE AS $$ SELECT current_setting('app.viewer', true) $$;

CREATE TABLE public.metric_cards (
  id uuid PRIMARY KEY,
  project_id uuid NOT NULL,
  title text NOT NULL,
  data jsonb DEFAULT '[]'::jsonb
);

-- project membership: viewer 'A' sees project P1; 'B' sees P2; 'ADMIN' sees all.
CREATE OR REPLACE FUNCTION public.can_view_project(pid uuid) RETURNS boolean
  LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT (app.viewer() = 'A' AND pid = 'aaaaaaaa-0000-0000-0000-000000000001'::uuid)
      OR (app.viewer() = 'B' AND pid = 'bbbbbbbb-0000-0000-0000-000000000002'::uuid)
      OR app.viewer() = 'ADMIN';
$$;
CREATE OR REPLACE FUNCTION public.node_hidden_from_me(cid uuid) RETURNS boolean
  LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT app.viewer() = 'B' AND cid = '33333333-3333-3333-3333-333333333333'::uuid;
$$;
CREATE OR REPLACE FUNCTION public.node_visible_to_me(cid uuid) RETURNS boolean
  LANGUAGE sql STABLE SECURITY DEFINER AS $$
  SELECT NOT (app.viewer() = 'B' AND cid = '11111111-1111-1111-1111-111111111111'::uuid);
$$;

INSERT INTO public.metric_cards VALUES
  ('11111111-1111-1111-1111-111111111111','bbbbbbbb-0000-0000-0000-000000000002','Finance MRR','[{"v":999}]'),
  ('22222222-2222-2222-2222-222222222222','bbbbbbbb-0000-0000-0000-000000000002','Public','[{"v":1}]'),
  ('33333333-3333-3333-3333-333333333333','bbbbbbbb-0000-0000-0000-000000000002','Hidden','[{"v":7}]'),
  ('44444444-4444-4444-4444-444444444444','aaaaaaaa-0000-0000-0000-000000000001','OtherProj','[{"v":5}]');

ALTER TABLE public.metric_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY mc_sel ON public.metric_cards FOR SELECT TO authenticated
  USING (public.can_view_project(project_id) AND NOT public.node_hidden_from_me(id));
GRANT SELECT ON public.metric_cards TO authenticated;
-- Column-level REVOKE is a NO-OP while a table-wide SELECT grant exists, so drop
-- the table grant and re-grant every column EXCEPT data explicitly.
REVOKE SELECT ON public.metric_cards FROM authenticated;
GRANT SELECT (id, project_id, title) ON public.metric_cards TO authenticated;

CREATE OR REPLACE VIEW public.metric_cards_visible
WITH (security_invoker = false) AS
SELECT mc.id, mc.project_id, mc.title,
  CASE WHEN public.node_visible_to_me(mc.id) THEN mc.data ELSE '[]'::jsonb END AS data
FROM public.metric_cards mc
WHERE public.can_view_project(mc.project_id) AND NOT public.node_hidden_from_me(mc.id);
GRANT SELECT ON public.metric_cards_visible TO authenticated;
GRANT USAGE ON SCHEMA app TO authenticated;
GRANT EXECUTE ON FUNCTION app.viewer(), public.can_view_project(uuid),
  public.node_hidden_from_me(uuid), public.node_visible_to_me(uuid) TO authenticated;

SET ROLE authenticated;
SET app.viewer = 'B';

DO $$ BEGIN
  PERFORM data FROM public.metric_cards WHERE id='11111111-1111-1111-1111-111111111111';
  RAISE EXCEPTION 'FAIL 1: direct data read should have been denied';
EXCEPTION WHEN insufficient_privilege THEN RAISE NOTICE 'PASS 1: direct data read denied'; END $$;

DO $$ DECLARE d jsonb; BEGIN
  SELECT data INTO d FROM public.metric_cards_visible WHERE id='11111111-1111-1111-1111-111111111111';
  IF d = '[]'::jsonb THEN RAISE NOTICE 'PASS 2: secret data redacted for B'; ELSE RAISE EXCEPTION 'FAIL 2: got %', d; END IF;
END $$;

DO $$ DECLARE d jsonb; BEGIN
  SELECT data INTO d FROM public.metric_cards_visible WHERE id='22222222-2222-2222-2222-222222222222';
  IF d = '[{"v": 1}]'::jsonb THEN RAISE NOTICE 'PASS 3: plain data NOT redacted'; ELSE RAISE EXCEPTION 'FAIL 3: got %', d; END IF;
END $$;

DO $$ DECLARE n int; BEGIN
  SELECT count(*) INTO n FROM public.metric_cards_visible WHERE id='33333333-3333-3333-3333-333333333333';
  IF n = 0 THEN RAISE NOTICE 'PASS 4: hide_node row excluded'; ELSE RAISE EXCEPTION 'FAIL 4: hide_node visible'; END IF;
END $$;

DO $$ DECLARE n int; BEGIN
  SELECT count(*) INTO n FROM public.metric_cards_visible WHERE id='44444444-4444-4444-4444-444444444444';
  IF n = 0 THEN RAISE NOTICE 'PASS 5: cross-project card not leaked'; ELSE RAISE EXCEPTION 'FAIL 5: cross-project LEAK'; END IF;
END $$;

SET app.viewer = 'ADMIN';
DO $$ DECLARE d jsonb; BEGIN
  SELECT data INTO d FROM public.metric_cards_visible WHERE id='11111111-1111-1111-1111-111111111111';
  IF d = '[{"v": 999}]'::jsonb THEN RAISE NOTICE 'PASS 6: admin sees real value'; ELSE RAISE EXCEPTION 'FAIL 6: got %', d; END IF;
END $$;

SET app.viewer = 'B';
DO $$ DECLARE t text; BEGIN
  SELECT title INTO t FROM public.metric_cards WHERE id='22222222-2222-2222-2222-222222222222';
  IF t = 'Public' THEN RAISE NOTICE 'PASS 7: non-data column still readable'; ELSE RAISE EXCEPTION 'FAIL 7'; END IF;
END $$;

RESET ROLE;
SELECT 'ALL SEMANTIC CHECKS PASSED' AS result;
