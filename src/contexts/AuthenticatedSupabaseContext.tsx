import { createContext, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import { useClerkSupabase } from "@/hooks/useClerkSupabase";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { setAuthenticatedClient } from "@/lib/utils/authenticatedClient";
import { createDevSupabaseClient } from "@/lib/supabase/client";

interface AuthenticatedSupabaseContextType {
  supabaseClient: SupabaseClient<Database>;
}

const AuthenticatedSupabaseContext =
  createContext<AuthenticatedSupabaseContextType | null>(null);

export function AuthenticatedSupabaseProvider({
  children,
}: {
  children: ReactNode;
}) {
  // Check if we're in development mode
  const isDevelopment =
    import.meta.env.VITE_SUPABASE_URL?.includes("127.0.0.1") ||
    import.meta.env.VITE_SUPABASE_URL?.includes("localhost");

  // Use development client in development mode, otherwise use Clerk client
  const supabaseClient = isDevelopment
    ? createDevSupabaseClient()
    : useClerkSupabase();

  // Set the authenticated client for stores to use
  useEffect(() => {
    setAuthenticatedClient(supabaseClient);
  }, [supabaseClient]);

  return (
    <AuthenticatedSupabaseContext.Provider value={{ supabaseClient }}>
      {children}
    </AuthenticatedSupabaseContext.Provider>
  );
}

export function useAuthenticatedSupabase() {
  const context = useContext(AuthenticatedSupabaseContext);
  if (!context) {
    throw new Error(
      "useAuthenticatedSupabase must be used within AuthenticatedSupabaseProvider"
    );
  }
  return context.supabaseClient;
}
