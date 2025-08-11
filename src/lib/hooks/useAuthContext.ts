import { useUser } from '@clerk/nextjs';
import { useMemo } from 'react';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  imageUrl?: string;
  username?: string;
}

export interface AuthContext {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  userId: string;
  userName: string;
  userEmail: string;
  // System-level operations
  isSystemUser: boolean;
  getSystemUserId: () => string;
  // For backwards compatibility and fallbacks
  getCurrentUserId: () => string;
  getCurrentUserName: () => string;
}

/**
 * Enhanced auth context hook that provides comprehensive user information
 * and handles system-level operations with proper fallbacks
 */
export function useAuthContext(): AuthContext {
  const { user: clerkUser, isLoaded: isClerkLoaded, isSignedIn } = useUser();

  const authContext: AuthContext = useMemo(() => {
    // Convert Clerk user to our AuthUser format
    const user: AuthUser | null = clerkUser
      ? {
          id: clerkUser.id,
          email:
            clerkUser.emailAddresses[0]?.emailAddress || 'unknown@metrimap.com',
          name:
            clerkUser.fullName ||
            clerkUser.firstName ||
            clerkUser.username ||
            'Unknown User',
          firstName: clerkUser.firstName || undefined,
          lastName: clerkUser.lastName || undefined,
          imageUrl: clerkUser.imageUrl,
          username: clerkUser.username || undefined,
        }
      : null;

    const isAuthenticated = isClerkLoaded && isSignedIn && !!user;
    const isLoading = !isClerkLoaded;

    // Provide safe defaults for required fields
    const userId = user?.id || 'anonymous-user';
    const userName = user?.name || 'Anonymous User';
    const userEmail = user?.email || 'anonymous@metrimap.com';

    // System user detection (for automated operations)
    const isSystemUser = userId === 'system' || userId === 'automated-system';

    // System user ID for automated operations
    const getSystemUserId = () => 'system';

    // Current user ID with fallback
    const getCurrentUserId = () => {
      if (isSystemUser) return 'system';
      return userId;
    };

    // Current user name with fallback
    const getCurrentUserName = () => {
      if (isSystemUser) return 'System';
      return userName;
    };

    return {
      user,
      isAuthenticated,
      isLoading,
      userId,
      userName,
      userEmail,
      isSystemUser,
      getSystemUserId,
      getCurrentUserId,
      getCurrentUserName,
    };
  }, [clerkUser, isClerkLoaded, isSignedIn]);

  return authContext;
}

/**
 * Hook for getting user ID with proper fallbacks
 * Replaces hardcoded 'current-user' references
 */
export function useCurrentUserId(): string {
  const { getCurrentUserId } = useAuthContext();
  return getCurrentUserId();
}

/**
 * Hook for getting user name with proper fallbacks
 * Replaces hardcoded user name references
 */
export function useCurrentUserName(): string {
  const { getCurrentUserName } = useAuthContext();
  return getCurrentUserName();
}

/**
 * Hook for system operations
 * Replaces hardcoded 'system' references
 */
export function useSystemUserId(): string {
  const { getSystemUserId } = useAuthContext();
  return getSystemUserId();
}

/**
 * Hook that determines if an operation should be attributed to system or user
 * @param isAutomated - Whether this is an automated operation
 */
export function useOperationUserId(isAutomated: boolean = false): string {
  const { getCurrentUserId, getSystemUserId } = useAuthContext();
  return isAutomated ? getSystemUserId() : getCurrentUserId();
}

/**
 * Hook that provides user information for evidence creation
 */
export function useEvidenceUser(): { userId: string; userName: string } {
  const { getCurrentUserId, getCurrentUserName } = useAuthContext();
  return {
    userId: getCurrentUserId(),
    userName: getCurrentUserName(),
  };
}

/**
 * Hook that provides user information for relationship tracking
 */
export function useRelationshipUser(): { userId: string; userName: string } {
  const { getCurrentUserId, getCurrentUserName } = useAuthContext();
  return {
    userId: getCurrentUserId(),
    userName: getCurrentUserName(),
  };
}
