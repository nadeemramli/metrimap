import { useAppStore } from '@/lib/stores';
import { createClerkSupabaseClient } from '@/shared/lib/supabase/client';
import { CreateUserSchema } from '@/shared/lib/validation/zod';
import { useAuth, useUser } from '@clerk/react-router';
import { useEffect } from 'react';

interface ClerkSupabaseProviderProps {
  children: React.ReactNode;
}

export default function ClerkSupabaseProvider({
  children,
}: ClerkSupabaseProviderProps) {
  console.log('ClerkSupabaseProvider rendering');
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const { setUser, signOut } = useAppStore();

  useEffect(() => {
    const syncUserWithSupabase = async () => {
      // Wait for Clerk to finish loading
      if (!isLoaded) {
        return;
      }

      if (user) {
        try {
          console.log('Syncing Clerk user with app store:', user.id);

          // Update the app store with Clerk user info
          setUser({
            id: user.id,
            name:
              user.fullName || user.emailAddresses[0]?.emailAddress || 'User',
            email: user.emailAddresses[0]?.emailAddress || '',
          });

          // Create Supabase client with Clerk authentication using NATIVE integration
          console.log(
            'Creating authenticated Supabase client with NATIVE Clerk integration'
          );

          // Create a function to get the Clerk session token (native approach)
          const getClerkSessionToken = async () => {
            try {
              // Use the native integration - no JWT template needed
              // This is the recommended approach (non-deprecated)
              const token = await getToken();
              return token;
            } catch (error) {
              console.error('Error getting Clerk session token:', error);
              return null;
            }
          };

          // Create the Clerk-authenticated Supabase client
          const supabaseClient =
            createClerkSupabaseClient(getClerkSessionToken);

          // Create or update user in Supabase using Clerk authentication
          // Validate user payload with Prisma/Zod before upsert
          const userPayload = {
            id: user.id,
            email: user.emailAddresses[0]?.emailAddress || '',
            name:
              user.fullName || user.emailAddresses[0]?.emailAddress || 'User',
            avatar_url: user.imageUrl || null,
            updated_at: new Date().toISOString(),
          } as const;
          try {
            // Prisma create schema doesn't include id/updated_at; validate subset
            CreateUserSchema.parse({
              email: userPayload.email,
              name: userPayload.name,
              avatar_url: userPayload.avatar_url,
            } as unknown);
          } catch (e) {
            console.error('Validation error for user upsert:', e);
          }

          const { error: upsertError } = await supabaseClient
            .from('users')
            .upsert(userPayload, { onConflict: 'id' });

          if (upsertError) {
            console.error('Error upserting user to Supabase:', upsertError);
          } else {
            console.log(
              'User successfully synced to Supabase using NATIVE Clerk integration'
            );
          }
        } catch (error) {
          console.error('Error syncing user with Supabase:', error);
        }
      } else {
        // User is signed out, clear app store
        console.log('User signed out, clearing app store');
        await signOut();
      }
    };

    syncUserWithSupabase();
  }, [user, isLoaded, getToken, setUser, signOut]);

  return <>{children}</>;
}
