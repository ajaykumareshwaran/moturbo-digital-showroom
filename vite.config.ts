import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import netlify from "@netlify/vite-plugin-tanstack-start";

export default defineConfig({
  plugins: [
    tanstackStart({
      // Keep custom server entry for SSR error wrapper behavior.
      server: { entry: "server" },
    }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
    netlify(),
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          // Keep Three.js + R3F in a single lazy chunk so the main bundle
          // stays small and the 3D scene only loads when the page needs it.
          if (
            id.includes("/node_modules/three/") ||
            id.includes("/node_modules/@react-three/")
          ) {
            return "vendor-three";
          }
          // Framer-motion is large (~100 kB gz); split it from the app chunk.
          if (id.includes("/node_modules/framer-motion/")) {
            return "vendor-motion";
          }
        },
      },
    },
  },
});
