import { useEffect } from "react";
import { useUser } from "@clerk/react-router";
import { useAppStore } from "@/lib/stores";

interface ClerkSupabaseProviderProps {
  children: React.ReactNode;
}

export default function ClerkSupabaseProvider({
  children,
}: ClerkSupabaseProviderProps) {
  console.log("ClerkSupabaseProvider rendering");
  const { user } = useUser();
  const { setUser, signOut } = useAppStore();

  useEffect(() => {
    const syncUserWithSupabase = async () => {
      if (user) {
        try {
          // Update the app store with Clerk user info
          setUser({
            id: user.id,
            name:
              user.fullName || user.emailAddresses[0]?.emailAddress || "User",
            email: user.emailAddresses[0]?.emailAddress || "",
          });

          // TODO: Add JWT template integration when configured in Clerk dashboard
          // const token = await getToken({ template: "supabase" });
          // if (token) {
          //   const { data, error } = await supabase.auth.setSession({
          //     access_token: token,
          //     refresh_token: token,
          //   });
          //   if (error) {
          //     console.error("Error setting Supabase session:", error);
          //   }
          // }
        } catch (error) {
          console.error("Error syncing user with Supabase:", error);
        }
      } else {
        // User is signed out, clear app store
        await signOut();
      }
    };

    syncUserWithSupabase();
  }, [user, setUser, signOut]);

  return <>{children}</>;
}
