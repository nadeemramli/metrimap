import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), wasm(), topLevelAwait()],
  define: {
    "import.meta.env.NEXT_PUBLIC_SUPABASE_URL": JSON.stringify(
      process.env.NEXT_PUBLIC_SUPABASE_URL
    ),
    "import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY": JSON.stringify(
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    port: 3000,
    host: "0.0.0.0",
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom"],
          clerk: ["@clerk/react-router"],
        },
      },
      onwarn(warning, warn) {
        // Suppress eval warnings from editorjs packages
        if (
          warning.code === "EVAL" &&
          (warning.id?.includes("editorjs-hyperlink") ||
            warning.id?.includes("editorjs-") ||
            warning.id?.includes("@editorjs/"))
        ) {
          return;
        }
        warn(warning);
      },
    },
  },
  worker: {
    format: "es",
    plugins: () => [react(), wasm(), topLevelAwait()],
  },
  optimizeDeps: {
    exclude: ["@/lib/workers/compute.worker.ts", "@automerge/automerge"],
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
  },
});
