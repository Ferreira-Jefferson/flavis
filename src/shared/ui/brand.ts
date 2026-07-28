// Nome exibido no logo (marca do usuário). Vive fora do React, persiste em
// localStorage e é lido pela feature "report" na hora de gerar o PDF.
// Regra: enquanto o usuário não escrever um nome, NENHUM nome aparece —
// nem na tela, nem no título da aba, nem no PDF ou no nome do arquivo.

const STORAGE_KEY = 'brand.name'
const TAGLINE = 'Antes & depois'

export const brandMaxLength = 40

// Colapsa espaços/quebras, mas não apara as pontas: aparar durante a digitação
// impediria o usuário de digitar o espaço entre duas palavras.
function sanitize(value: string): string {
  return value.replace(/\s+/g, ' ').slice(0, brandMaxLength)
}

function readStored(): string {
  try {
    return sanitize(localStorage.getItem(STORAGE_KEY) ?? '').trim()
  } catch {
    // localStorage indisponível (ex: modo privado) — começa sem nome
    return ''
  }
}

let current = readStored()
const listeners = new Set<() => void>()

// Valor como está no campo (pode ter espaço em digitação).
export function getBrandName(): string {
  return current
}

function applyDocumentTitle(name: string): void {
  document.title = name ? `${name} — antes & depois` : TAGLINE
}

export function setBrandName(value: string): void {
  const next = sanitize(value)
  if (next === current) return
  current = next
  const stored = next.trim()
  try {
    if (stored) localStorage.setItem(STORAGE_KEY, stored)
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignora falha de escrita (modo privado)
  }
  applyDocumentTitle(stored)
  listeners.forEach((notify) => notify())
}

// Fim da edição: descarta espaços nas pontas.
export function commitBrandName(): void {
  setBrandName(current.trim())
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

applyDocumentTitle(current)
