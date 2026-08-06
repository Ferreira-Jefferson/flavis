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
  brand: string // cor de marca — faixas/cabeçalho formal do orçamento
  brandSoft: string // texto secundário sobre o `brand` (contato, rodapé)
  panel: string // fundo de cartões/painéis administrativos (dados, observações)
  grid: string // fios da tabela de serviços
  positive: string // selo de status positivo (badge "Orçamento")
  body: string // texto corrente de conteúdo formal (itens, observações, assinaturas)
}

// Neutros constantes entre os temas (garantem legibilidade em qualquer cor).
const neutrals = {
  ink: '#17181A',
  stone: '#74777A',
  card: '#FFFFFF',
} as const

// Neutros do documento formal (orçamento): constantes entre temas pelo mesmo motivo dos acima.
const formalNeutrals = {
  panel: '#F4F6F9',
  grid: '#D0D8E4',
  positive: '#27AE60',
  body: '#444444',
} as const

export type ThemeId =
  | 'sanches'
  | 'neutro'
  | 'eucalipto'
  | 'nevoa'
  | 'argila'
  | 'lavanda'
  | 'trigo'
  | 'rose'

export interface Theme {
  id: ThemeId
  label: string
  palette: Palette
  neutral?: boolean // sem matiz: a amostra no seletor recebe tratamento próprio
}

export const themes: readonly Theme[] = [
  {
    id: 'sanches',
    label: 'SF Higienizações',
    palette: {
      ...neutrals,
      ...formalNeutrals,
      paper: '#E5F6FD',
      line: '#C9E9F5',
      accent: '#00AEEF',
      accentWeak: '#D3EFFB',
      brand: '#0D2B6E',
      brandSoft: '#A8D8F0',
    },
  },
  {
    id: 'neutro',
    label: 'Sem cor',
    neutral: true,
    palette: {
      ...neutrals,
      ...formalNeutrals,
      paper: '#F4F4F3',
      line: '#E0E0DE',
      accent: '#3D3E40',
      accentWeak: '#EAEAE8',
      brand: '#26272A',
      brandSoft: '#C7C8CA',
    },
  },
  {
    id: 'eucalipto',
    label: 'Eucalipto',
    palette: {
      ...neutrals,
      ...formalNeutrals,
      paper: '#E7F0E9',
      line: '#CFE0D4',
      accent: '#3B5A4E',
      accentWeak: '#DBEAE0',
      brand: '#1F3A30',
      brandSoft: '#BFE0D2',
    },
  },
  {
    id: 'nevoa',
    label: 'Névoa',
    palette: {
      ...neutrals,
      ...formalNeutrals,
      paper: '#E6EFF6',
      line: '#CFDEEC',
      accent: '#4B6A82',
      accentWeak: '#DAE8F2',
      brand: '#20344A',
      brandSoft: '#C7DCEA',
    },
  },
  {
    id: 'argila',
    label: 'Argila',
    palette: {
      ...neutrals,
      ...formalNeutrals,
      paper: '#F5E9E2',
      line: '#EAD3C7',
      accent: '#A05C48',
      accentWeak: '#EFDBD1',
      brand: '#5C2E20',
      brandSoft: '#EFC9B9',
    },
  },
  {
    id: 'lavanda',
    label: 'Lavanda',
    palette: {
      ...neutrals,
      ...formalNeutrals,
      paper: '#ECE8F4',
      line: '#DAD2E8',
      accent: '#6C5E88',
      accentWeak: '#E2DBF0',
      brand: '#372C52',
      brandSoft: '#D9CEEF',
    },
  },
  {
    id: 'trigo',
    label: 'Trigo',
    palette: {
      ...neutrals,
      ...formalNeutrals,
      paper: '#F4EEDA',
      line: '#E5DABB',
      accent: '#7C6A34',
      accentWeak: '#EDE3C6',
      brand: '#463B17',
      brandSoft: '#E9DBA8',
    },
  },
  {
    id: 'rose',
    label: 'Rosé',
    palette: {
      ...neutrals,
      ...formalNeutrals,
      paper: '#F5E8ED',
      line: '#EAD0DA',
      accent: '#96566A',
      accentWeak: '#EFDAE2',
      brand: '#54293A',
      brandSoft: '#EFC7D4',
    },
  },
] as const

export const defaultThemeId: ThemeId = 'sanches'

// Retrocompatibilidade: `color` é a paleta padrão (usada como fallback do PDF).
export const color: Palette =
  themes.find((t) => t.id === defaultThemeId)?.palette ?? themes[0].palette

export const font = {
  display: 'Cormorant', // títulos e rótulos de bloco
  body: 'Inter', // corpo, UI, labels
} as const

export const space = { xs: 4, sm: 8, md: 16, lg: 24, xl: 40 } as const

export const radius = { sm: 6, md: 10 } as const
