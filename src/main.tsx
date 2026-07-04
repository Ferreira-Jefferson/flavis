import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource/inter/400.css'
import '@fontsource/inter/500.css'
import '@fontsource/inter/600.css'
import '@fontsource/cormorant/500.css'
import '@fontsource/cormorant/600.css'
import './index.css'
import { App } from './App'
import { initPwa, markNeedRefresh } from '@/shared/pwa/updatePrompt'

// Um deploy novo troca os hashes dos chunks; se um import dinâmico falhar por
// causa disso (chunk antigo removido do servidor), avisamos que há atualização
// em vez de quebrar em silêncio.
window.addEventListener('vite:preloadError', (event) => {
  event.preventDefault()
  markNeedRefresh()
})

initPwa()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
