import { useEffect } from "react";
import { useUser } from "@clerk/react-router";
import Userback from "@userback/widget";
import { isDevelopmentEnvironment } from "@/lib/supabase/client";

interface UserbackProviderProps {
  children: React.ReactNode;
}

export default function UserbackProvider({ children }: UserbackProviderProps) {
  const { user, isLoaded } = useUser();
  const isDevelopment = isDevelopmentEnvironment();

  useEffect(() => {
    const initializeUserback = async () => {
      try {
        // Only initialize in non-development environments or if explicitly enabled in development
        if (isDevelopment) {
          console.log("🔧 Userback disabled in development mode");
          return;
        }

        // Wait for Clerk to finish loading
        if (!isLoaded) {
          return;
        }

        console.log("🔧 Initializing Userback widget...");

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
              // Additional user context
              created_at: user.createdAt,
              last_sign_in: user.lastSignInAt,
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

        // Initialize Userback with your token
        const userback = await Userback("A-qbFmEFfLIKBhMnA3cIQCtd5fH", options);

        // Optional: Add custom styling or configuration
        if (userback) {
          console.log("✅ Userback widget successfully initialized");
        }
      } catch (error) {
        console.error("❌ Error initializing Userback:", error);
      }
    };

    initializeUserback();
  }, [user, isLoaded, isDevelopment]);

  return <>{children}</>;
}
