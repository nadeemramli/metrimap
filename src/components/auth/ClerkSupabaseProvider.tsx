import { useEffect } from "react";
import { useUser, useAuth } from "@clerk/react-router";
import { useAppStore } from "@/lib/stores";
import { supabase } from "@/lib/supabase/client";

interface ClerkSupabaseProviderProps {
  children: React.ReactNode;
}

export default function ClerkSupabaseProvider({
  children,
}: ClerkSupabaseProviderProps) {
  console.log("ClerkSupabaseProvider rendering");
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
          console.log("Syncing Clerk user with app store:", user.id);
          
          // Update the app store with Clerk user info
          setUser({
            id: user.id,
            name:
              user.fullName || user.emailAddresses[0]?.emailAddress || "User",
            email: user.emailAddresses[0]?.emailAddress || "",
          });

          // Get JWT token from Clerk for Supabase
          const token = await getToken({ template: "supabase" });
          
          if (token) {
            // Set the session with Clerk's JWT
            const { error: sessionError } = await supabase.auth.setSession({
              access_token: token,
              refresh_token: token,
            });

            if (sessionError) {
              console.error("Error setting Supabase session:", sessionError);
            } else {
              console.log("Supabase session set successfully with Clerk JWT");
            }

            // Create or update user in Supabase using the authenticated session
            const { error: upsertError } = await supabase
              .from("users")
              .upsert(
                {
                  id: user.id,
                  email: user.emailAddresses[0]?.emailAddress || "",
                  name:
                    user.fullName ||
                    user.emailAddresses[0]?.emailAddress ||
                    "User",
                  avatar_url: user.imageUrl || null,
                  updated_at: new Date().toISOString(),
                },
                {
                  onConflict: "id",
                }
              );

            if (upsertError) {
              console.error("Error upserting user to Supabase:", upsertError);
            } else {
              console.log("User successfully synced to Supabase");
            }
          } else {
            console.warn("No JWT token available from Clerk");
          }
        } catch (error) {
          console.error("Error syncing user with Supabase:", error);
        }
      } else {
        // User is signed out, clear app store
        console.log("User signed out, clearing app store");
        await signOut();
      }
    };

    syncUserWithSupabase();
  }, [user, isLoaded, getToken, setUser, signOut]);

  return <>{children}</>;
}
