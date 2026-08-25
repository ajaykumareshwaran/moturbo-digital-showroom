// TanStack Start configuration with custom server entry
// Includes: TanStack devtools, viteReact, tailwindcss, tsConfigPaths, nitro (cloudflare target),
// VITE_* env injection, @ path alias resolution, and error logging
import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
});
