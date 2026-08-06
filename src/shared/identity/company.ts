// Identidade da empresa exibida no orçamento: nome, contato e logo.
// Vem com o padrão da SF Higienizações (referência do layout), mas tudo é
// editável e persiste em localStorage — o app não tem nome próprio (ver
// commits de brand anteriores); quem aparece é sempre a empresa do usuário.

const STORAGE_KEY = 'company'

export const nameMaxLength = 60

// Asset padrão embutido (logo extraído do PDF de referência). `logoDataUrl`
// null significa "usa este arquivo" — só passa a ter valor quando o usuário
// faz upload do próprio logo.
export const defaultLogoUrl = '/logo-fsanches.jpg'

export interface Company {
  name: string
  tagline: string
  phone: string
  email: string
  city: string
  logoDataUrl: string | null
}

const defaultCompany: Company = {
  name: 'SF Higienizações',
  tagline: 'Mais que limpeza, é qualidade de vida',
  phone: '(11) 98471-4782',
  email: 'flavianosanches15@gmail.com',
  city: 'São Paulo - SP',
  logoDataUrl: null,
}

function sanitizeName(value: string): string {
  return value.replace(/\s+/g, ' ').trim().slice(0, nameMaxLength)
}

function readStored(): Company {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultCompany
    const parsed = JSON.parse(raw) as Partial<Company>
    return { ...defaultCompany, ...parsed }
  } catch {
    // JSON inválido ou localStorage indisponível (ex: modo privado) — padrão
    return defaultCompany
  }
}

function persist(next: Company): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch {
    // ignora falha de escrita (modo privado)
  }
}

let current = readStored()
const listeners = new Set<() => void>()

export function getCompany(): Company {
  return current
}

export function setCompany(patch: Partial<Company>): void {
  const next: Company = { ...current, ...patch }
  if (typeof patch.name === 'string') next.name = sanitizeName(patch.name) || current.name
  if (JSON.stringify(next) === JSON.stringify(current)) return
  current = next
  persist(next)
  listeners.forEach((notify) => notify())
}

// Volta ao padrão da SF Higienizações (usado por um eventual "restaurar").
export function resetCompany(): void {
  if (JSON.stringify(current) === JSON.stringify(defaultCompany)) return
  current = defaultCompany
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignora falha de escrita (modo privado)
  }
  listeners.forEach((notify) => notify())
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}
