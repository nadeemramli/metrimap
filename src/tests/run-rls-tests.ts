#!/usr/bin/env tsx
/**
 * ============================================================================
 * RLS Test Runner - Easy execution script
 * Usage: npm run test:rls or tsx src/tests/run-rls-tests.ts
 * ============================================================================
 */

import { runRLSTests } from './rls-recursion-test';

async function main() {
  console.log('🎯 RLS Infinite Recursion Test Suite');
  console.log('=====================================\n');
  
  try {
    await runRLSTests();
  } catch (error) {
    console.error('💥 Test runner failed:', error);
    process.exit(1);
  }
}

// Run if this file is executed directly
if (require.main === module) {
  main();
}