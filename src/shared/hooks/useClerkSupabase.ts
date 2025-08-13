import type { Database } from '@/shared/lib/supabase/types';
import { useUser } from '@clerk/react-router';
import type { SupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

// Support both Vite and Next-style public env vars (production may set NEXT_PUBLIC_*)
const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function useClerkSupabase(): SupabaseClient<Database> | null {
  const { user } = useUser();
  const [supabaseClient, setSupabaseClient] =
    useState<SupabaseClient<Database> | null>(null);

  useEffect(() => {
    if (user) {
      const client = createClient<Database>(supabaseUrl, supabaseAnonKey, {
        global: {
          headers: {
            Authorization: `Bearer ${user.id}`,
          },
        },
      });
      setSupabaseClient(client);
    } else {
      setSupabaseClient(null);
    }
  }, [user]);

  return supabaseClient;
}
