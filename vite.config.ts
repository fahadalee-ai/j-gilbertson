import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  // Nitro writes the Vercel Build Output API to `.vercel/output`.
  nitro: {
    preset: "vercel",
  },
  vite: {
    // Served from the domain root on Vercel, not a subpath.
    base: "/",
  },
});
