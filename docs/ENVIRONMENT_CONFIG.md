# Environment Configuration Guide

This guide explains how to configure the application for different environments: local development, staging, preview, and production.

## Environment Types

### 1. Local Development

- **Purpose**: Development and testing on your local machine
- **Supabase**: Local instance running via `supabase start`
- **Authentication**: Bypassed for easier development
- **URL Pattern**: `http://127.0.0.1:54321` or `http://localhost:54321`

### 2. Staging/Preview

- **Purpose**: Testing with remote Supabase instance
- **Supabase**: Remote instance (e.g., Vercel preview deployments)
- **Authentication**: Clerk authentication required
- **URL Pattern**: `https://[project-ref].supabase.co`

### 3. Production

- **Purpose**: Live application
- **Supabase**: Production remote instance
- **Authentication**: Clerk authentication required
- **URL Pattern**: `https://[project-ref].supabase.co`

## Configuration Examples

### Local Development (.env)

```bash
# Clerk Configuration (optional for local dev)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key

# Supabase Configuration (local)
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0

# Development Domain
VITE_APP_URL=http://localhost:3000
```

### Staging/Preview (.env)

```bash
# Clerk Configuration (required)
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key

# Supabase Configuration (remote)
VITE_SUPABASE_URL=https://pdzcgkngdjmeogbdojum.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.your_remote_anon_key

# App URL
VITE_APP_URL=https://your-preview-domain.vercel.app
```

### Production (.env)

```bash
# Clerk Configuration (required)
VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_production_clerk_key

# Supabase Configuration (production)
VITE_SUPABASE_URL=https://your-production-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.your_production_anon_key

# App URL
VITE_APP_URL=https://your-production-domain.com
```

## Environment Detection Logic

The application automatically detects the environment based on the Supabase URL:

```typescript
const isDevelopmentEnvironment = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  if (!supabaseUrl) return false;

  // Check for local development URLs
  const isLocal =
    supabaseUrl.includes("127.0.0.1") ||
    supabaseUrl.includes("localhost") ||
    supabaseUrl.includes("0.0.0.0");

  return isLocal;
};
```

### Behavior by Environment

| Environment    | Supabase URL Pattern     | Authentication    | RLS Bypass      | Debug Features |
| -------------- | ------------------------ | ----------------- | --------------- | -------------- |
| **Local**      | `http://127.0.0.1:54321` | ❌ Bypassed       | ✅ Service Role | ✅ Debug Page  |
| **Staging**    | `https://*.supabase.co`  | ✅ Clerk Required | ❌ Normal RLS   | ❌ No Debug    |
| **Production** | `https://*.supabase.co`  | ✅ Clerk Required | ❌ Normal RLS   | ❌ No Debug    |

## Setup Instructions

### For Local Development

1. **Start Local Supabase**:

   ```bash
   supabase start
   ```

2. **Create .env file** with local configuration:

   ```bash
   VITE_SUPABASE_URL=http://127.0.0.1:54321
   VITE_SUPABASE_ANON_KEY=your_local_anon_key
   ```

3. **Start Development Server**:
   ```bash
   npm run dev
   ```

### For Staging/Preview Deployments

1. **Get Supabase Credentials** from your staging project:
   - Go to your Supabase project dashboard
   - Navigate to Settings > API
   - Copy the Project URL and anon key

2. **Set Environment Variables** in your deployment platform:

   ```bash
   VITE_SUPABASE_URL=https://your-staging-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_staging_anon_key
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
   ```

3. **Deploy** your application

### For Production

1. **Get Production Credentials** from your production Supabase project
2. **Set Environment Variables** in your production deployment
3. **Deploy** with production configuration

## Troubleshooting

### Common Issues

1. **"supabaseUrl is required" Error**
   - Check that `VITE_SUPABASE_URL` is set in your environment
   - Ensure the URL format is correct (http:// for local, https:// for remote)

2. **Authentication Issues**
   - For local development: Authentication is bypassed
   - For remote environments: Ensure Clerk is properly configured

3. **RLS (Row Level Security) Issues**
   - Local development: Uses service role key to bypass RLS
   - Remote environments: Normal RLS applies, ensure proper policies

4. **Environment Detection Issues**
   - Check the console logs for environment detection output
   - Verify the Supabase URL format matches expected patterns

### Debug Information

The application logs detailed information about environment detection:

```javascript
console.log("🔧 Environment detection:", {
  supabaseUrl: "https://your-project.supabase.co",
  isLocal: false,
  isDevelopment: false,
});
```

### Testing Different Environments

You can test the environment detection by temporarily changing your `.env` file:

```bash
# Test local environment
VITE_SUPABASE_URL=http://127.0.0.1:54321

# Test remote environment
VITE_SUPABASE_URL=https://your-project.supabase.co
```

## Security Considerations

### Local Development

- Uses service role key to bypass RLS
- No authentication required
- **Never use service role key in production**

### Remote Environments

- Uses anon key with proper RLS
- Clerk authentication required
- Proper security policies applied

## Migration Between Environments

When moving from local to staging/production:

1. **Update Supabase URL** from local to remote
2. **Update anon key** to remote project key
3. **Configure Clerk** for authentication
4. **Test authentication flow**
5. **Verify RLS policies** work correctly

## Environment Variables Reference

| Variable                     | Local                    | Staging                 | Production              | Required |
| ---------------------------- | ------------------------ | ----------------------- | ----------------------- | -------- |
| `VITE_SUPABASE_URL`          | `http://127.0.0.1:54321` | `https://*.supabase.co` | `https://*.supabase.co` | ✅       |
| `VITE_SUPABASE_ANON_KEY`     | Local anon key           | Staging anon key        | Production anon key     | ✅       |
| `VITE_CLERK_PUBLISHABLE_KEY` | Optional                 | Required                | Required                | Staging+ |
| `VITE_APP_URL`               | `http://localhost:3000`  | Preview URL             | Production URL          | Optional |
