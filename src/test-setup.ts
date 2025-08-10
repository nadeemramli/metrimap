// Global test setup for Vitest
import '@testing-library/jest-dom';

// Mock Clerk for tests to avoid auth and router integration complexity
import { vi } from 'vitest';

vi.mock('@clerk/react-router', async () => {
  const React = await import('react');
  const Fragment = React.Fragment;
  const MockProvider = ({ children }: { children?: React.ReactNode }) =>
    React.createElement(Fragment, null, children);

  return {
    ClerkProvider: MockProvider,
    SignedIn: MockProvider,
    SignedOut: MockProvider,
    SignIn: () => null,
    SignUp: () => null,
    useUser: () => ({ isSignedIn: false, user: null }),
    useAuth: () => ({
      isLoaded: true,
      isSignedIn: false,
      userId: null,
      sessionId: null,
      getToken: async () => null,
    }),
  };
});

// Optionally mock third-party widgets that may access DOM APIs not present in JSDOM
vi.mock('@userback/widget', () => ({
  default: {
    init: vi.fn(),
    setIdentity: vi.fn(),
    send: vi.fn(),
  },
}));

// Provide minimal environment variables if accessed during tests
// Note: Vite's `define` usually handles these, but we set fallbacks just in case
(globalThis as any).import_meta = (globalThis as any).import_meta || {};
(globalThis as any).import_meta.env = (globalThis as any).import_meta.env || {};
(globalThis as any).import_meta.env.NEXT_PUBLIC_SUPABASE_URL =
  (globalThis as any).import_meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  'http://localhost:54321';
(globalThis as any).import_meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY =
  (globalThis as any).import_meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'test_anon_key';
