/**
 * vite.config.js - Cấu hình Vite cho dự án React
 * 
 * Mục đích:
 * - Cấu hình build tool Vite cho ứng dụng React
 * - Thiết lập port chạy dev server (5173)
 * - Cấu hình alias "@" trỏ về thư mục src/ để import gọn hơn
 */

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  // Cấu hình dev server
  server: {
    host: "::",
    port: 8080, // Port mặc định của Lovable preview
    hmr: {
      overlay: false,
    },
  },
  // Plugin React SWC - biên dịch JSX nhanh hơn Babel
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      // Alias "@" -> thư mục src/, giúp import gọn: import X from "@/api/shoesApi"
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
