import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env: any = loadEnv(mode, process.cwd(), '');
  const PORT: number = parseInt(env.VITE_CLIENT_PORT);

  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: PORT,
      headers: {
        "Cross-Origin-Opener-Policy": "same-origin-allow-popups"
      }
    },
    preview: {
      port: PORT,
    },
  }
})
