import { Navigate, useLocation } from "react-router-dom";
import { useUser, useAuth } from "@clerk/react-router";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoaded } = useUser();
  const { isSignedIn } = useAuth();
  const location = useLocation();

  // Show loading while Clerk is loading
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!isSignedIn || !user) {
    return (
      <Navigate
        to="/auth/sign-in"
        state={{ from: location.pathname }}
        replace
      />
    );
  }

  return <>{children}</>;
}
