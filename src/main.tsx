import { ClerkProvider } from '@clerk/react-router';
import { dark } from '@clerk/themes';
import { StrictMode, useSyncExternalStore, type ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App.tsx';
import UserbackInitializer from './shared/components/common/feedback/UserbackInitializer';
import { captureAttribution } from './shared/utils/attribution';
import './styles/index.css';

// Capture utm_* attribution from the landing URL BEFORE the router mounts
// (alias redirects rewrite the URL; first-touch must read the original one).
captureAttribution();

// Import your Publishable Key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

console.log('Clerk Publishable Key:', PUBLISHABLE_KEY ? 'Set' : 'Not set');

/**
 * Tracks whether the app is in a dark theme by observing the class next-themes
 * writes on <html>. ClerkProvider lives ABOVE the next-themes ThemeProvider, so
 * we can't use `useTheme()` here — we read the applied class directly instead.
 * Both `dark` and the warm-black `night` theme count as dark.
 */
function useIsDarkTheme() {
  return useSyncExternalStore(
    (onChange) => {
      const observer = new MutationObserver(onChange);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class'],
      });
      return () => observer.disconnect();
    },
    () => {
      const cls = document.documentElement.classList;
      return cls.contains('dark') || cls.contains('night');
    },
    () => false
  );
}

/** ClerkProvider whose appearance follows the in-app theme (light / dark / night). */
function ThemedClerkProvider({ children }: { children: ReactNode }) {
  const isDark = useIsDarkTheme();
  return (
    <ClerkProvider
      publishableKey={PUBLISHABLE_KEY}
      appearance={isDark ? { baseTheme: dark } : undefined}
    >
      {children}
    </ClerkProvider>
  );
}

if (!PUBLISHABLE_KEY) {
  console.error(
    'Missing Clerk Publishable Key. Please add VITE_CLERK_PUBLISHABLE_KEY to your .env file'
  );
  // Instead of throwing, let's show a helpful error page
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
          fontFamily: 'system-ui, sans-serif',
          padding: '20px',
          textAlign: 'center',
        }}
      >
        <div>
          <h1>🚨 Configuration Error</h1>
          <p>Missing Clerk Publishable Key</p>
          <p>
            Please add <code>VITE_CLERK_PUBLISHABLE_KEY</code> to your .env file
          </p>
          <p>
            Get your key from the{' '}
            <a
              href="https://dashboard.clerk.com"
              target="_blank"
              rel="noopener"
            >
              Clerk Dashboard
            </a>
          </p>
        </div>
      </div>
    </StrictMode>
  );
  throw new Error('Add your Clerk Publishable Key to the .env file');
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemedClerkProvider>
        <UserbackInitializer />
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </ThemedClerkProvider>
    </BrowserRouter>
  </StrictMode>
);
