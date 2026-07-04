// Infra transversal do PWA. Registra o service worker em modo "prompt": o SW
// novo instala mas NÃO troca de versão sozinho, evitando puxar chunks (ex: o do
// PDF, carregado sob demanda) da aba que ainda está aberta após um deploy novo.
// Expõe um estado "há atualização" para a UI mostrar um aviso de "Atualizar".
import { registerSW } from 'virtual:pwa-register'

type Listener = (needRefresh: boolean) => void

let needRefresh = false
const listeners = new Set<Listener>()
let updateSW: ((reload?: boolean) => Promise<void>) | null = null

function emit(): void {
  for (const listener of listeners) listener(needRefresh)
}

/** Assina mudanças no estado de atualização; devolve a função para cancelar. */
export function subscribeUpdate(listener: Listener): () => void {
  listeners.add(listener)
  listener(needRefresh)
  return () => {
    listeners.delete(listener)
  }
}

/** Marca que há uma nova versão disponível (chamado pelo SW ou por erro de chunk). */
export function markNeedRefresh(): void {
  if (needRefresh) return
  needRefresh = true
  emit()
}

/** Erro típico de chunk desatualizado após um deploy novo (import dinâmico falhou). */
export function isModuleLoadError(err: unknown): boolean {
  const msg = err instanceof Error ? err.message : String(err)
  return /dynamically imported module|module script failed|Failed to fetch/i.test(msg)
}

/**
 * Ativa a nova versão do SW e recarrega. A rede de segurança recarrega mesmo
 * quando não há SW aguardando (ex: aviso disparado por erro de chunk).
 */
export function applyUpdate(): void {
  updateSW?.(true)
  window.setTimeout(() => window.location.reload(), 1500)
}

/** Registra o service worker. Chamar uma vez no boot (src/main.tsx). */
export function initPwa(): void {
  updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      markNeedRefresh()
    },
    onRegisteredSW(_swUrl, registration) {
      // Usuários deixam o PWA aberto por horas — procura atualização de tempos em tempos.
      if (registration) {
        window.setInterval(
          () => {
            registration.update().catch(() => {})
          },
          60 * 60 * 1000,
        )
      }
    },
  })
}
