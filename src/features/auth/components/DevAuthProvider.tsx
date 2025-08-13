import { useEffect, useState } from "react";
import { useAppStore } from "@/lib/stores";
import { createDevSupabaseClient } from "@/shared/lib/supabase/client";

interface DevAuthProviderProps {
  children: React.ReactNode;
}

export default function DevAuthProvider({ children }: DevAuthProviderProps) {
  const { setUser } = useAppStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const setupDevAuth = async () => {
      try {
        // Create a development user with valid UUID
        const devUser = {
          id: "550e8400-e29b-41d4-a716-446655440000",
          name: "Development User",
          email: "dev@example.com",
        };

        // Set the user in the app store
        setUser(devUser);

        // Create the user in local Supabase if it doesn't exist
        const supabase = createDevSupabaseClient();

        const { error } = await supabase.from("users").upsert(
          {
            id: devUser.id,
            email: devUser.email,
            name: devUser.name, // Changed from 'full_name' to 'name'
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "id",
          }
        );

        if (error) {
          console.error("Error creating dev user:", error);
        } else {
          console.log("Development user setup complete");
        }
      } catch (error) {
        console.error("Error setting up dev auth:", error);
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
