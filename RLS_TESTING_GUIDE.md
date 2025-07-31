# 🔍 RLS Infinite Recursion Testing Guide

This guide provides comprehensive tools and strategies to detect, prevent, and fix infinite recursion patterns in PostgreSQL Row Level Security (RLS) policies.

## 📋 Summary of Testing Tools

### 1. **SQL Policy Analysis Script** (`rls_policy_analysis.sql`)
**Purpose**: Database-level analysis to detect policy dependencies and circular references.

**Features**:
- ✅ Detects circular dependencies between tables
- ✅ Identifies self-referencing policies
- ✅ Analyzes policy complexity and performance risks
- ✅ Provides risk assessment for each policy

**Usage**:
```sql
-- Run in Supabase SQL editor or psql
\i rls_policy_analysis.sql
```

### 2. **CRUD Testing Script** (`rls_crud_test.sql`)
**Purpose**: Systematic testing of all CRUD operations with timeout protection.

**Features**:
- ✅ Tests all tables and operations
- ✅ Detects infinite recursion via timeout
- ✅ Stress tests complex queries
- ✅ Performance analysis

**Usage**:
```sql
-- Replace 'your-test-user-id' with actual UUID
-- Run in Supabase SQL editor
\i rls_crud_test.sql
```

### 3. **Application-Level Test Suite** (`src/tests/rls-recursion-test.ts`)
**Purpose**: TypeScript testing through Supabase client to catch runtime issues.

**Features**:
- ✅ Tests through actual application queries
- ✅ Timeout protection (5 second default)
- ✅ Categorizes different types of errors
- ✅ Comprehensive reporting

**Usage**:
```bash
# Add to package.json scripts:
"test:rls": "tsx src/tests/run-rls-tests.ts"

# Run the tests:
npm run test:rls
```

### 4. **Easy Test Runner** (`src/tests/run-rls-tests.ts`)
**Purpose**: Simple command-line interface to run all tests.

## 🎯 How to Use This Testing Suite

### **Step 1: Run Policy Analysis**
```sql
-- In Supabase SQL Editor, execute the analysis script
-- This will show you potential problem areas
```

### **Step 2: Run Application Tests**
```bash
npm run test:rls
```

### **Step 3: Review Results**
Look for these warning signs:
- 🔴 **INFINITE_RECURSION**: Critical - fix immediately
- ⏱️  **TIMEOUT**: Likely recursion or performance issue
- ⚠️  **CIRCULAR DEPENDENCY**: High risk for recursion

### **Step 4: Fix Issues**
Use the patterns and solutions in this guide.

## 🛠️ Common RLS Recursion Patterns & Solutions

### ❌ **Problem Pattern 1: Cross-Table Circular Dependencies**
```sql
-- PROBLEMATIC: projects references project_collaborators
CREATE POLICY "projects_policy" ON projects
FOR SELECT USING (
  created_by = auth.uid() OR
  id IN (SELECT project_id FROM project_collaborators WHERE user_id = auth.uid())
);

-- PROBLEMATIC: project_collaborators references projects  
CREATE POLICY "collaborators_policy" ON project_collaborators
FOR SELECT USING (
  project_id IN (SELECT id FROM projects WHERE created_by = auth.uid())
);
```

**Result**: `projects → project_collaborators → projects` (infinite loop)

### ✅ **Solution 1: Break Cross-References**
```sql
-- SOLUTION: Only direct ownership in RLS
CREATE POLICY "projects_policy" ON projects
FOR SELECT USING (
  created_by = auth.uid()  -- Only direct ownership
);

-- Handle collaboration in application code:
-- 1. Query owned projects
-- 2. Query collaborated projects separately  
-- 3. Combine in TypeScript
```

### ❌ **Problem Pattern 2: Self-Referencing Policies**
```sql
-- PROBLEMATIC: Table references itself
CREATE POLICY "self_ref_policy" ON project_collaborators
FOR UPDATE USING (
  project_id IN (
    SELECT project_id FROM project_collaborators  -- SELF-REFERENCE!
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);
```

### ✅ **Solution 2: Remove Self-References**
```sql
-- SOLUTION: Direct field checks only
CREATE POLICY "simple_policy" ON project_collaborators
FOR UPDATE USING (
  project_id IN (
    SELECT id FROM projects WHERE created_by = auth.uid()  -- Reference other table
  )
);
```

## 🚨 **Our Specific Solution for Metric Mapping**

### **Problem We Solved**:
- `projects` policies referenced `project_collaborators`
- `project_collaborators` policies referenced `projects`
- Created unavoidable circular dependency

### **Solution Applied**:
1. **Projects RLS**: Only direct ownership (`created_by = auth.uid()`)
2. **Application Logic**: Handle collaboration access in TypeScript
3. **Benefits**: 
   - ✅ No circular dependencies
   - ✅ Better performance
   - ✅ Easier to debug
   - ✅ More maintainable

## 📊 **Policy Risk Assessment Matrix**

| Risk Level | Description | Action Required |
|------------|-------------|-----------------|
| 🔴 **HIGH** | Cross-references both tables | Fix immediately |
| ⚠️  **MEDIUM** | Self-referencing | Review and simplify |
| ⚡ **COMPLEX** | Very long policies (>500 chars) | Consider breaking down |
| ✅ **LOW** | Simple, direct checks | Monitor only |

## 🔍 **Detection Commands**

### **Quick Health Check**:
```sql
-- Run this to get a quick policy health overview
SELECT 
  tablename,
  COUNT(*) as policy_count,
  COUNT(CASE WHEN LENGTH(COALESCE(qual, with_check)) > 500 THEN 1 END) as complex_policies
FROM pg_policies 
WHERE schemaname = 'public'
GROUP BY tablename;
```

### **Detect Cross-References**:
```sql
-- Find policies that reference other tables
SELECT 
  tablename as source_table,
  policyname,
  COALESCE(qual, with_check) as policy_definition
FROM pg_policies 
WHERE schemaname = 'public'
  AND (COALESCE(qual, with_check) LIKE '%FROM %'
       OR COALESCE(qual, with_check) LIKE '%JOIN %');
```

## 🎉 **Success Criteria**

Your RLS policies are safe when:
- ✅ No circular dependencies detected
- ✅ No self-referencing policies
- ✅ All CRUD tests pass without timeout
- ✅ Application queries execute in <100ms
- ✅ No `42P17` (infinite recursion) errors

## 📝 **Best Practices**

1. **Keep RLS Simple**: Use direct field comparisons when possible
2. **Avoid Cross-References**: Don't reference tables that reference you back
3. **Test Early**: Run tests after every policy change
4. **Monitor Performance**: Watch for queries >1 second
5. **Document Dependencies**: Map out table relationships before writing policies
6. **Use Application Logic**: Handle complex access patterns in code, not RLS

## 🔧 **Integration with CI/CD**

Add to your CI pipeline:
```yaml
# .github/workflows/test.yml
- name: Test RLS Policies
  run: npm run test:rls
- name: Fail if recursion detected
  run: |
    if grep -q "INFINITE_RECURSION\|TIMEOUT" test-results.log; then
      echo "❌ RLS recursion detected!"
      exit 1
    fi
```

---

**Remember**: RLS infinite recursion is a database-level issue that affects ALL query methods (raw SQL, ORMs, etc.). The solution is proper policy design, not changing your ORM! 🎯