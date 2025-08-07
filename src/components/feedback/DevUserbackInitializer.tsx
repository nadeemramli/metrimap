import { useEffect } from "react";
import Userback from "@userback/widget";
import { useAppStore } from "@/lib/stores";

export default function DevUserbackInitializer() {
  const { user } = useAppStore();

  useEffect(() => {
    const initializeUserback = async () => {
      try {
        // Only initialize if explicitly enabled
        const enableUserbackInDev =
          import.meta.env.VITE_ENABLE_USERBACK_DEV === "true";

        if (!enableUserbackInDev) {
          console.log(
            "🔧 Userback disabled in development (set VITE_ENABLE_USERBACK_DEV=true to enable)"
          );
          return;
        }

        console.log(
          "🔧 Initializing Userback widget at top level for development..."
        );

        // Prepare options for development mode
        const options: any = {
          smarty: true,
          delay: 1000, // Shorter delay in development
        };

        // Use development user data if available
        if (user) {
          options.user_data = {
            id: user.id || "dev-user",
            info: {
              name: user.name || "Development User",
              email: user.email || "dev@canvasm.app",
              environment: "development",
              // Add timestamps as strings for Userback compatibility
              created_at: new Date().toISOString(),
              last_sign_in: new Date().toISOString(),
            },
          };

          console.log("🔧 Userback initialized with dev user:", {
            id: options.user_data.id,
            name: options.user_data.info.name,
            email: options.user_data.info.email,
          });
        } else {
          // Fallback development user
          options.user_data = {
            id: "dev-anonymous",
            info: {
              name: "Anonymous Dev User",
              email: "anonymous@canvasm.app",
              environment: "development",
              created_at: new Date().toISOString(),
              last_sign_in: new Date().toISOString(),
            },
          };

          console.log("🔧 Userback initialized for anonymous dev user");
        }

        // Initialize Userback
        const userback = await Userback("A-qbFmEFfLIKBhMnA3cIQCtd5fH", options);

        if (userback) {
          console.log(
            "✅ Userback widget successfully initialized at top level for development"
          );
          console.log("🔧 Userback widget object:", userback);
        } else {
          console.warn("⚠️ Userback widget returned null/undefined");
        }
      } catch (error) {
        console.error(
          "❌ Error initializing Userback at top level for development:",
          error
        );
      }
    };

    initializeUserback();
  }, [user]);

  // This component doesn't render anything
  return null;
}
