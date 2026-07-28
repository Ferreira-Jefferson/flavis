// Fonte única de verdade do design (usada pela UI e pelo PDF).
// Direção: portfólio editorial, cromia quase-monocromática — as fotos trazem a cor.
// O usuário escolhe entre um tema sem cor (grafite) e temas pastel-claros; o acento
// tinge a marca, o rótulo "DEPOIS" e os estados ativos, tanto na tela quanto no PDF.

export interface Palette {
  ink: string // texto primário (quase-preto quente)
  stone: string // texto secundário / labels
  paper: string // fundo da página
  card: string // molduras / cartões
  line: string // fio de cabelo / passe-partout
  accent: string // marca o "DEPOIS" e estados ativos
  accentWeak: string // tinta suave do acento
}

// Neutros constantes entre os temas (garantem legibilidade em qualquer cor).
const neutrals = {
  ink: '#17181A',
  stone: '#74777A',
  card: '#FFFFFF',
} as const

export type ThemeId = 'neutro' | 'eucalipto' | 'nevoa' | 'argila' | 'lavanda' | 'trigo' | 'rose'

export interface Theme {
  id: ThemeId
  label: string
  palette: Palette
  neutral?: boolean // sem matiz: a amostra no seletor recebe tratamento próprio
}

export const themes: readonly Theme[] = [
  {
    id: 'neutro',
    label: 'Sem cor',
    neutral: true,
    palette: { ...neutrals, paper: '#F4F4F3', line: '#E0E0DE', accent: '#3D3E40', accentWeak: '#EAEAE8' },
  },
  {
    id: 'eucalipto',
    label: 'Eucalipto',
    palette: { ...neutrals, paper: '#E7F0E9', line: '#CFE0D4', accent: '#3B5A4E', accentWeak: '#DBEAE0' },
  },
  {
    id: 'nevoa',
    label: 'Névoa',
    palette: { ...neutrals, paper: '#E6EFF6', line: '#CFDEEC', accent: '#4B6A82', accentWeak: '#DAE8F2' },
  },
  {
    id: 'argila',
    label: 'Argila',
    palette: { ...neutrals, paper: '#F5E9E2', line: '#EAD3C7', accent: '#A05C48', accentWeak: '#EFDBD1' },
  },
  {
    id: 'lavanda',
    label: 'Lavanda',
    palette: { ...neutrals, paper: '#ECE8F4', line: '#DAD2E8', accent: '#6C5E88', accentWeak: '#E2DBF0' },
  },
  {
    id: 'trigo',
    label: 'Trigo',
    palette: { ...neutrals, paper: '#F4EEDA', line: '#E5DABB', accent: '#7C6A34', accentWeak: '#EDE3C6' },
  },
  {
    id: 'rose',
    label: 'Rosé',
    palette: { ...neutrals, paper: '#F5E8ED', line: '#EAD0DA', accent: '#96566A', accentWeak: '#EFDAE2' },
  },
] as const

export const defaultThemeId: ThemeId = 'eucalipto'

// Retrocompatibilidade: `color` é a paleta padrão (usada como fallback do PDF).
export const color: Palette =
  themes.find((t) => t.id === defaultThemeId)?.palette ?? themes[0].palette

export const font = {
  display: 'Cormorant', // títulos e rótulos de bloco
  body: 'Inter', // corpo, UI, labels
} as const

export const space = { xs: 4, sm: 8, md: 16, lg: 24, xl: 40 } as const

export const radius = { sm: 6, md: 10 } as const
