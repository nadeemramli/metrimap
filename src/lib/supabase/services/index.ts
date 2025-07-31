// Export all Supabase services
export * from './projects';
export * from './metric-cards';
export * from './relationships';

// Re-export Supabase client and types for convenience
export { supabase, getCurrentUser, onAuthStateChange } from '../client';
export type { Database, Tables, TablesInsert, TablesUpdate } from '../types';