// Fonte única de verdade do design (usada pela UI e pelo PDF).
// Paleta única (identidade SF Higienizações — navy/ciano), sem seleção de tema.

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

export const palette: Palette = {
  ink: '#17181A',
  stone: '#74777A',
  card: '#FFFFFF',
  panel: '#F4F6F9',
  grid: '#D0D8E4',
  positive: '#27AE60',
  body: '#444444',
  paper: '#FFFFFF',
  line: '#C9E9F5',
  accent: '#00AEEF',
  accentWeak: '#D3EFFB',
  brand: '#0D2B6E',
  brandSoft: '#A8D8F0',
}

export const font = {
  display: 'Cormorant', // títulos e rótulos de bloco
  body: 'Inter', // corpo, UI, labels
} as const

export const space = { xs: 4, sm: 8, md: 16, lg: 24, xl: 40 } as const

export const radius = { sm: 6, md: 10 } as const
