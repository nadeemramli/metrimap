import type { SupabaseClient } from '@supabase/supabase-js';
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

// Cloud-only: always use the Clerk-authenticated client (no dev/service-role path).
export function getClientForEnvironment(): SupabaseClient<Database> {
  const client = getAuthenticatedClient();
  if (!client) {
    throw new Error(
      'Authenticated client not available. Please ensure you are logged in.'
    );
  }
  return client;
}

// Build-time dev flag (Vite). False in production builds.
export function isDevelopmentMode(): boolean {
  return import.meta.env.DEV;
}
