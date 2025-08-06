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
        client.auth.setSession({
          access_token: token,
          refresh_token: "",
        });
      }
    };
    
    updateAuthHeaders();
  }, [getToken, client]);
  
  return client;
}