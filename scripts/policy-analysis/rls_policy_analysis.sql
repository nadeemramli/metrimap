-- ============================================================================
-- RLS Policy Dependency Analysis Script
-- Purpose: Detect potential infinite recursion patterns in RLS policies
-- ============================================================================

-- 1. Policy Dependency Analysis
-- Extract table references from each policy to identify potential cycles
WITH policy_dependencies AS (
  SELECT 
    schemaname,
    tablename as source_table,
    policyname,
    cmd,
    REGEXP_MATCHES(
      COALESCE(qual, with_check), 
      'FROM\s+([a-zA-Z_][a-zA-Z0-9_]*)', 
      'gi'
    ) as referenced_table_match
  FROM pg_policies 
  WHERE schemaname = 'public'
),
policy_refs AS (
  SELECT 
    schemaname,
    source_table,
    policyname,
    cmd,
    referenced_table_match[1] as referenced_table
  FROM policy_dependencies
  WHERE referenced_table_match IS NOT NULL
),
-- Find potential circular dependencies
circular_deps AS (
  SELECT DISTINCT
    p1.source_table as table_a,
    p1.referenced_table as table_b,
    p2.source_table as table_b_check,
    p2.referenced_table as table_a_check
  FROM policy_refs p1
  JOIN policy_refs p2 ON p1.referenced_table = p2.source_table 
                     AND p2.referenced_table = p1.source_table
  WHERE p1.source_table != p1.referenced_table -- Avoid self-references
)
SELECT 
  '🔴 POTENTIAL CIRCULAR DEPENDENCY DETECTED!' as alert,
  table_a,
  table_b,
  CONCAT(table_a, ' → ', table_b, ' → ', table_a) as cycle_path
FROM circular_deps

UNION ALL

-- 2. Self-Referencing Policies (High Risk)
SELECT 
  '⚠️  SELF-REFERENCING POLICY' as alert,
  source_table as table_a,
  referenced_table as table_b,
  CONCAT(source_table, ' references itself in policy: ', policyname) as cycle_path
FROM policy_refs
WHERE source_table = referenced_table

UNION ALL

-- 3. Complex Nested Subqueries (Medium Risk)
SELECT 
  '⚡ COMPLEX NESTED POLICY' as alert,
  tablename as table_a,
  'N/A' as table_b,
  CONCAT('Policy ', policyname, ' has complex nesting (>3 levels)') as cycle_path
FROM pg_policies 
WHERE schemaname = 'public'
  AND (
    LENGTH(COALESCE(qual, with_check)) - LENGTH(REPLACE(COALESCE(qual, with_check), 'SELECT', ''))
  ) / LENGTH('SELECT') > 3

ORDER BY alert, table_a;

-- ============================================================================
-- 4. Detailed Policy Structure Analysis
-- ============================================================================

SELECT 
  '📊 POLICY STRUCTURE REPORT' as section,
  tablename,
  policyname,
  cmd,
  CASE 
    WHEN COALESCE(qual, with_check) LIKE '%project_collaborators%' 
     AND COALESCE(qual, with_check) LIKE '%projects%' THEN '🔴 HIGH RISK: Cross-references both tables'
    WHEN COALESCE(qual, with_check) LIKE '%' || tablename || '%' THEN '⚠️  MEDIUM RISK: Self-referencing'
    WHEN LENGTH(COALESCE(qual, with_check)) > 500 THEN '⚡ COMPLEX: Very long policy'
    ELSE '✅ LOW RISK: Simple policy'
  END as risk_level,
  LENGTH(COALESCE(qual, with_check)) as policy_length
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY 
  CASE 
    WHEN COALESCE(qual, with_check) LIKE '%project_collaborators%' 
     AND COALESCE(qual, with_check) LIKE '%projects%' THEN 1
    WHEN COALESCE(qual, with_check) LIKE '%' || tablename || '%' THEN 2
    WHEN LENGTH(COALESCE(qual, with_check)) > 500 THEN 3
    ELSE 4
  END,
  tablename, cmd;

-- ============================================================================
-- 5. Policy Performance Analysis
-- ============================================================================

SELECT 
  '⏱️  PERFORMANCE ANALYSIS' as section,
  tablename,
  policyname,
  cmd,
  -- Count subqueries
  (LENGTH(COALESCE(qual, with_check)) - LENGTH(REPLACE(COALESCE(qual, with_check), 'SELECT', ''))) / LENGTH('SELECT') as subquery_count,
  -- Count JOINs
  (LENGTH(COALESCE(qual, with_check)) - LENGTH(REPLACE(UPPER(COALESCE(qual, with_check)), 'JOIN', ''))) / LENGTH('JOIN') as join_count,
  -- Check for OR conditions (can be slow)
  CASE WHEN COALESCE(qual, with_check) LIKE '%OR%' THEN 'YES' ELSE 'NO' END as has_or_conditions,
  CASE 
    WHEN (LENGTH(COALESCE(qual, with_check)) - LENGTH(REPLACE(COALESCE(qual, with_check), 'SELECT', ''))) / LENGTH('SELECT') > 3 THEN '🔴 HIGH: Too many subqueries'
    WHEN (LENGTH(COALESCE(qual, with_check)) - LENGTH(REPLACE(UPPER(COALESCE(qual, with_check)), 'JOIN', ''))) / LENGTH('JOIN') > 2 THEN '⚠️  MEDIUM: Many JOINs'
    WHEN COALESCE(qual, with_check) LIKE '%OR%' THEN '⚡ MEDIUM: OR conditions can be slow'
    ELSE '✅ GOOD: Simple and fast'
  END as performance_risk
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY subquery_count DESC, join_count DESC;