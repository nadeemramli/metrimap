# Clerk Integration

This project now uses Clerk for authentication, integrated with Supabase for data persistence.

## Setup

1. **Environment Variables**: Ensure your `.env` file contains:

   ```
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
   ```

2. **Clerk Dashboard Configuration**:
   - Set up JWT templates for Supabase integration
   - Configure sign-in and sign-up flows
   - Set up redirect URLs

## Key Components

### `ClerkSupabaseProvider`

- Syncs Clerk user sessions with Supabase
- Handles JWT token exchange
- Updates app store with user information

### `UserMenu`

- Updated to use Clerk's user management
- Includes profile image, name, and email
- Provides sign-out functionality

### Authentication Flow

- `/auth/sign-in` - Clerk sign-in page
- `/auth/sign-up` - Clerk sign-up page
- Protected routes use `<SignedIn>` wrapper
- Unauthenticated users are redirected to sign-in

## Features

- ✅ Clerk authentication
- ✅ Supabase integration via JWT
- ✅ User profile management
- ✅ Automatic session sync
- ✅ Protected routes
- ✅ Sign-out functionality

## Usage

The app now uses Clerk's authentication components:

- `<SignIn />` - For sign-in forms
- `<SignUp />` - For sign-up forms
- `<SignedIn>` - To protect routes
- `<SignedOut>` - For unauthenticated users
- `<SignOutButton>` - For sign-out functionality

All existing Supabase functionality remains intact, with authentication now handled by Clerk.
