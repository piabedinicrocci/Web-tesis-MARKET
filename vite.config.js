import { fileURLToPath, URL } from "url";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server:{
    proxy:{
      '/api': {
        target: 'https://api-proyecto-final.herokuapp.com',
        changeOrigin: true,
        secure:false,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
    }
  }
  
});


