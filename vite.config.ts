/// <reference types="vitest/config" />
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

// https://vite.dev/config/
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react(), wasm(), topLevelAwait()],
  define: {
    "import.meta.env.NEXT_PUBLIC_SUPABASE_URL": JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_URL),
    "import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY": JSON.stringify(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  },
  server: {
    port: 3000,
    host: "0.0.0.0"
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          clerk: ["@clerk/react-router"]
        }
      },
      onwarn(warning, warn) {
        // Suppress eval warnings from editorjs packages
        if (warning.code === "EVAL" && (warning.id?.includes("editorjs-hyperlink") || warning.id?.includes("editorjs-") || warning.id?.includes("@editorjs/"))) {
          return;
        }
        warn(warning);
      }
    }
  },
  worker: {
    format: "es",
    plugins: () => [react(), wasm(), topLevelAwait()]
  },
  optimizeDeps: {
    exclude: ["@/lib/workers/compute.worker.ts", "@automerge/automerge"]
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
    projects: [{
      extends: true,
      plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      storybookTest({
        configDir: path.join(dirname, '.storybook')
      })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: 'playwright',
          instances: [{
            browser: 'chromium'
          }]
        },
        setupFiles: ['.storybook/vitest.setup.ts']
      }
    }]
  }
});