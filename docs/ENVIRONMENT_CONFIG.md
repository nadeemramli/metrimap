# Environment Configuration

This document outlines the environment configuration for different deployment stages.

## Overview

The application supports two main environments:

- **Local Development**: Uses local Supabase instance and Vite environment variables
- **Production/Staging**: Uses remote Supabase instance via Supabase integration

## Environment Variables

### Local Development

**File**: `.env` (local only, not committed to git)

```bash
# Clerk Configuration
VITE_CLERK_PUBLISHABLE_KEY=pk_test_bW9kZXJuLXBob2VuaXgtMTkuY2xlcmsuYWNjb3VudHMuZGV2JA

# Supabase Configuration (Local Development)
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0

# App URL
VITE_APP_URL=http://dev.canvasm.app:5173
```

**Characteristics**:

- Uses local Supabase instance (localhost:54321)
- Uses demo/development keys
- Bypasses Row Level Security (RLS) for development
- Uses Clerk test keys

### Production/Staging

**Source**: Supabase Integration in Vercel Dashboard

```bash
# Automatically provided by Supabase Integration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-production-anon-key

# Clerk Configuration (Shared Environment Variables)
VITE_CLERK_PUBLISHABLE_KEY=your-production-clerk-key
```

**Characteristics**:

- Uses remote Supabase instance
- Uses production keys
- Enforces Row Level Security (RLS)
- Uses Clerk production keys

## Environment Detection

The application automatically detects the environment:

```typescript
// Enhanced environment detection
const isDevelopmentEnvironment = () => {
  // Check both Vite and Supabase integration variables
  const supabaseUrl =
    import.meta.env.VITE_SUPABASE_URL ||
    import.meta.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) return false;

  // Check for local development URLs
  const isLocal =
    supabaseUrl.includes("127.0.0.1") ||
    supabaseUrl.includes("localhost") ||
    supabaseUrl.includes("0.0.0.0");

  return isLocal;
};
```

## Environment-Specific Behavior

### Local Development (`isDevelopmentEnvironment() === true`)

- **Authentication**: Bypassed with development user
- **RLS**: Bypassed using service role key
- **Database**: Local Supabase instance
- **Features**: Full development features enabled
- **Debugging**: Enhanced logging and error reporting

### Production/Staging (`isDevelopmentEnvironment() === false`)

- **Authentication**: Clerk authentication required
- **RLS**: Enforced with proper policies
- **Database**: Remote Supabase instance
- **Features**: Production features only
- **Security**: Full security measures active

## Setup Instructions

### Local Development Setup

1. **Install Supabase CLI**:

   ```bash
   npm install -g supabase
   ```

2. **Start local Supabase**:

   ```bash
   supabase start
   ```

3. **Create `.env` file**:

   ```bash
   cp .env.example .env
   # Edit with your local values
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

### Production/Staging Setup

1. **Supabase Integration**: Already configured in Vercel
2. **Environment Variables**: Automatically provided by integration
3. **Deployment**: Automatic via Vercel

## Vercel Dashboard Configuration

### Preview Environment

- `NEXT_PUBLIC_SUPABASE_URL`: Set by Supabase integration
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Set by Supabase integration
- `SUPABASE_URL`: Set by Supabase integration
- `SUPABASE_ANON_KEY`: Set by Supabase integration
- `POSTGRES_USER`: Set by Supabase integration
- `POSTGRES_HOST`: Set by Supabase integration
- `POSTGRES_DATABASE`: Set by Supabase integration

### Shared Environment Variables

- `VITE_CLERK_PUBLISHABLE_KEY`: Production Clerk key

## Troubleshooting

### Local Development Issues

**Problem**: "VITE_SUPABASE_URL is required"
**Solution**: Ensure `.env` file exists and contains correct local values

**Problem**: Supabase connection failed
**Solution**: Run `supabase start` to start local instance

### Production/Staging Issues

**Problem**: "Supabase URL is required"
**Solution**: Check that Supabase integration is properly configured in Vercel

**Problem**: Authentication not working
**Solution**: Verify Clerk publishable key is set correctly

## Security Considerations

### Local Development

- Uses demo keys (safe for local development)
- Bypasses security measures for easier development
- Never commit `.env` file to version control

### Production/Staging

- Uses production keys
- Enforces all security measures
- Environment variables managed by Vercel

## Migration Between Environments

### Local → Staging

1. Ensure code works with local environment
2. Push to repository
3. Vercel automatically deploys with production environment variables

### Staging → Production

1. Test thoroughly in staging environment
2. Promote deployment in Vercel dashboard
3. Same environment variables used for both

## Best Practices

1. **Never commit environment files**: Keep `.env` in `.gitignore`
2. **Use different keys**: Local development should use different keys than production
3. **Test both environments**: Ensure features work in both local and staging
4. **Monitor deployments**: Check Vercel logs for environment-related issues
5. **Document changes**: Update this document when environment configuration changes
