import { useEffect } from "react";
import Userback from "@userback/widget";
import { useAppStore } from "@/lib/stores";

interface DevUserbackProviderProps {
  children: React.ReactNode;
}

export default function DevUserbackProvider({
  children,
}: DevUserbackProviderProps) {
  const { user } = useAppStore();

  useEffect(() => {
    const initializeUserback = async () => {
      try {
        console.log("🔧 Initializing Userback widget for development...");

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
            },
          };

          console.log("🔧 Userback initialized for anonymous dev user");
        }

        // Initialize Userback
        const userback = await Userback("A-qbFmEFfLIKBhMnA3cIQCtd5fH", options);

        if (userback) {
          console.log(
            "✅ Userback widget successfully initialized for development"
          );
        }
      } catch (error) {
        console.error("❌ Error initializing Userback in development:", error);
      }
    };

    // Only initialize if explicitly enabled (you can add an env var for this)
    const enableUserbackInDev =
      import.meta.env.VITE_ENABLE_USERBACK_DEV === "true";

    if (enableUserbackInDev) {
      initializeUserback();
    } else {
      console.log(
        "🔧 Userback disabled in development (set VITE_ENABLE_USERBACK_DEV=true to enable)"
      );
    }
  }, [user]);

  return <>{children}</>;
}
