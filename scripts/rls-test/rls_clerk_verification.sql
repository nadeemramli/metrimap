-- =====================================================================
-- VERIFICATION HARNESS  (run AFTER the migration).
-- Wrapped in BEGIN ... ROLLBACK: seeds Clerk users + projects, exercises RLS as role
-- 'authenticated' (two tenants, a view-only 'member' collaborator, and a write-capable
-- 'admin'-role collaborator) and as 'anon', then ROLLS BACK so prod data is untouched.
--
-- HOW IT SIMULATES A CLERK REQUEST:
--   SET LOCAL ROLE authenticated;  -- Postgres role of a JWT request
--   SELECT set_config('request.jwt.claims','{"sub":"user_AAA"}', true);  -- Clerk sub
--   => public.requesting_user_id() returns 'user_AAA'.
-- For anon: SET LOCAL ROLE anon; claims='{}' (no sub) => requesting_user_id() = NULL.
--
-- All seed literals respect live CHECK/NOT NULL constraints:
--   project_collaborators.role IN (owner|admin|member|viewer); canvas_nodes.node_type IN
--   (commentNode|sourceNode|chartNode|operatorNode|whiteboardNode) and requires position_x/y;
--   changelog requires action/target/target_name/description NOT NULL.
-- Every row of the final result must show pass = true.
-- =====================================================================
BEGIN;

CREATE TEMP TABLE _r(test text, expect text, got text) ON COMMIT DROP;
GRANT INSERT, SELECT ON _r TO authenticated, anon;

-- ---- seed (runs as migration/superuser role, bypassing RLS) ----
INSERT INTO public.users(id,email,name) VALUES
  ('user_AAA','a@x.com','A'),('user_BBB','b@x.com','B'),
  ('user_CCC','c@x.com','C'),('user_DDD','d@x.com','D');
INSERT INTO public.projects(id,name,created_by,is_public) VALUES
  ('11111111-1111-1111-1111-111111111111','Aprivate','user_AAA',false),
  ('22222222-2222-2222-2222-222222222222','Bprivate','user_BBB',false),
  ('33333333-3333-3333-3333-333333333333','Apublic','user_AAA',true);
-- C = VIEW-ONLY (role member, permissions ['read']); D = WRITE-CAPABLE (role admin, permissions ['read'])
INSERT INTO public.project_collaborators(project_id,user_id,role,permissions) VALUES
  ('11111111-1111-1111-1111-111111111111','user_CCC','member',ARRAY['read']::text[]),
  ('11111111-1111-1111-1111-111111111111','user_DDD','admin', ARRAY['read']::text[]);
INSERT INTO public.metric_cards(id,project_id,title,category,created_by) VALUES
  ('aaaaaaaa-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111','Acard','Core/Value','user_AAA'),
  ('bbbbbbbb-0000-0000-0000-000000000001','22222222-2222-2222-2222-222222222222','Bcard','Core/Value','user_BBB'),
  ('cccccccc-0000-0000-0000-000000000001','33333333-3333-3333-3333-333333333333','Pubcard','Core/Value','user_AAA');
INSERT INTO public.canvas_nodes(id,project_id,node_type,position_x,position_y,created_by) VALUES
  ('dddddddd-0000-0000-0000-000000000001','11111111-1111-1111-1111-111111111111','chartNode',0,0,'user_AAA');
-- target-only changelog row owned by A (project_id NULL, user_id = A's Clerk id)
INSERT INTO public.changelog(id,project_id,target_id,target,target_name,action,description,user_id)
  VALUES (gen_random_uuid(), NULL,'eeeeeeee-0000-0000-0000-000000000001','relationship','rel','created','x','user_AAA');
-- notification for A (user_id is now TEXT post-migration)
INSERT INTO public.notifications(id,user_id,type) VALUES (gen_random_uuid(),'user_AAA','mention');

-- =================== TENANT A (owner of projects 1 & 3) ===================
SET LOCAL ROLE authenticated; SELECT set_config('request.jwt.claims','{"sub":"user_AAA"}', true);
INSERT INTO _r SELECT 'A sees own private','1',count(*)::text FROM public.projects WHERE id='11111111-1111-1111-1111-111111111111';
INSERT INTO _r SELECT 'A CANNOT see B private','0',count(*)::text FROM public.projects WHERE id='22222222-2222-2222-2222-222222222222';
INSERT INTO _r SELECT 'A visible projects = own2','2',count(*)::text FROM public.projects;
INSERT INTO _r SELECT 'A sees own canvas_node (was locked)','1',count(*)::text FROM public.canvas_nodes WHERE id='dddddddd-0000-0000-0000-000000000001';
INSERT INTO _r SELECT 'A sees own target-only changelog','1',count(*)::text FROM public.changelog WHERE target_id='eeeeeeee-0000-0000-0000-000000000001';
INSERT INTO _r SELECT 'A sees own notification (now works)','1',count(*)::text FROM public.notifications;
UPDATE public.metric_cards SET title='Acard2' WHERE id='aaaaaaaa-0000-0000-0000-000000000001';
INSERT INTO _r SELECT 'A updated own card','Acard2',(SELECT title FROM public.metric_cards WHERE id='aaaaaaaa-0000-0000-0000-000000000001');
WITH u AS (UPDATE public.metric_cards SET title='HACK' WHERE id='bbbbbbbb-0000-0000-0000-000000000001' RETURNING 1)
INSERT INTO _r SELECT 'A CANNOT update B card','0',(SELECT count(*)::text FROM u);
INSERT INTO public.metric_cards(project_id,title,category,created_by)
  VALUES ('11111111-1111-1111-1111-111111111111','new','Core/Value','user_AAA');
INSERT INTO _r VALUES ('A insert into own project','ok','ok');
RESET ROLE;

-- =================== TENANT B (cannot reach A private; sees only A public) ===================
SET LOCAL ROLE authenticated; SELECT set_config('request.jwt.claims','{"sub":"user_BBB"}', true);
INSERT INTO _r SELECT 'B CANNOT see A private','0',count(*)::text FROM public.projects WHERE id='11111111-1111-1111-1111-111111111111';
INSERT INTO _r SELECT 'B SEES A public (is_public share)','1',count(*)::text FROM public.projects WHERE id='33333333-3333-3333-3333-333333333333';
INSERT INTO _r SELECT 'B sees A public card','1',count(*)::text FROM public.metric_cards WHERE id='cccccccc-0000-0000-0000-000000000001';
INSERT INTO _r SELECT 'B CANNOT see A private canvas_node','0',count(*)::text FROM public.canvas_nodes WHERE id='dddddddd-0000-0000-0000-000000000001';
INSERT INTO _r SELECT 'B CANNOT see A notification','0',count(*)::text FROM public.notifications;
INSERT INTO _r SELECT 'B CANNOT see A target-only changelog','0',count(*)::text FROM public.changelog;
RESET ROLE;

-- B cross-tenant INSERT into A project must be rejected (WITH CHECK violation)
DO $$ BEGIN
  SET LOCAL ROLE authenticated; PERFORM set_config('request.jwt.claims','{"sub":"user_BBB"}', true);
  BEGIN
    INSERT INTO public.metric_cards(project_id,title,category,created_by)
      VALUES ('11111111-1111-1111-1111-111111111111','evil','Core/Value','user_BBB');
    INSERT INTO _r VALUES ('B insert into A project','BLOCKED','ALLOWED(bad)');
  EXCEPTION WHEN insufficient_privilege OR check_violation THEN
    INSERT INTO _r VALUES ('B insert into A project','BLOCKED','BLOCKED');
  END;
  RESET ROLE;
END $$;

-- =================== COLLABORATOR C (view-only member on project 1) ===================
SET LOCAL ROLE authenticated; SELECT set_config('request.jwt.claims','{"sub":"user_CCC"}', true);
INSERT INTO _r SELECT 'C member sees A private','1',count(*)::text FROM public.projects WHERE id='11111111-1111-1111-1111-111111111111';
INSERT INTO _r SELECT 'C member sees A card','1',count(*)::text FROM public.metric_cards WHERE id='aaaaaaaa-0000-0000-0000-000000000001';
INSERT INTO _r SELECT 'C member sees A canvas_node (was locked)','1',count(*)::text FROM public.canvas_nodes WHERE id='dddddddd-0000-0000-0000-000000000001';
WITH u AS (UPDATE public.metric_cards SET title='cchack' WHERE id='aaaaaaaa-0000-0000-0000-000000000001' RETURNING 1)
INSERT INTO _r SELECT 'C view-only CANNOT update card','0',(SELECT count(*)::text FROM u);
-- self-reference resolves with NO recursion error; project 1 has 2 collaborators (C and D)
INSERT INTO _r SELECT 'C sees all collab rows on project (recursion-safe)','2',count(*)::text
  FROM public.project_collaborators WHERE project_id='11111111-1111-1111-1111-111111111111';
RESET ROLE;

-- =================== COLLABORATOR D (admin role, permissions only ['read']) -> CAN write ===================
SET LOCAL ROLE authenticated; SELECT set_config('request.jwt.claims','{"sub":"user_DDD"}', true);
INSERT INTO _r SELECT 'D admin-role sees A private','1',count(*)::text FROM public.projects WHERE id='11111111-1111-1111-1111-111111111111';
WITH u AS (UPDATE public.metric_cards SET title='dedit' WHERE id='aaaaaaaa-0000-0000-0000-000000000001' RETURNING 1)
INSERT INTO _r SELECT 'D admin-role CAN update card (role-based write)','1',(SELECT count(*)::text FROM u);
DO $$ BEGIN
  BEGIN
    INSERT INTO public.canvas_nodes(project_id,node_type,position_x,position_y,created_by)
      VALUES ('11111111-1111-1111-1111-111111111111','chartNode',1,1,'user_DDD');
    INSERT INTO _r VALUES ('D admin-role CAN insert canvas_node','ok','ok');
  EXCEPTION WHEN OTHERS THEN
    INSERT INTO _r VALUES ('D admin-role CAN insert canvas_node','ok','FAIL:'||SQLERRM);
  END;
END $$;
RESET ROLE;

-- =================== ANON (publishable key, no JWT) ===================
SET LOCAL ROLE anon; SELECT set_config('request.jwt.claims','{}', true);  -- no 'sub' => requesting_user_id() = NULL
INSERT INTO _r SELECT 'anon sees ONLY is_public project','1',count(*)::text FROM public.projects;
INSERT INTO _r SELECT 'anon: that project is the public one','33333333-3333-3333-3333-333333333333',max(id::text) FROM public.projects;
INSERT INTO _r SELECT 'anon sees public project card','1',count(*)::text FROM public.metric_cards;
INSERT INTO _r SELECT 'anon CANNOT see private canvas_node','0',count(*)::text FROM public.canvas_nodes WHERE id='dddddddd-0000-0000-0000-000000000001';
INSERT INTO _r SELECT 'anon CANNOT see target-only changelog','0',count(*)::text FROM public.changelog;
INSERT INTO _r SELECT 'anon NO notifications access','0',count(*)::text FROM public.notifications;
RESET ROLE;

-- ---- RESULT: every row must be pass=true ----
SELECT test, expect, got, (got = expect) AS pass FROM _r ORDER BY pass, test;

ROLLBACK;