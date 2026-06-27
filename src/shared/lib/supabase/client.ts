import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// Get environment variables with validation
const getSupabaseConfig = () => {
  // Check for Vite environment variables (local development)
  const viteSupabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const viteSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  // Check for Next.js public variables (production)
  const nextPublicSupabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
  const nextPublicSupabaseAnonKey = import.meta.env
    .NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Use Vite variables if available (local dev), otherwise use Next.js public variables
  const supabaseUrl = viteSupabaseUrl || nextPublicSupabaseUrl;
  const supabaseAnonKey = viteSupabaseAnonKey || nextPublicSupabaseAnonKey;

  if (!supabaseUrl) {
    throw new Error(
      'Supabase URL is required. Please check your environment variables.'
    );
  }

  if (!supabaseAnonKey) {
    throw new Error(
      'Supabase anon key is required. Please check your environment variables.'
    );
  }

  return { supabaseUrl, supabaseAnonKey };
};

// Singleton instances to prevent multiple GoTrueClient instances
let defaultClient: ReturnType<typeof createClient<Database>> | null = null;
let clerkClient: ReturnType<typeof createClient<Database>> | null = null;

// Create the default Supabase client (singleton)
export const supabase = () => {
  if (!defaultClient) {
    const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
    defaultClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
  }
  return defaultClient;
};

// Create a Clerk-integrated Supabase client using the NATIVE integration
// This follows the official Clerk-Supabase integration guide (non-deprecated approach)
export const createClerkSupabaseClient = (
  getToken: () => Promise<string | null>
) => {
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();

  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    // Use the native integration with accessToken() method
    // This is the recommended approach (non-deprecated)
    async accessToken() {
      try {
        const token = await getToken();
        return token;
      } catch (error) {
        console.error('Error getting Clerk access token:', error);
        return null;
      }
    },
  });
};

// Alternative: Create a single Clerk client without function dependency
export const getClerkSupabaseClient = () => {
  if (!clerkClient) {
    const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
    clerkClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
  }
  return clerkClient;
};

// Helper function to get the current user
export const getCurrentUser = async () => {
  const {
    data: { user },
    error,
  } = await supabase().auth.getUser();
  if (error) {
    console.error('Error getting current user:', error);
    return null;
  }
  return user;
};

// Helper function to handle auth state changes
export const onAuthStateChange = (
  callback: (event: string, session: any) => void
) => {
  return supabase().auth.onAuthStateChange(callback);
};
