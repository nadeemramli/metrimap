# Vercel Deployment Configuration

## Issue

The staging deployment at `dev.canvasm.app` is failing because the code was looking for `VITE_SUPABASE_URL` but the Supabase integration provides `NEXT_PUBLIC_SUPABASE_URL`.

## Error

```
VITE_SUPABASE_URL is required. Please check your .env file.
```

## Solution

The code has been updated to work with both environments:

- **Local Development**: Uses `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from `.env`
- **Production/Staging**: Uses `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` from Supabase integration

### Environment Variables

Your Vercel dashboard already has the correct variables from the Supabase integration:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `VITE_CLERK_PUBLISHABLE_KEY` (in Shared Environment Variables)

### Step 3: Redeploy

After the code changes:

1. Go to your Vercel project
2. Click **Deployments**
3. Click **Redeploy** on your latest deployment

The app should now work correctly with the Supabase integration variables.

## Current Local Configuration

Your local `.env` file contains:

```
VITE_SUPABASE_URL=http://127.0.0.1:54321
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
```

These are for local development only and won't work in production.

## Verification

After configuring the environment variables, the app should:

1. Load without the "VITE_SUPABASE_URL is required" error
2. Connect to your production Supabase instance
3. Use Clerk authentication properly

## Troubleshooting

If you still see issues:

1. Check that environment variables are set correctly in Vercel
2. Verify the Supabase URL and keys are correct
3. Ensure the Clerk key is for the correct environment
4. Redeploy the application after making changes
