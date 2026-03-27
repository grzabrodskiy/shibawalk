import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const buildId =
    env.VERCEL_GIT_COMMIT_SHA?.slice(0, 8) ??
    env.GITHUB_SHA?.slice(0, 8) ??
    new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14);

  return {
    plugins: [react()],
    define: {
      __APP_BUILD_ID__: JSON.stringify(buildId),
    },
  };
});
