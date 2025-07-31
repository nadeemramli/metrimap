/**
 * ============================================================================
 * RLS Infinite Recursion Detection Test Suite
 * Purpose: Application-level testing for infinite recursion in RLS policies
 * ============================================================================
 */

import { supabase } from '../lib/supabase/client';

interface TestResult {
  table: string;
  operation: string;
  status: 'SUCCESS' | 'ERROR' | 'TIMEOUT' | 'INFINITE_RECURSION';
  error?: string;
  executionTime: number;
  details?: any;
}

interface TestSuite {
  name: string;
  tests: TestResult[];
  summary: {
    total: number;
    passed: number;
    failed: number;
    timeouts: number;
    recursionErrors: number;
  };
}

class RLSRecursionTester {
  private readonly TIMEOUT_MS = 5000; // 5 second timeout
  
  /**
   * Run a single test with timeout protection
   */
  private async runTestWithTimeout<T>(
    testFn: () => Promise<T>,
    table: string,
    operation: string
  ): Promise<TestResult> {
    const startTime = Date.now();
    
    try {
      // Create timeout promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Test timeout - possible infinite recursion')), this.TIMEOUT_MS);
      });
      
      // Race between the test and timeout
      const result = await Promise.race([testFn(), timeoutPromise]);
      const executionTime = Date.now() - startTime;
      
      return {
        table,
        operation,
        status: 'SUCCESS',
        executionTime,
        details: result
      };
      
    } catch (error: any) {
      const executionTime = Date.now() - startTime;
      const errorMessage = error?.message || String(error);
      
      let status: TestResult['status'] = 'ERROR';
      
      // Categorize error types
      if (errorMessage.includes('timeout') || errorMessage.includes('infinite recursion')) {
        status = 'TIMEOUT';
      } else if (errorMessage.includes('42P17') || errorMessage.includes('infinite recursion detected')) {
        status = 'INFINITE_RECURSION';
      }
      
      return {
        table,
        operation,
        status,
        error: errorMessage,
        executionTime
      };
    }
  }
  
  /**
   * Test basic SELECT operations on all tables
   */
  async testBasicSelects(): Promise<TestResult[]> {
    const tables = [
      'users', 'projects', 'project_collaborators', 
      'metric_cards', 'relationships', 'evidence_items', 
      'groups', 'changelog'
    ];
    
    const results: TestResult[] = [];
    
    for (const table of tables) {
      const result = await this.runTestWithTimeout(
        async () => {
          const { data, error } = await supabase
            .from(table as any)
            .select('*')
            .limit(1);
          
          if (error) throw error;
          return data;
        },
        table,
        'SELECT'
      );
      
      results.push(result);
    }
    
    return results;
  }
  
  /**
   * Test project-related queries that commonly cause recursion
   */
  async testProjectQueries(): Promise<TestResult[]> {
    const results: TestResult[] = [];
    
    // Test 1: Basic project query
    results.push(await this.runTestWithTimeout(
      async () => {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .limit(1);
        
        if (error) throw error;
        return data;
      },
      'projects',
      'SELECT_BASIC'
    ));
    
    // Test 2: Project with collaborators join
    results.push(await this.runTestWithTimeout(
      async () => {
        const { data, error } = await supabase
          .from('projects')
          .select(`
            *,
            project_collaborators(
              role,
              permissions,
              users(id, name, email)
            )
          `)
          .limit(1);
        
        if (error) throw error;
        return data;
      },
      'projects',
      'SELECT_WITH_COLLABORATORS'
    ));
    
    // Test 3: Complex project query with multiple joins
    results.push(await this.runTestWithTimeout(
      async () => {
        const { data, error } = await supabase
          .from('projects')
          .select(`
            *,
            project_collaborators(role, permissions),
            metric_cards(id, title),
            relationships(id, type)
          `)
          .limit(1);
        
        if (error) throw error;
        return data;
      },
      'projects',
      'SELECT_COMPLEX_JOINS'
    ));
    
    return results;
  }
  
  /**
   * Test project_collaborators queries (high risk for recursion)
   */
  async testCollaboratorQueries(): Promise<TestResult[]> {
    const results: TestResult[] = [];
    
    // Test 1: Basic collaborator query
    results.push(await this.runTestWithTimeout(
      async () => {
        const { data, error } = await supabase
          .from('project_collaborators')
          .select('*')
          .limit(1);
        
        if (error) throw error;
        return data;
      },
      'project_collaborators',
      'SELECT_BASIC'
    ));
    
    // Test 2: Collaborators with project details
    results.push(await this.runTestWithTimeout(
      async () => {
        const { data, error } = await supabase
          .from('project_collaborators')
          .select(`
            *,
            projects(id, name, created_by),
            users(id, name, email)
          `)
          .limit(1);
        
        if (error) throw error;
        return data;
      },
      'project_collaborators',
      'SELECT_WITH_PROJECTS'
    ));
    
    return results;
  }
  
  /**
   * Test CRUD operations
   */
  async testCRUDOperations(): Promise<TestResult[]> {
    const results: TestResult[] = [];
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error('User not authenticated - cannot run CRUD tests');
    }
    
    // Test 1: Create project
    results.push(await this.runTestWithTimeout(
      async () => {
        const { data, error } = await supabase
          .from('projects')
          .insert({
            name: `Test Project ${Date.now()}`,
            description: 'RLS Test Project',
            created_by: user.id
          })
          .select()
          .single();
        
        if (error) throw error;
        return data;
      },
      'projects',
      'INSERT'
    ));
    
    // Test 2: Update project (if we have one)
    results.push(await this.runTestWithTimeout(
      async () => {
        const { data: projects } = await supabase
          .from('projects')
          .select('id')
          .limit(1);
        
        if (projects && projects.length > 0) {
          const { data, error } = await supabase
            .from('projects')
            .update({ description: 'Updated description' })
            .eq('id', projects[0].id)
            .select();
          
          if (error) throw error;
          return data;
        }
        return null;
      },
      'projects',
      'UPDATE'
    ));
    
    return results;
  }
  
  /**
   * Run stress tests that are likely to trigger recursion
   */
  async testStressScenarios(): Promise<TestResult[]> {
    const results: TestResult[] = [];
    
    // Stress Test 1: Multiple table OR query
    results.push(await this.runTestWithTimeout(
      async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('No user');
        
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .or(`created_by.eq.${user.id},project_collaborators.user_id.eq.${user.id}`)
          .limit(1);
        
        if (error) throw error;
        return data;
      },
      'projects',
      'STRESS_OR_QUERY'
    ));
    
    // Stress Test 2: Deep nested query
    results.push(await this.runTestWithTimeout(
      async () => {
        const { data, error } = await supabase
          .from('metric_cards')
          .select(`
            *,
            projects(
              *,
              project_collaborators(
                *,
                users(*)
              )
            )
          `)
          .limit(1);
        
        if (error) throw error;
        return data;
      },
      'metric_cards',
      'STRESS_DEEP_NESTED'
    ));
    
    return results;
  }
  
  /**
   * Generate comprehensive test report
   */
  private generateSummary(results: TestResult[]): TestSuite['summary'] {
    return {
      total: results.length,
      passed: results.filter(r => r.status === 'SUCCESS').length,
      failed: results.filter(r => r.status === 'ERROR').length,
      timeouts: results.filter(r => r.status === 'TIMEOUT').length,
      recursionErrors: results.filter(r => r.status === 'INFINITE_RECURSION').length
    };
  }
  
  /**
   * Run the complete test suite
   */
  async runCompleteTestSuite(): Promise<TestSuite> {
    console.log('🔍 Starting RLS Infinite Recursion Test Suite...');
    
    const allResults: TestResult[] = [];
    
    try {
      // Run all test categories
      console.log('📋 Testing basic SELECT operations...');
      const basicTests = await this.testBasicSelects();
      allResults.push(...basicTests);
      
      console.log('🏗️  Testing project queries...');
      const projectTests = await this.testProjectQueries();
      allResults.push(...projectTests);
      
      console.log('👥 Testing collaborator queries...');
      const collaboratorTests = await this.testCollaboratorQueries();
      allResults.push(...collaboratorTests);
      
      console.log('💾 Testing CRUD operations...');
      const crudTests = await this.testCRUDOperations();
      allResults.push(...crudTests);
      
      console.log('⚡ Running stress tests...');
      const stressTests = await this.testStressScenarios();
      allResults.push(...stressTests);
      
    } catch (error) {
      console.error('❌ Test suite failed:', error);
    }
    
    const summary = this.generateSummary(allResults);
    
    return {
      name: 'RLS Infinite Recursion Test Suite',
      tests: allResults,
      summary
    };
  }
  
  /**
   * Pretty print test results
   */
  static printResults(testSuite: TestSuite): void {
    console.log('\n' + '='.repeat(80));
    console.log(`📊 ${testSuite.name} - RESULTS`);
    console.log('='.repeat(80));
    
    // Summary
    console.log('\n📈 SUMMARY:');
    console.log(`Total Tests: ${testSuite.summary.total}`);
    console.log(`✅ Passed: ${testSuite.summary.passed}`);
    console.log(`❌ Failed: ${testSuite.summary.failed}`);
    console.log(`⏱️  Timeouts: ${testSuite.summary.timeouts}`);
    console.log(`🔴 Recursion Errors: ${testSuite.summary.recursionErrors}`);
    
    // Detailed results
    console.log('\n📋 DETAILED RESULTS:');
    testSuite.tests.forEach(test => {
      const emoji = {
        SUCCESS: '✅',
        ERROR: '❌',
        TIMEOUT: '⏱️ ',
        INFINITE_RECURSION: '🔴'
      }[test.status];
      
      console.log(`${emoji} ${test.table}.${test.operation} (${test.executionTime}ms)`);
      if (test.error) {
        console.log(`   Error: ${test.error}`);
      }
    });
    
    // Recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    if (testSuite.summary.recursionErrors > 0) {
      console.log('🔴 CRITICAL: Infinite recursion detected! Review RLS policies immediately.');
    }
    if (testSuite.summary.timeouts > 0) {
      console.log('⚠️  WARNING: Timeouts detected - possible performance issues or hidden recursion.');
    }
    if (testSuite.summary.failed > 0) {
      console.log('⚡ INFO: Some queries failed - check permissions and policy logic.');
    }
    if (testSuite.summary.recursionErrors === 0 && testSuite.summary.timeouts === 0) {
      console.log('🎉 EXCELLENT: No recursion issues detected!');
    }
  }
}

// Export for use in tests
export { RLSRecursionTester, type TestResult, type TestSuite };

// Example usage function
export async function runRLSTests(): Promise<void> {
  const tester = new RLSRecursionTester();
  const results = await tester.runCompleteTestSuite();
  RLSRecursionTester.printResults(results);
  return;
}