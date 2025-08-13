import { CreateUserSchema } from '@/shared/lib/validation/zod';
import type { SupabaseClient } from '@supabase/supabase-js';
import { supabase } from '../supabase/client';
import type { Database } from '../supabase/types';

export async function syncDevUserToProduction(
  userId: string,
  email: string,
  name?: string,
  authenticatedClient?: SupabaseClient<Database>
) {
  const client = authenticatedClient || supabase();

  try {
    // Check if user already exists
    const { data: existingUser, error: checkError } = await client
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking user existence:', checkError);
      throw checkError;
    }

    if (!existingUser) {
      // User doesn't exist, create them
      const payload = {
        id: userId,
        email: email,
        name: name || email.split('@')[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      } as const;
      try {
        // Validate subset (Prisma create excludes id/timestamps)
        CreateUserSchema.parse({
          email: payload.email,
          name: payload.name,
        } as unknown);
      } catch (e) {
        console.error('Validation error creating user:', e);
        throw e;
      }
      const { data: newUser, error: insertError } = await client
        .from('users')
        .insert(payload)
        .select()
        .single();

      if (insertError) {
        console.error('Error creating user:', insertError);
        throw insertError;
      }

      console.log('✅ Development user synced to production:', newUser);
      return newUser;
    } else {
      console.log('✅ User already exists in production:', existingUser);
      return existingUser;
    }
  } catch (error) {
    console.error('❌ Failed to sync development user:', error);
    throw error;
  }
}

export async function ensureDevUserExists(
  userId: string,
  email: string,
  name?: string,
  authenticatedClient?: SupabaseClient<Database>
) {
  // Only sync in development
  if (import.meta.env.DEV) {
    try {
      await syncDevUserToProduction(userId, email, name, authenticatedClient);
    } catch (error) {
      console.warn(
        '⚠️ Failed to sync development user, continuing anyway:',
        error
      );
    }
  }
}
