# Supabase Client Singleton Pattern

## Issue: Multiple GoTrueClient Instances

The application was showing a warning about multiple `GoTrueClient` instances being detected in the same browser context. This happens when multiple Supabase client instances are created, which can lead to undefined behavior.

## Root Cause

The issue was occurring because:

1. **Function Reference Changes**: The `getToken` function from Clerk's `useAuth()` hook changes on every render
2. **Multiple Client Creation**: Each time `createClerkSupabaseClient` was called with a different function reference, it created a new client instance
3. **React Re-renders**: Components re-rendering caused the function references to change, triggering new client creation

## Solution: Singleton Pattern with Stable References

### 1. Singleton Pattern Implementation

```typescript
// Singleton instances to prevent multiple GoTrueClient instances
let defaultClient: ReturnType<typeof createClient<Database>> | null = null;
let devClient: ReturnType<typeof createClient<Database>> | null = null;
let clerkClient: ReturnType<typeof createClient<Database>> | null = null;

// Create the default Supabase client (singleton)
export const supabase = () => {
  if (!defaultClient) {
    console.log("🔧 Creating default Supabase client (singleton)");
    const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
    defaultClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
  }
  return defaultClient;
};

// Create a Clerk-integrated Supabase client (singleton)
export const createClerkSupabaseClient = (
  getToken: () => Promise<string | null>
) => {
  if (!clerkClient) {
    console.log("🔧 Creating Clerk Supabase client (singleton)");
    const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
    clerkClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      },
    });
  }
  return clerkClient;
};
```

### 2. Simplified Singleton Approach

To completely avoid the function reference issue, we create a single client instance and handle authentication headers separately:

```typescript
// In client.ts - Create a single client without function dependency
export const getClerkSupabaseClient = () => {
  if (!clerkClient) {
    console.log("🔧 Creating Clerk Supabase client (singleton)");
    const { supabaseUrl, supabaseAnonKey } = getSupabaseConfig();
    clerkClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
  }
  return clerkClient;
};
```

```typescript
// In useClerkSupabase.ts
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
        client.rest.headers["Authorization"] = `Bearer ${token}`;
      }
    };

    updateAuthHeaders();
  }, [getToken, client]);

  return client;
}
```

```typescript
// In ClerkSupabaseProvider.tsx
export default function ClerkSupabaseProvider({
  children,
}: ClerkSupabaseProviderProps) {
  const { getToken } = useAuth();

  useEffect(() => {
    const supabaseClient = getClerkSupabaseClient();

    // Set authentication headers
    const token = await getToken();
    if (token) {
      supabaseClient.rest.headers["Authorization"] = `Bearer ${token}`;
    }

    // ... rest of the logic
  }, [user, isLoaded, getToken, setUser, signOut]);
}
```

## Benefits

1. **Single Client Instance**: Only one Supabase client is created per type (default, dev, clerk)
2. **Stable References**: Function references don't change on every render
3. **Better Performance**: Reduces memory usage and prevents unnecessary client recreation
4. **No More Warnings**: Eliminates the "Multiple GoTrueClient instances" warning

## Client Types

### 1. Default Client (`supabase()`)

- Used for basic Supabase operations
- Uses anon key
- No authentication headers

### 2. Development Client (`createDevSupabaseClient()`)

- Used in development environment
- Bypasses RLS using service role key (local) or anon key (remote)
- No authentication required

### 3. Clerk Client (`createClerkSupabaseClient()`)

- Used in production/staging with Clerk authentication
- Includes authentication headers
- Enforces RLS policies

## Environment Detection

The application automatically detects the environment and uses the appropriate client:

```typescript
const isDevelopmentEnvironment = () => {
  const supabaseUrl =
    import.meta.env.VITE_SUPABASE_URL ||
    import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return false;

  const isLocal =
    supabaseUrl.includes("127.0.0.1") ||
    supabaseUrl.includes("localhost") ||
    supabaseUrl.includes("0.0.0.0");

  return isLocal;
};
```

## Testing

To verify the singleton pattern is working:

1. Check browser console for singleton creation logs
2. Ensure no "Multiple GoTrueClient instances" warnings
3. Verify that client operations work correctly in both environments

## Troubleshooting

If you still see the warning:

1. **Check for multiple imports**: Ensure `createClerkSupabaseClient` is only called from the hook and provider
2. **Verify stable references**: Make sure `useCallback` is used for `getToken` functions
3. **Check environment**: Ensure the correct client type is being used for the environment
4. **Clear browser cache**: Sometimes cached instances can cause issues
