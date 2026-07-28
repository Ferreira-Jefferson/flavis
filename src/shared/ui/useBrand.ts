import { useSyncExternalStore } from 'react'
import { getBrandName, setBrandName, subscribe } from './brand'

// Hook React sobre o store da marca. Re-renderiza quem usa quando o nome muda.
// `brand` vazio significa "usuário não editou" — quem exibe cai no nome do app,
// quem gera PDF simplesmente não mostra nome nenhum.
export function useBrand(): { brand: string; setBrand: (value: string) => void } {
  const brand = useSyncExternalStore(subscribe, getBrandName, getBrandName)
  return { brand, setBrand: setBrandName }
}
