import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';
import topLevelAwait from 'vite-plugin-top-level-await';
import wasm from 'vite-plugin-wasm';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-interactions',
    '@storybook/addon-vitest',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config) => {
    config.resolve = config.resolve || {};
    const existingAlias = (config.resolve as any).alias || {};
    (config.resolve as any).alias = {
      ...existingAlias,
      '@': path.resolve(__dirname, '../src'),
      // Mock Clerk and Userback for Storybook so components render without real auth or widget
      '@clerk/react-router': path.resolve(
        __dirname,
        './mocks/clerk-react-router.tsx'
      ),
      '@userback/widget': path.resolve(__dirname, './mocks/userback-widget.ts'),
    };

    // Provide minimal env defines used in components
    config.define = {
      ...(config.define || {}),
      'import.meta.env.NEXT_PUBLIC_SUPABASE_URL': JSON.stringify(
        process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'
      ),
      'import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY': JSON.stringify(
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'test_anon_key'
      ),
      'import.meta.env.VITE_CLERK_PUBLISHABLE_KEY': JSON.stringify(
        process.env.VITE_CLERK_PUBLISHABLE_KEY || 'pk_test_123'
      ),
    };

    // Add plugins required by the app
    config.plugins = [...(config.plugins || []), wasm(), topLevelAwait()];

    return config;
  },
};

export default config;

// Note: Remove duplicate exports or conflicting configs below this line
