import { useSyncExternalStore } from 'react'
import { getCompany, setCompany, subscribe, type Company } from './company'

// Hook React sobre o store da identidade da empresa. Re-renderiza quem usa
// quando nome/contato/logo mudam (edição local ou em outra aba).
export function useCompany(): {
  company: Company
  setCompany: (patch: Partial<Company>) => void
} {
  const company = useSyncExternalStore(subscribe, getCompany, getCompany)
  return { company, setCompany }
}
