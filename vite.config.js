import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  base: '/', // Asegura rutas correctas
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Dividir dependencias grandes en archivos separados
          'react-vendors': ['react', 'react-dom'],
          'date-fns': ['date-fns'],
          'html2canvas': ['html2canvas'],
        },
      },
    },
    chunkSizeWarningLimit: 500, // Aumenta el límite para que no salgan advertencias
  },
});
