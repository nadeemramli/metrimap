import { useEffect } from "react";
import { useAppStore } from "@/lib/stores";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  const { initializeAuth, isInitialized } = useAppStore();

  useEffect(() => {
    if (!isInitialized) {
      initializeAuth();
    }
  }, [initializeAuth, isInitialized]);

  return <>{children}</>;
}
