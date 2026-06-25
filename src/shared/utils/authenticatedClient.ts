import type { SupabaseClient } from '@supabase/supabase-js';
import { createDevSupabaseClient } from '../lib/supabase/client';
import type { Database } from '../lib/supabase/types';

// This is a temporary solution to get authenticated client in stores
// In a real app, you'd want to pass the client through props or use a different pattern
let authenticatedClient: SupabaseClient<Database> | null = null;
let readyResolvers: Array<(c: SupabaseClient<Database>) => void> = [];

export function setAuthenticatedClient(client: SupabaseClient<Database>) {
  authenticatedClient = client;
  // Flush anyone awaiting the client.
  const pending = readyResolvers;
  readyResolvers = [];
  pending.forEach((resolve) => resolve(client));
}

export function getAuthenticatedClient(): SupabaseClient<Database> | null {
  return authenticatedClient;
}

export function isAuthenticatedClientReady(): boolean {
  return authenticatedClient !== null;
}

// Non-throwing waiter: resolves once the Clerk-authenticated client is set.
// Lets HomePage/CanvasPage gate data loads instead of throwing on first render.
export function whenAuthenticatedClientReady(): Promise<
  SupabaseClient<Database>
> {
  if (authenticatedClient) return Promise.resolve(authenticatedClient);
  return new Promise((resolve) => {
    readyResolvers.push(resolve);
  });
}

// Enhanced function to get the appropriate client for the current environment
import { isDevelopmentEnvironment } from '@/shared/lib/supabase/client';

export function getClientForEnvironment(): SupabaseClient<Database> {
  const isDevelopment = isDevelopmentEnvironment();

  if (isDevelopment) {
    console.log('🔧 Using development client (service role)');
    return createDevSupabaseClient();
  }

  const client = getAuthenticatedClient();
  if (!client) {
    throw new Error(
      'Authenticated client not available. Please ensure you are logged in.'
    );
  }

  console.log('🔐 Using production client (Clerk authenticated)');
  return client;
}

// Helper function to check if we're in development mode
export function isDevelopmentMode(): boolean {
  return isDevelopmentEnvironment();
}
