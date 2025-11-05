import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // load env variables based on the current mode (development/production)
  const env = loadEnv(mode, process.cwd());

  // access env variables with defaults
  const PORT = Number(env.VITE_PORT) || 5173;

  return {
    base: mode === 'production' ? '/magic-portfolio/' : '/',
    plugins: [vue()],
    resolve: {
      alias: {
        "@": resolve(__dirname, "src"),
      },
    },
    server: {
      port: PORT,
      host: true,
      // No proxy needed - direct GitCMS access!
    },
    build: {
      outDir: "dist",
      assetsDir: "assets",
      sourcemap: true,
      minify: "esbuild",
      target: "es2020",
      rollupOptions: {
        output: {
          manualChunks: {
            three: ["three"],
            vue: ["vue", "vue-router"],
          },
        },
      },
    },
    optimizeDeps: {
      include: ["three", "vue", "vue-router"],
    },
    define: {
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
    },
  };
});
