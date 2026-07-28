import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [
    react(),
    VitePWA({
      // 'prompt' (não 'autoUpdate'): o SW novo NÃO assume sozinho nem apaga o
      // cache por baixo de uma aba aberta — assim ela continua conseguindo
      // carregar seus chunks (ex: o PDF sob demanda) mesmo após um deploy novo.
      // A troca de versão é feita pelo aviso "Atualizar" (ver shared/pwa).
      registerType: 'prompt',
      // Registramos o SW manualmente em src/main.tsx para controlar o aviso.
      injectRegister: null,
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'flavis — antes & depois',
        short_name: 'flavis',
        description: 'Gerador de relatórios de antes e depois para serviços de reforma.',
        lang: 'pt-BR',
        theme_color: '#3B5A4E',
        background_color: '#F3F3F1',
        display: 'standalone',
        icons: [
          { src: 'pwa-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
})
