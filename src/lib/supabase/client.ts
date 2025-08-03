import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = 'https://pdzcgkngdjmeogbdojum.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkemNna25nZGptZW9nYmRvanVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4OTk0NTEsImV4cCI6MjA2OTQ3NTQ1MX0.mp3R79MD83d94ZGXlk5ywH9KsAHBUYFUv2w0JOcTVM4';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Create a Supabase client with Clerk authentication using the native integration
export function createClerkSupabaseClient(getToken: () => Promise<string | null>) {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    async accessToken() {
      return getToken() ?? null;
    },
  });
}

// Helper function to get the current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) {
    console.error('Error getting current user:', error);
    return null;
  }
  return user;
};

// Helper function to handle auth state changes
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  return supabase.auth.onAuthStateChange(callback);
};