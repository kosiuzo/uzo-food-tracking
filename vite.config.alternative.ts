import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Alternative configuration if WebSocket issues persist
// Rename this to vite.config.ts if the main config doesn't work
export default defineConfig(() => ({
  server: {
    host: "127.0.0.1", // Use IPv4 loopback instead of localhost
    port: 8080,
    hmr: {
      overlay: false,
      clientPort: 8080, // Force client to use same port
    },
    watch: {
      usePolling: false, // Disable polling to use native file watching
      ignored: ['**/node_modules/**', '**/.git/**'],
    },
    // Disable WebSocket compression which can cause RSV1 issues
    ws: {
      port: 8080, // Use same port as server
      compress: false, // Disable compression to avoid frame corruption
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
  // Add build optimizations that might help
  optimizeDeps: {
    exclude: ['@supabase/supabase-js'],
  },
}));
