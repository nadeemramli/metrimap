import { useAuth } from '@clerk/react-router';
import { createClerkSupabaseClient } from '@/lib/supabase/client';
import { useMemo } from 'react';

export function useClerkSupabase() {
  const { getToken } = useAuth();
  
  const client = useMemo(() => {
    return createClerkSupabaseClient(() => getToken());
  }, [getToken]);
  
  return client;
}