import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../supabase/types';
import { createDevSupabaseClient } from '../supabase/client';

// This is a temporary solution to get authenticated client in stores
// In a real app, you'd want to pass the client through props or use a different pattern
let authenticatedClient: SupabaseClient<Database> | null = null;

export function setAuthenticatedClient(client: SupabaseClient<Database>) {
  authenticatedClient = client;
}

export function getAuthenticatedClient(): SupabaseClient<Database> | null {
  return authenticatedClient;
}

// Enhanced function to get the appropriate client for the current environment
export function getClientForEnvironment(): SupabaseClient<Database> {
  const isDevelopment = import.meta.env.VITE_SUPABASE_URL?.includes("127.0.0.1") || import.meta.env.VITE_SUPABASE_URL?.includes("localhost");
  
  if (isDevelopment) {
    console.log('🔧 Using development client (service role)');
    return createDevSupabaseClient();
  }
  
  const client = getAuthenticatedClient();
  if (!client) {
    throw new Error('Authenticated client not available. Please ensure you are logged in.');
  }
  
  console.log('🔐 Using production client (Clerk authenticated)');
  return client;
}

// Helper function to check if we're in development mode
export function isDevelopmentMode(): boolean {
  return import.meta.env.VITE_SUPABASE_URL?.includes("127.0.0.1") || import.meta.env.VITE_SUPABASE_URL?.includes("localhost");
} 