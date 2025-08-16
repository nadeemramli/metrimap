import { useAppStore } from '@/lib/stores';
import { createDevSupabaseClient } from '@/shared/lib/supabase/client';
import { useEffect, useState } from 'react';

interface DevAuthProviderProps {
  children: React.ReactNode;
}

export default function DevAuthProvider({ children }: DevAuthProviderProps) {
  const { setUser } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const setupDevAuth = async () => {
      try {
        // Create a development user with text ID (matching database schema)
        const devUser = {
          id: 'dev-user-001',
          name: 'Development User',
          email: 'dev@example.com',
        };

        // Set the user in the app store
        setUser(devUser);

        // Create the user in local Supabase if it doesn't exist
        const supabase = createDevSupabaseClient();

        console.log('🔧 Creating dev user in database:', devUser);

        // Check if a user already exists with this email to avoid UNIQUE(email) violation
        const { data: existing, error: checkErr } = await supabase
          .from('users')
          .select('id')
          .eq('email', devUser.email)
          .maybeSingle();

        if (checkErr) {
          console.warn('⚠️ Error checking dev user existence:', checkErr);
        }

        if (existing?.id && existing.id !== devUser.id) {
          // Email exists bound to another id; align to our fixed dev id by updating email on existing id
          await supabase
            .from('users')
            .update({ email: `${devUser.email}.old` })
            .eq('id', existing.id);
        }

        // Upsert by id only; this will insert if missing, or update if our id exists
        const { data, error } = await supabase
          .from('users')
          .upsert(
            {
              id: devUser.id,
              email: devUser.email,
              name: devUser.name,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'id' }
          )
          .select()
          .maybeSingle();

        if (error) {
          console.error('❌ Error creating dev user:', error);
          console.error('Error details:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
          });
        } else {
          console.log('✅ Development user setup complete:', data);
        }
      } catch (error) {
        console.error('Error setting up dev auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    setupDevAuth();
  }, [setUser]);

  if (isLoading) {
    return <div>Loading development environment...</div>;
  }

  return <>{children}</>;
}
