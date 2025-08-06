import { useEffect } from "react";
import { useUser, useAuth } from "@clerk/react-router";
import { useAppStore } from "@/lib/stores";
import { getClerkSupabaseClient } from "@/lib/supabase/client";

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

          // Create Supabase client with Clerk authentication using native integration
          console.log(
            "Creating authenticated Supabase client with native integration"
          );
          const supabaseClient = getClerkSupabaseClient();

          // Set authentication headers
          const token = await getToken();
          if (token) {
            supabaseClient.rest.headers["Authorization"] = `Bearer ${token}`;
          }

          // Ensure development user exists in production database
          // Temporarily disabled due to JWT signature issues
          // await ensureDevUserExists(
          //   user.id,
          //   user.emailAddresses[0]?.emailAddress || "",
          //   user.fullName || user.emailAddresses[0]?.emailAddress || "User",
          //   supabaseClient
          // );

          // Create or update user in Supabase using Clerk authentication
          const { error: upsertError } = await supabaseClient
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
            console.log(
              "User successfully synced to Supabase using native integration"
            );
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
