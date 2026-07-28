// Nome exibido no logo. Por padrão é o nome do app; o usuário pode escrever o
// nome dele por cima (persiste em localStorage) e aí esse nome passa a valer.
// O PDF só carimba o nome do usuário: sem nome escrito, o PDF sai sem nome nenhum.

const STORAGE_KEY = 'brand.name'

export const appName = 'flavis'
export const brandMaxLength = 40

function sanitize(value: string): string {
  return value.replace(/\s+/g, ' ').trim().slice(0, brandMaxLength)
}

function readStored(): string {
  try {
    return sanitize(localStorage.getItem(STORAGE_KEY) ?? '')
  } catch {
    // localStorage indisponível (ex: modo privado) — fica no nome padrão
    return ''
  }
}

let current = readStored()
const listeners = new Set<() => void>()

// Nome escolhido pelo usuário; vazio = ele não editou (o logo mostra appName).
export function getBrandName(): string {
  return current
}

function applyDocumentTitle(name: string): void {
  document.title = `${name || appName} — antes & depois`
}

export function setBrandName(value: string): void {
  const next = sanitize(value)
  if (next === current) return
  current = next
  try {
    if (next) localStorage.setItem(STORAGE_KEY, next)
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignora falha de escrita (modo privado)
  }
  applyDocumentTitle(next)
  listeners.forEach((notify) => notify())
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

applyDocumentTitle(current)
