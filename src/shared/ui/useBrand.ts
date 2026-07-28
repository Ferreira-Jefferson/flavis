import { useSyncExternalStore } from 'react'
import { commitBrandName, getBrandName, setBrandName, subscribe } from './brand'

// Hook React sobre o store da marca. Re-renderiza quem usa quando o nome muda.
export function useBrand(): {
  brand: string
  setBrand: (value: string) => void
  commitBrand: () => void
} {
  const brand = useSyncExternalStore(subscribe, getBrandName, getBrandName)
  return { brand, setBrand: setBrandName, commitBrand: commitBrandName }
}
