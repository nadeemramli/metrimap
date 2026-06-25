import { useClerkSupabase } from '@/shared/hooks/useClerkSupabase';
import {
  createDevSupabaseClient,
  isDevelopmentEnvironment,
} from '@/shared/lib/supabase/client';
import type { Database } from '@/shared/lib/supabase/types';
import { setAuthenticatedClient } from '@/shared/utils/authenticatedClient';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { ReactNode } from 'react';
import { createContext, useContext, useEffect } from 'react';

interface AuthenticatedSupabaseContextType {
  supabaseClient: SupabaseClient<Database> | null;
}

const AuthenticatedSupabaseContext =
  createContext<AuthenticatedSupabaseContextType | null>(null);

export function AuthenticatedSupabaseProvider({
  children,
}: {
  children: ReactNode;
}) {
  // Hooks must run unconditionally (Rules-of-Hooks).
  // Cloud-only: the dev/service-role path is dead, so always use the Clerk client.
  const clerkClient = useClerkSupabase();
  const isDevelopment = isDevelopmentEnvironment();
  const supabaseClient = isDevelopment
    ? createDevSupabaseClient()
    : clerkClient;

  // Set the authenticated client for stores to use
  useEffect(() => {
    if (supabaseClient) {
      setAuthenticatedClient(supabaseClient);
    }
  }, [supabaseClient]);

  return (
    <AuthenticatedSupabaseContext.Provider value={{ supabaseClient }}>
      {children}
    </AuthenticatedSupabaseContext.Provider>
  );
}

export function useAuthenticatedSupabase() {
  const context = useContext(AuthenticatedSupabaseContext);
  if (!context || !context.supabaseClient) {
    throw new Error(
      'useAuthenticatedSupabase must be used within AuthenticatedSupabaseProvider'
    );
  }
  return context.supabaseClient;
}
