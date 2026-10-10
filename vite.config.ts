import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base relativa: o build funciona tanto no GitHub Pages (/flashclip/)
// quanto em qualquer outra hospedagem estática.
export default defineConfig({
  plugins: [react()],
  base: "./",
  build: {
    // GSAP + Framer Motion + Supabase num único bundle (~235 kB gzip).
    chunkSizeWarningLimit: 900,
  },
});
