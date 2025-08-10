import React from 'react';

export const ClerkProvider: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => <>{children}</>;
export const SignedIn: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => <>{children}</>;
export const SignedOut: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => <>{children}</>;
export const SignIn: React.FC = () => null;
export const SignUp: React.FC = () => null;
export const useUser = () => ({ isSignedIn: false, user: null });
export const useAuth = () => ({
  isLoaded: true,
  isSignedIn: false,
  userId: null,
  sessionId: null,
  getToken: async () => null,
});
