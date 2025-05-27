import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vitest/config";

import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Configuración de testing
  test: {
    // Testing environment
    environment: "jsdom",

    // Configuration files
    setupFiles: ["./src/setupTests.ts"],

    // Test file patterns
    include: ["src/**/*.{test,spec}.{ts,tsx}"],

    // Configuration for axe-core
    testTimeout: 10000,

    // Coverage
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "src/setupTests.ts",
        "src/main.tsx",
        "src/vite-env.d.ts",
      ],
    },

    // Globals to avoid importing describe, it, expect
    globals: true,
  },
});
