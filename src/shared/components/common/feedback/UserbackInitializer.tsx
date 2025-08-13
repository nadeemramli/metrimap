import { useEffect } from "react";
import { useUser } from "@clerk/react-router";
import Userback from "@userback/widget";
import { isDevelopmentEnvironment } from "@/shared/lib/supabase/client";

export default function UserbackInitializer() {
  const { user, isLoaded } = useUser();
  const isDevelopment = isDevelopmentEnvironment();

  useEffect(() => {
    const initializeUserback = async () => {
      try {
        // Only initialize in non-development environments
        if (isDevelopment) {
          console.log("🔧 Userback disabled in development mode");
          return;
        }

        // Wait for Clerk to finish loading
        if (!isLoaded) {
          return;
        }

        console.log("🔧 Initializing Userback widget at top level...");

        // Prepare user data for Userback
        const options: any = {
          // Basic configuration
          smarty: true, // Enable smart feedback detection
          delay: 2000, // Wait 2 seconds before showing
        };

        // If user is authenticated, include their information
        if (user) {
          options.user_data = {
            id: user.id,
            info: {
              name: user.fullName || user.firstName || "User",
              email: user.emailAddresses?.[0]?.emailAddress || "",
              // Additional user context - convert to strings for Userback compatibility
              created_at: user.createdAt
                ? new Date(user.createdAt).toISOString()
                : undefined,
              last_sign_in: user.lastSignInAt
                ? new Date(user.lastSignInAt).toISOString()
                : undefined,
            },
          };

          console.log("🔧 Userback initialized with user:", {
            id: user.id,
            name: options.user_data.info.name,
            email: options.user_data.info.email,
          });
        } else {
          console.log("🔧 Userback initialized for anonymous user");
        }

        // Initialize Userback with your token - this is the key part
        const userback = await Userback("A-qbFmEFfLIKBhMnA3cIQCtd5fH", options);

        if (userback) {
          console.log(
            "✅ Userback widget successfully initialized at top level"
          );
        } else {
          console.warn("⚠️ Userback widget returned null/undefined");
        }
      } catch (error) {
        console.error("❌ Error initializing Userback at top level:", error);
      }
    };

    initializeUserback();
  }, [user, isLoaded, isDevelopment]);

  // This component doesn't render anything
  return null;
}
