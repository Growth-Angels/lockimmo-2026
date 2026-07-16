import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// En prod (build) : sous-chemin du site GitHub Pages (growth-angels.github.io/lockimmo-2026/).
// En dev (`npm run dev`) : on reste sur `/` pour ne pas casser le workflow local.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? '/lockimmo-2026/' : '/',
  plugins: [react()],
}))
