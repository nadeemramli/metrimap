import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

// Get environment variables with validation
const getSupabaseConfig = () => {
  // Check for Vite environment variables (local development)
  const viteSupabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const viteSupabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  
  // Check for Next.js public variables (production)
  const nextPublicSupabaseUrl = import.meta.env.NEXT_PUBLIC_SUPABASE_URL
  const nextPublicSupabaseAnonKey = import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  // Use Vite variables if available (local dev), otherwise use Next.js public variables
  const supabaseUrl = viteSupabaseUrl || nextPublicSupabaseUrl
  const supabaseAnonKey = viteSupabaseAnonKey || nextPublicSupabaseAnonKey

  console.log('🔧 Environment variables check:', {
    VITE_SUPABASE_URL: viteSupabaseUrl ? 'Set' : 'Not set',
    VITE_SUPABASE_ANON_KEY: viteSupabaseAnonKey ? 'Set' : 'Not set',
    NEXT_PUBLIC_SUPABASE_URL: nextPublicSupabaseUrl ? 'Set' : 'Not set',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: nextPublicSupabaseAnonKey ? 'Set' : 'Not set',
    finalUrl: supabaseUrl ? 'Set' : 'Not set',
    finalKey: supabaseAnonKey ? 'Set' : 'Not set'
  })

  if (!supabaseUrl) {
    console.error('❌ Supabase URL is required. Please check your environment variables.')
    throw new Error('Supabase URL is required. Please check your environment variables.')
  }

  if (!supabaseAnonKey) {
    console.error('❌ Supabase anon key is required. Please check your environment variables.')
    throw new Error('Supabase anon key is required. Please check your environment variables.')
  }

  console.log('✅ Environment variables loaded successfully')
  return { supabaseUrl, supabaseAnonKey }
}

// Enhanced environment detection
const isDevelopmentEnvironment = () => {
  // Check both Vite and Supabase integration variables
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) return false
  
  // Check for local development URLs
  const isLocal = supabaseUrl.includes("127.0.0.1") || 
                  supabaseUrl.includes("localhost") || 
                  supabaseUrl.includes("0.0.0.0")
  
  console.log('🔧 Environment detection:', {
    supabaseUrl,
    isLocal,
    isDevelopment: isLocal
  })
  
  return isLocal
}

// Singleton instances to prevent multiple GoTrueClient instances
let defaultClient: ReturnType<typeof createClient<Database>> | null = null
let devClient: ReturnType<typeof createClient<Database>> | null = null
let clerkClient: ReturnType<typeof createClient<Database>> | null = null

// Create the default Supabase client (singleton)
export const supabase = () => {
  if (!defaultClient) {
    console.log('🔧 Creating default Supabase client (singleton)')
    const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig()
    defaultClient = createClient<Database>(supabaseUrl, supabaseAnonKey)
  }
  return defaultClient
}

// Create a Clerk-integrated Supabase client using the NATIVE integration
// This follows the official Clerk-Supabase integration guide (non-deprecated approach)
export const createClerkSupabaseClient = (getToken: () => Promise<string | null>) => {
  console.log('🔧 Creating Clerk Supabase client with NATIVE integration')
  const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig()
  
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    // Use the native integration with accessToken() method
    // This is the recommended approach (non-deprecated)
    async accessToken() {
      try {
        const token = await getToken()
        return token
      } catch (error) {
        console.error('Error getting Clerk access token:', error)
        return null
      }
    },
  })
}

// Alternative: Create a single Clerk client without function dependency
export const getClerkSupabaseClient = () => {
  if (!clerkClient) {
    console.log('🔧 Creating Clerk Supabase client (singleton)')
    const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig()
    clerkClient = createClient<Database>(supabaseUrl, supabaseAnonKey)
  }
  return clerkClient
}

// Development-specific client that bypasses Clerk authentication and RLS (singleton)
export const createDevSupabaseClient = () => {
  if (!devClient) {
    console.log('🔧 Creating development Supabase client (singleton)')
    const { supabaseUrl } = getSupabaseConfig()
    
    // For local development, use service role key to bypass RLS
    // For remote environments (staging/preview), use the provided anon key
    const isLocal = isDevelopmentEnvironment()
    
    if (isLocal) {
      // Use service role key for local development to bypass RLS
      const serviceRoleKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU"
      
      devClient = createClient<Database>(supabaseUrl, serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    } else {
      // For remote environments, use the anon key but with development settings
      const { supabaseAnonKey } = getSupabaseConfig()
      devClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      })
    }
  }
  return devClient
}

// Test function to verify Supabase connection
export const testSupabaseConnection = async () => {
  try {
    console.log('🧪 Testing Supabase connection...')
    const client = supabase()
    const { error } = await client.from('users').select('count').limit(1)
    
    if (error) {
      console.error('❌ Supabase connection test failed:', error)
      return false
    }
    
    console.log('✅ Supabase connection test successful')
    return true
  } catch (error) {
    console.error('❌ Supabase connection test failed:', error)
    return false
  }
}

// Test function to verify environment detection
export const testEnvironmentDetection = () => {
  const currentUrl = import.meta.env.VITE_SUPABASE_URL
  const isLocal = isDevelopmentEnvironment()
  
  console.log('🧪 Environment detection test:', {
    currentUrl,
    isLocal,
    environment: isLocal ? 'Local Development' : 'Remote (Staging/Production)',
    expectedBehavior: isLocal ? 'Authentication bypassed, RLS bypassed' : 'Clerk auth required, normal RLS'
  })
  
  return {
    url: currentUrl,
    isLocal,
    environment: isLocal ? 'Local Development' : 'Remote (Staging/Production)'
  }
}

// Helper function to get the current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase().auth.getUser();
  if (error) {
    console.error('Error getting current user:', error);
    return null;
  }
  return user;
};

// Helper function to handle auth state changes
export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  return supabase().auth.onAuthStateChange(callback);
};

// Export the environment detection function for use in other components
export { isDevelopmentEnvironment }