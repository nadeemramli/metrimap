import { useClerkSupabase } from '@/shared/hooks/useClerkSupabase';
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
  // Cloud-only: always use the Clerk-authenticated client.
  const supabaseClient = useClerkSupabase();

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
