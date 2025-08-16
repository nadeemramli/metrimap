import { createClerkSupabaseClient } from '@/shared/lib/supabase/client';
import type { Database } from '@/shared/lib/supabase/types';
import { useAuth } from '@clerk/react-router';
import type { SupabaseClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

// Native Clerk → Supabase integration using accessToken callback
export function useClerkSupabase(): SupabaseClient<Database> | null {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const [supabaseClient, setSupabaseClient] =
    useState<SupabaseClient<Database> | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) {
      const client = createClerkSupabaseClient(async () => {
        try {
          // Use the Clerk template for Supabase if configured
          const token = await getToken({ template: 'supabase' });
          return token;
        } catch (err) {
          console.error('Failed to get Clerk token for Supabase:', err);
          return null;
        }
      });
      setSupabaseClient(client);
    } else {
      setSupabaseClient(null);
    }
  }, [isLoaded, isSignedIn, getToken]);

  return supabaseClient;
}
