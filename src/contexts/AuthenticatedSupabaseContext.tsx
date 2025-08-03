import { createContext, useContext, useEffect } from "react";
import type { ReactNode } from "react";
import { useClerkSupabase } from "@/hooks/useClerkSupabase";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import { setAuthenticatedClient } from "@/lib/utils/authenticatedClient";

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
  const supabaseClient = useClerkSupabase();

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
