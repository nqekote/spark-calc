import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

const base = process.env.GITHUB_PAGES ? '/spark-calc/' : '/'

/* Unique build hash — injected into JS bundle AND written to version.txt */
const buildHash = Date.now().toString(36)

/** Emits version.txt at build time for CDN-busted update detection */
function versionFilePlugin(hash: string): Plugin {
  return {
    name: 'version-txt',
    apply: 'build',
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'version.txt', source: hash })
    },
  }
}

export default defineConfig({
  base,
  define: {
    __BUILD_HASH__: JSON.stringify(buildHash),
  },
  plugins: [
    react(),
    versionFilePlugin(buildHash),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false,
      strategies: 'generateSW',
      includeAssets: ['favicon.ico', 'icons/*.png'],
      manifest: {
        name: 'JBox - Electrical Apprentice Tools',
        short_name: 'JBox',
        description: 'Offline electrical calculators for Ontario CEC apprentices',
        theme_color: '#0f0f1a',
        background_color: '#0f0f1a',
        display: 'standalone',
        orientation: 'portrait',
        start_url: base,
        scope: base,
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        shortcuts: [
          { name: "Ohm's Law", short_name: "Ohm's Law", url: base + 'electrical/ohms-law', icons: [{ src: 'icons/icon-192.png', sizes: '192x192' }] },
          { name: 'Voltage Drop', short_name: 'V-Drop', url: base + 'electrical/voltage-drop', icons: [{ src: 'icons/icon-192.png', sizes: '192x192' }] },
          { name: 'Conduit Fill', short_name: 'Conduit', url: base + 'conduit/fill', icons: [{ src: 'icons/icon-192.png', sizes: '192x192' }] },
          { name: 'Motor FLC', short_name: 'Motor FLC', url: base + 'motors/flc', icons: [{ src: 'icons/icon-192.png', sizes: '192x192' }] },
        ],
        categories: ['utilities', 'productivity'],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2}'],
        globIgnores: ['**/version.txt'],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        navigateFallback: base + 'index.html',
        navigateFallbackAllowlist: [/^(?!\/__).*/],
      },
      devOptions: { enabled: false },
    }),
  ],
})
