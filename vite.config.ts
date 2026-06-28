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
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          // NOTE: do NOT isolate react/react-dom/scheduler into their own chunk.
          // Under React 19, splitting React from its consumer cluster (Radix,
          // react-router, TanStack, sonner, …) yields a cross-chunk init order
          // where a consumer touches React.* before the React chunk finishes
          // initializing → "Cannot read properties of undefined (reading 'S')" /
          // "...setting 'Children'" crash in production. Let React fall through
          // to the generic `vendor` chunk alongside its consumers.
          if (id.includes("@clerk")) return "vendor-clerk";
          if (id.includes("@xyflow") || id.includes("reactflow") || id.includes("dagre")) return "vendor-flow";
          if (id.includes("@excalidraw")) return "vendor-excalidraw";
          if (id.includes("@editorjs") || id.includes("editorjs")) return "vendor-editorjs";
          if (id.includes("recharts") || id.includes("d3-")) return "vendor-charts";
          if (id.includes("mathjs") || id.includes("simple-statistics")) return "vendor-math";
          if (id.includes("@automerge")) return "vendor-automerge";
          // elkjs is large (~1.5MB) and only used on-demand for auto-layout;
          // give it its own chunk so the dynamic import stays lazy.
          if (id.includes("elkjs")) return "vendor-elk";
          return "vendor";
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
      test: {
        name: 'unit',
        environment: 'jsdom',
        include: ['src/**/*.{test,spec}.{ts,tsx}'],
        // Quarantined: these XState integration tests assert an older canvasMachine
        // shape (strokeColor/strokeWidth/designData) that has since drifted. They
        // never ran (no unit project existed), so they rotted. Tracked for repair
        // in docs/backlog/data-source-architecture.md build log; re-include once fixed.
        exclude: [
          'src/**/*.stories.*',
          'node_modules/**',
          'src/tests/xstate-canvas-integration.test.ts',
          'src/tests/xstate-react-integration.test.tsx',
        ],
      }
    }, {
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