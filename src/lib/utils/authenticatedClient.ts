import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../supabase/types';

// This is a temporary solution to get authenticated client in stores
// In a real app, you'd want to pass the client through props or use a different pattern
let authenticatedClient: SupabaseClient<Database> | null = null;

export function setAuthenticatedClient(client: SupabaseClient<Database>) {
  authenticatedClient = client;
}

export function getAuthenticatedClient(): SupabaseClient<Database> | null {
  return authenticatedClient;
} 