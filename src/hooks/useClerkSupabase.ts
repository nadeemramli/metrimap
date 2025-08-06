import { useAuth } from '@clerk/react-router';
import { getClerkSupabaseClient } from '@/lib/supabase/client';
import { useMemo, useEffect } from 'react';

export function useClerkSupabase() {
  const { getToken } = useAuth();
  
  const client = useMemo(() => {
    return getClerkSupabaseClient();
  }, []);
  
  // Update authentication headers when token changes
  useEffect(() => {
    const updateAuthHeaders = async () => {
      const token = await getToken();
      if (token) {
        client.rest.headers['Authorization'] = `Bearer ${token}`;
      }
    };
    
    updateAuthHeaders();
  }, [getToken, client]);
  
  return client;
}