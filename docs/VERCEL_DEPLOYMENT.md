# Vercel Deployment Configuration

## Issue

The staging deployment at `dev.canvasm.app` was failing because the code was looking for `VITE_SUPABASE_URL` but the Supabase integration provides `NEXT_PUBLIC_SUPABASE_URL`.

## Solution

The code has been updated to work with both environments:

- **Local Development**: Uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from `.env`
- **Production/Staging**: Uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from Supabase integration

## Environment Variables

Your Vercel dashboard already has the correct variables from the Supabase integration:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `VITE_CLERK_PUBLISHABLE_KEY` (in Shared Environment Variables)

## Redeploy

After the code changes:

1. Go to your Vercel project
2. Click **Deployments**
3. Click **Redeploy** on your latest deployment

The app should now work correctly with the Supabase integration variables.

## Related Documentation

For comprehensive environment configuration details, see [Environment Configuration Guide](./ENVIRONMENT_CONFIG.md).

## Verification

After redeploying, the app should:

1. Load without environment variable errors
2. Connect to your production Supabase instance
3. Use Clerk authentication properly
