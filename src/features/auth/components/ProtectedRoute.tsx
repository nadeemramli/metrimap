import {
  useAuth,
  useOrganization,
  useOrganizationList,
  useUser,
} from '@clerk/react-router';
import { Loader2 } from 'lucide-react';
import { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, isLoaded } = useUser();
  const { isSignedIn } = useAuth();
  const location = useLocation();

  // Orgs-only model: a workspace is a Clerk org, so the session must always have
  // an active org (auto-created on sign-up). If we're in the personal context,
  // activate the user's first org — otherwise org-scoped data would read empty.
  const { organization } = useOrganization();
  const { isLoaded: orgListLoaded, setActive, userMemberships } =
    useOrganizationList({ userMemberships: true });

  useEffect(() => {
    if (!isSignedIn || organization || !orgListLoaded || !setActive) return;
    const first = userMemberships?.data?.[0]?.organization;
    if (first) {
      void setActive({ organization: first.id });
    }
  }, [isSignedIn, organization, orgListLoaded, setActive, userMemberships]);

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
      <Navigate to="/auth/sign-in" state={{ from: location.pathname }} replace />
    );
  }

  return <>{children}</>;
}
