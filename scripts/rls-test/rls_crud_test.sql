-- ============================================================================
-- RLS CRUD Testing Script - Infinite Recursion Detection
-- Purpose: Systematically test all CRUD operations to detect recursion issues
-- ============================================================================

-- Setup: Create test user session
-- Note: Replace 'your-test-user-id' with actual test user UUID
SET session.user_id = 'your-test-user-id-here';

-- Helper function to test if query causes infinite recursion
CREATE OR REPLACE FUNCTION test_query_for_recursion(
  query_text TEXT,
  table_name TEXT,
  operation TEXT
) RETURNS TABLE(
  test_table TEXT,
  test_operation TEXT,
  status TEXT,
  error_message TEXT,
  execution_time_ms INTEGER
) AS $$
DECLARE
  start_time TIMESTAMP;
  end_time TIMESTAMP;
  error_msg TEXT;
BEGIN
  start_time := clock_timestamp();
  
  BEGIN
    -- Set a statement timeout to catch infinite recursion
    SET statement_timeout = '5s';
    
    -- Execute the test query
    EXECUTE query_text;
    
    end_time := clock_timestamp();
    
    RETURN QUERY SELECT 
      table_name::TEXT,
      operation::TEXT,
      '✅ SUCCESS'::TEXT,
      ''::TEXT,
      EXTRACT(milliseconds FROM (end_time - start_time))::INTEGER;
      
  EXCEPTION 
    WHEN OTHERS THEN
      end_time := clock_timestamp();
      error_msg := SQLERRM;
      
      RETURN QUERY SELECT 
        table_name::TEXT,
        operation::TEXT,
        CASE 
          WHEN error_msg LIKE '%infinite recursion%' THEN '🔴 INFINITE RECURSION'
          WHEN error_msg LIKE '%statement timeout%' THEN '⏱️  TIMEOUT (Likely Recursion)'
          WHEN error_msg LIKE '%permission denied%' THEN '🔒 PERMISSION DENIED'
          ELSE '❌ ERROR'
        END::TEXT,
        error_msg::TEXT,
        EXTRACT(milliseconds FROM (end_time - start_time))::INTEGER;
  END;
  
  -- Reset timeout
  SET statement_timeout = 0;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Test Suite: All Tables and Operations
-- ============================================================================

-- 1. USERS TABLE TESTS
SELECT '=== TESTING USERS TABLE ===' as test_section;

SELECT * FROM test_query_for_recursion(
  'SELECT * FROM users LIMIT 1',
  'users',
  'SELECT'
);

SELECT * FROM test_query_for_recursion(
  'INSERT INTO users (id, email, name) VALUES (gen_random_uuid(), ''test@example.com'', ''Test User'')',
  'users', 
  'INSERT'
);

-- 2. PROJECTS TABLE TESTS  
SELECT '=== TESTING PROJECTS TABLE ===' as test_section;

SELECT * FROM test_query_for_recursion(
  'SELECT * FROM projects LIMIT 1',
  'projects',
  'SELECT'
);

SELECT * FROM test_query_for_recursion(
  'INSERT INTO projects (name, created_by) VALUES (''Test Project'', auth.uid())',
  'projects',
  'INSERT'
);

SELECT * FROM test_query_for_recursion(
  'UPDATE projects SET description = ''Test Description'' WHERE created_by = auth.uid() LIMIT 1',
  'projects',
  'UPDATE'
);

-- 3. PROJECT_COLLABORATORS TABLE TESTS
SELECT '=== TESTING PROJECT_COLLABORATORS TABLE ===' as test_section;

SELECT * FROM test_query_for_recursion(
  'SELECT * FROM project_collaborators LIMIT 1',
  'project_collaborators',
  'SELECT'
);

-- Test the complex project_collaborators query that often causes issues
SELECT * FROM test_query_for_recursion(
  'SELECT p.*, pc.role FROM projects p LEFT JOIN project_collaborators pc ON p.id = pc.project_id WHERE p.created_by = auth.uid() OR pc.user_id = auth.uid()',
  'project_collaborators',
  'COMPLEX_JOIN'
);

-- 4. METRIC_CARDS TABLE TESTS
SELECT '=== TESTING METRIC_CARDS TABLE ===' as test_section;

SELECT * FROM test_query_for_recursion(
  'SELECT * FROM metric_cards LIMIT 1',
  'metric_cards',
  'SELECT'
);

SELECT * FROM test_query_for_recursion(
  'INSERT INTO metric_cards (title, category, created_by, project_id) SELECT ''Test Card'', ''Core/Value'', auth.uid(), id FROM projects WHERE created_by = auth.uid() LIMIT 1',
  'metric_cards',
  'INSERT'
);

-- 5. RELATIONSHIPS TABLE TESTS
SELECT '=== TESTING RELATIONSHIPS TABLE ===' as test_section;

SELECT * FROM test_query_for_recursion(
  'SELECT * FROM relationships LIMIT 1',
  'relationships',
  'SELECT'
);

-- 6. EVIDENCE_ITEMS TABLE TESTS
SELECT '=== TESTING EVIDENCE_ITEMS TABLE ===' as test_section;

SELECT * FROM test_query_for_recursion(
  'SELECT * FROM evidence_items LIMIT 1',
  'evidence_items',
  'SELECT'
);

-- 7. GROUPS TABLE TESTS
SELECT '=== TESTING GROUPS TABLE ===' as test_section;

SELECT * FROM test_query_for_recursion(
  'SELECT * FROM groups LIMIT 1',
  'groups',
  'SELECT'
);

-- 8. CHANGELOG TABLE TESTS
SELECT '=== TESTING CHANGELOG TABLE ===' as test_section;

SELECT * FROM test_query_for_recursion(
  'SELECT * FROM changelog LIMIT 1',
  'changelog',
  'SELECT'
);

-- ============================================================================
-- Stress Tests: Complex Cross-Table Queries
-- ============================================================================

SELECT '=== STRESS TESTING COMPLEX QUERIES ===' as test_section;

-- Test 1: Deep nested project access query
SELECT * FROM test_query_for_recursion(
  'SELECT p.*, pc.*, mc.*, r.* FROM projects p 
   LEFT JOIN project_collaborators pc ON p.id = pc.project_id 
   LEFT JOIN metric_cards mc ON p.id = mc.project_id 
   LEFT JOIN relationships r ON p.id = r.project_id 
   WHERE p.created_by = auth.uid() OR pc.user_id = auth.uid() LIMIT 1',
  'multi_table',
  'DEEP_JOIN_STRESS_TEST'
);

-- Test 2: Recursive project access pattern  
SELECT * FROM test_query_for_recursion(
  'WITH RECURSIVE project_access AS (
     SELECT id FROM projects WHERE created_by = auth.uid()
     UNION
     SELECT pc.project_id FROM project_collaborators pc 
     JOIN project_access pa ON pc.project_id = pa.id 
     WHERE pc.user_id = auth.uid()
   ) SELECT * FROM project_access LIMIT 10',
  'projects',
  'RECURSIVE_CTE_TEST'
);

-- Test 3: Project collaborator circular reference test
SELECT * FROM test_query_for_recursion(
  'SELECT pc1.* FROM project_collaborators pc1 
   WHERE pc1.project_id IN (
     SELECT pc2.project_id FROM project_collaborators pc2 
     WHERE pc2.user_id = auth.uid() 
     AND pc2.project_id IN (
       SELECT p.id FROM projects p WHERE p.created_by = auth.uid()
     )
   ) LIMIT 1',
  'project_collaborators',
  'CIRCULAR_REFERENCE_TEST'
);

-- ============================================================================
-- Summary Report
-- ============================================================================

SELECT '=== TEST SUMMARY REPORT ===' as test_section;

-- This would need to be run after collecting all results
-- For now, just show table and policy counts
SELECT 
  'SCHEMA_SUMMARY' as report_type,
  COUNT(DISTINCT tablename) as total_tables_with_rls,
  COUNT(*) as total_policies,
  COUNT(CASE WHEN cmd = 'SELECT' THEN 1 END) as select_policies,
  COUNT(CASE WHEN cmd = 'INSERT' THEN 1 END) as insert_policies,
  COUNT(CASE WHEN cmd = 'UPDATE' THEN 1 END) as update_policies,
  COUNT(CASE WHEN cmd = 'DELETE' THEN 1 END) as delete_policies
FROM pg_policies 
WHERE schemaname = 'public';

-- Clean up test function
DROP FUNCTION IF EXISTS test_query_for_recursion(TEXT, TEXT, TEXT);