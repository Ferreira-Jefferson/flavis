// Estado do tema ativo (fora do React): guarda a escolha, persiste em localStorage
// e aplica a paleta nas CSS vars do documento. A feature "report" lê a paleta atual
// daqui na hora de gerar o PDF, para a página e o PDF ficarem na mesma cor.

import { defaultThemeId, themes, type Palette, type Theme, type ThemeId } from './tokens'

const STORAGE_KEY = 'ui.theme'
// Chave usada antes de o app deixar de ter nome próprio — lida só para migrar.
const LEGACY_STORAGE_KEY = 'flavis.theme'

const VAR_BY_KEY: Record<keyof Palette, string> = {
  ink: '--ink',
  stone: '--stone',
  paper: '--paper',
  card: '--card',
  line: '--line',
  accent: '--accent',
  accentWeak: '--accent-weak',
  brand: '--brand',
  brandSoft: '--brand-soft',
  panel: '--panel',
  grid: '--grid',
  positive: '--positive',
  body: '--body',
}

function readStored(): ThemeId {
  try {
    const saved = localStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(LEGACY_STORAGE_KEY)
    if (saved && themes.some((t) => t.id === saved)) return saved as ThemeId
  } catch {
    // localStorage indisponível (ex: modo privado) — cai no padrão
  }
  return defaultThemeId
}

let currentId: ThemeId = readStored()
const listeners = new Set<() => void>()

export function getThemeId(): ThemeId {
  return currentId
}

export function getTheme(): Theme {
  return themes.find((t) => t.id === currentId) ?? themes[0]
}

export function getPalette(): Palette {
  return getTheme().palette
}

function applyThemeVars(palette: Palette): void {
  const root = document.documentElement
  ;(Object.keys(VAR_BY_KEY) as (keyof Palette)[]).forEach((key) => {
    root.style.setProperty(VAR_BY_KEY[key], palette[key])
  })
  // acompanha a cor da barra do navegador / splash do PWA
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', palette.accent)
}

export function setThemeId(id: ThemeId): void {
  if (id === currentId) return
  currentId = id
  try {
    localStorage.setItem(STORAGE_KEY, id)
    localStorage.removeItem(LEGACY_STORAGE_KEY)
  } catch {
    // ignora falha de escrita (modo privado)
  }
  applyThemeVars(getPalette())
  listeners.forEach((notify) => notify())
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

// Aplica o tema salvo já na avaliação do módulo (antes do primeiro paint do React),
// evitando "flash" da cor padrão quando há um tema diferente persistido.
applyThemeVars(getPalette())
