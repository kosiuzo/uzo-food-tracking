import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  server: {
    host: "localhost", // Changed from "::" to avoid IPv6 issues
    port: 8080,
    hmr: {
      overlay: false,
      port: 8081, // Use separate port for HMR WebSocket
    },
    watch: {
      usePolling: true,
      interval: 1000, // Add polling interval for stability
    },
    // Add WebSocket configuration for better stability
    ws: {
      port: 8082, // Dedicated WebSocket port
    },
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
