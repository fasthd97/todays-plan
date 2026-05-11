import { defineConfig } from 'vite';

export default defineConfig({
  // Base path must match your GitHub repo name for Pages to work correctly
  base: '/todays-plan/',

  build: {
    outDir: 'dist',
    // Copy manifest and service worker to dist as-is
    rollupOptions: {
      input: {
        main: 'index.html',
      },
    },
  },
});
