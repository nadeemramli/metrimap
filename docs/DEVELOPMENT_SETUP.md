# Development Environment Setup

## Overview

This document explains how to set up the development environment for the Metric Mapping application and how the GoTrueClient warning issue has been resolved.

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Set up Local Supabase

```bash
# Install Supabase CLI globally (if not already installed)
npm install -g supabase

# Start local Supabase instance
supabase start

# This will output local credentials you need for the .env file
```

### 3. Create Environment File

Create a `.env` file in the root directory:

```bash
# Clerk Configuration (use your production keys)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_bW9kZXJuLXBob2VuaXgtMTkuY2xlcmsuYWNjb3VudHMuZGV2JA

# Supabase Configuration (use your production keys)
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0

# Development Domain
VITE_APP_URL=http://dev.canvasm.app:5173
```

### 4. Start Development Server

```bash
npm run dev
```

### 5. Access the Application

- **App**: http://localhost:3000
- **Supabase Studio**: http://localhost:54323

## Issues and Solutions

### GoTrueClient Warning Solution

#### Problem

The application was showing a warning about multiple `GoTrueClient` instances being detected in the same browser context. This occurred because multiple Supabase client instances were being created throughout the application.

#### Root Cause

The issue was caused by:

1. **Multiple client creation**: Different parts of the app were creating separate Supabase client instances
2. **No singleton pattern**: Each call to `createClient()` created a new instance
3. **Mixed usage patterns**: Some code used direct client creation, others used imported instances

#### Solution Implemented

##### 1. Singleton Pattern

Implemented a singleton pattern in `src/lib/supabase/client.ts`:

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
```

##### 2. Updated All Usage Patterns

Updated all files to use the function call pattern:

- `supabase.auth.getUser()` → `supabase().auth.getUser()`
- `authenticatedClient || supabase` → `authenticatedClient || supabase()`

##### 3. Environment Detection

The app automatically detects development vs production mode:

```typescript
const isDevelopmentEnvironment = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!supabaseUrl) return false;

  // Check for local development URLs
  const isLocal =
    supabaseUrl.includes("127.0.0.1") ||
    supabaseUrl.includes("localhost") ||
    supabaseUrl.includes("0.0.0.0");

  console.log("🔧 Environment detection:", {
    supabaseUrl,
    isLocal,
    isDevelopment: isLocal,
  });

  return isLocal;
};
```

### "supabaseUrl is required" Error Solution

#### Problem

The application was throwing an error: `supabaseUrl is required` when trying to create Supabase clients.

#### Root Cause

The issue was caused by:

1. **Environment variables not loading**: The environment variables were being read at module level before they were available
2. **Missing validation**: No proper validation for required environment variables
3. **Incorrect service file patterns**: Some service files had `supabase()()` instead of `supabase()`

#### Solution Implemented

##### 1. Environment Variable Validation

Added proper validation in `src/lib/supabase/client.ts`:

```typescript
// Get environment variables with validation
const getSupabaseConfig = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  console.log("🔧 Environment variables check:", {
    VITE_SUPABASE_URL: supabaseUrl ? "Set" : "Not set",
    VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? "Set" : "Not set",
    urlLength: supabaseUrl?.length || 0,
    keyLength: supabaseAnonKey?.length || 0,
  });

  if (!supabaseUrl) {
    console.error(
      "❌ VITE_SUPABASE_URL is required. Please check your .env file."
    );
    throw new Error(
      "VITE_SUPABASE_URL is required. Please check your .env file."
    );
  }

  if (!supabaseAnonKey) {
    console.error(
      "❌ VITE_SUPABASE_ANON_KEY is required. Please check your .env file."
    );
    throw new Error(
      "VITE_SUPABASE_ANON_KEY is required. Please check your .env file."
    );
  }

  console.log("✅ Environment variables loaded successfully");
  return { supabaseUrl, supabaseAnonKey };
};
```

##### 2. Fixed Service File Patterns

Corrected all service files to use the proper pattern:

```typescript
// Before (incorrect)
const client = authenticatedClient || supabase()();

// After (correct)
const client = authenticatedClient || supabase();
```

##### 3. Updated .env File

Ensured the `.env` file has the correct format and complete anon key:

```bash
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
```

### Staging Environment Support

#### Problem

The application was not properly handling remote Supabase URLs (staging/preview environments) and was treating them as local development.

#### Solution Implemented

##### 1. Enhanced Environment Detection

Updated the environment detection logic to properly distinguish between local and remote environments:

```typescript
const isDevelopmentEnvironment = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!supabaseUrl) return false;

  // Check for local development URLs
  const isLocal =
    supabaseUrl.includes("127.0.0.1") ||
    supabaseUrl.includes("localhost") ||
    supabaseUrl.includes("0.0.0.0");

  console.log("🔧 Environment detection:", {
    supabaseUrl,
    isLocal,
    isDevelopment: isLocal,
  });

  return isLocal;
};
```

##### 2. Environment-Specific Client Configuration

Updated the development client to handle both local and remote environments:

```typescript
export const createDevSupabaseClient = () => {
  if (!devClient) {
    console.log("🔧 Creating development Supabase client (singleton)");
    const { supabaseUrl } = getSupabaseConfig();

    // For local development, use service role key to bypass RLS
    // For remote environments (staging/preview), use the provided anon key
    const isLocal = isDevelopmentEnvironment();

    if (isLocal) {
      // Use service role key for local development to bypass RLS
      const serviceRoleKey =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU";

      devClient = createClient<Database>(supabaseUrl, serviceRoleKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });
    } else {
      // For remote environments, use the anon key but with development settings
      const { supabaseAnonKey } = getSupabaseConfig();
      devClient = createClient<Database>(supabaseUrl, supabaseAnonKey, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      });
    }
  }
  return devClient;
};
```

### Benefits

- ✅ **No more GoTrueClient warnings**
- ✅ **No more "supabaseUrl is required" errors**
- ✅ **Consistent client instances**
- ✅ **Better performance** (fewer client instances)
- ✅ **Cleaner code** (singleton pattern)
- ✅ **Environment-specific clients** (dev vs production)
- ✅ **Proper environment variable validation**
- ✅ **Staging environment support**

## Development Features

### Automatic Environment Detection

The app automatically switches between development and production modes based on the Supabase URL:

- **Local Development**: Uses localhost/127.0.0.1 URLs
- **Staging/Preview**: Uses remote Supabase URLs (https://\*.supabase.co)
- **Production**: Uses remote Supabase URLs (https://\*.supabase.co)

### Environment-Specific Behavior

| Environment    | URL Pattern              | Authentication    | RLS Bypass      | Debug Features |
| -------------- | ------------------------ | ----------------- | --------------- | -------------- |
| **Local**      | `http://127.0.0.1:54321` | ❌ Bypassed       | ✅ Service Role | ✅ Debug Page  |
| **Staging**    | `https://*.supabase.co`  | ✅ Clerk Required | ❌ Normal RLS   | ❌ No Debug    |
| **Production** | `https://*.supabase.co`  | ✅ Clerk Required | ❌ Normal RLS   | ❌ No Debug    |

### Development Authentication Bypass

In development mode:

- No Clerk authentication required
- Uses service role key to bypass RLS
- Debug page available at `/debug`

### Hot Reload

The development server supports hot reload for instant feedback during development.

## Troubleshooting

### Common Issues

1. **Supabase not starting**

   ```bash
   # Check if Docker is running
   docker --version

   # Restart Supabase
   supabase stop
   supabase start
   ```

2. **Environment variables not loading**
   - Ensure `.env` file is in the root directory
   - Restart the development server after changing `.env`
   - Check that the anon key is complete (not truncated)

3. **Port conflicts**
   - Supabase uses ports: 54321 (API), 54322 (DB), 54323 (Studio)
   - Ensure these ports are available

4. **"supabaseUrl is required" error**
   - Check that `.env` file exists and has correct format
   - Verify that `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
   - Restart the development server after updating `.env`

5. **Staging environment issues**
   - Ensure the Supabase URL is a remote URL (https://\*.supabase.co)
   - Verify that the anon key is from the staging project
   - Check that Clerk is properly configured for authentication

### Debug Mode

Access the debug page at `http://localhost:3000/debug` to verify:

- ✅ App component rendered
- ✅ Development auth provider loaded
- ✅ Local Supabase connected
- ✅ No Clerk authentication required

### Connection Testing

The application includes test functions to verify Supabase connection and environment detection:

```typescript
import {
  testSupabaseConnection,
  testEnvironmentDetection,
} from "@/lib/supabase/client";

// Test the connection
const isConnected = await testSupabaseConnection();
console.log("Supabase connected:", isConnected);

// Test environment detection
const envInfo = testEnvironmentDetection();
console.log("Environment info:", envInfo);
```

## File Structure

```
src/
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # Singleton Supabase clients
│   │   ├── types.ts           # Database types
│   │   └── services/          # Database service functions
│   └── utils/
│       └── authenticatedClient.ts  # Client management utilities
├── contexts/
│   └── AuthenticatedSupabaseContext.tsx  # React context for Supabase
└── components/
    └── auth/
        ├── ClerkSupabaseProvider.tsx     # Production auth
        └── DevAuthProvider.tsx           # Development auth
```

## Environment Variables

| Variable                     | Description            | Required        |
| ---------------------------- | ---------------------- | --------------- |
| `VITE_SUPABASE_URL`          | Supabase project URL   | Yes             |
| `VITE_SUPABASE_ANON_KEY`     | Supabase anonymous key | Yes             |
| `VITE_CLERK_PUBLISHABLE_KEY` | Clerk publishable key  | Production only |

## Scripts

| Script             | Description              |
| ------------------ | ------------------------ |
| `npm run dev`      | Start development server |
| `npm run build`    | Build for production     |
| `npm run lint`     | Run ESLint               |
| `npm run test`     | Run tests                |
| `npm run test:rls` | Run RLS tests            |
