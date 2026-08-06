// Geometria do orçamento, em pt, extraída do content stream real de `flavis.pdf`
// (objeto 10, ASCII85Decode+FlateDecode) — não da prosa do plano, que arredonda alguns
// valores. Página A4 do ReportLab tem origem no canto inferior-esquerdo; o React-PDF
// layouta de cima para baixo (flexbox). Por isso só o cabeçalho (faixa navy) usa
// posicionamento absoluto convertido (`top = PAGE_HEIGHT - yTopoReportLab`); o resto do
// documento flui em blocos normais, cujas alturas/margens reproduzem os deltas medidos
// abaixo — ver "Modelo de geometria" no ACTION-PLAN desta feature para a tabela fonte.

export const PAGE_WIDTH = 595.2756
export const PAGE_HEIGHT = 841.8898

export const MARGIN_X = 42.51969

export const HEADER = {
  height: 155.9055,
  ribbonHeight: 11.33858,
  logo: { left: 26.92913, top: 25.5118, size: 119.0551 },
  // Correção #2 do plano: tile branco arredondado sob o logo (raio 10, respiro 8).
  logoTile: { left: 18.92913, top: 17.5118, size: 135.0551, radius: 10 },
  // Correção #1 do plano: "F" e "SANCHES" no mesmo tamanho (26pt), não 10pt/26pt.
  brandText: { leftF: 170.0787, leftSanches: 189.9213, top: 27, fontSize: 26 },
  subtitle: { left: 170.0787, top: 62.35, fontSize: 9 },
  ruleLine: { left: 170.0787, right: 552.7559, top: 79.37, width: 1 },
  contact: { left: 170.0787, top: 86.46, fontSize: 9 },
  badge: {
    left: 459.2126,
    top: 99.2126,
    width: 99.2087,
    height: 31.1811,
    radius: 8.5,
    fontSize: 13,
  },
} as const

export const INFO_CARD = {
  // Sobreposição com a base do cabeçalho: 155.9055 (fim do header) − 147.4016 (topo do
  // cartão) ≈ 8.5 — reproduzido como marginTop negativo no fluxo, não como absoluto.
  overlapWithHeader: -8.5039,
  radius: 8.5,
  borderWidth: 1,
  paddingX: 14.16,
  paddingTop: 12,
  height: 56.6929,
  columns: { number: 14.17, date: 169.9, validUntil: 325.8 },
  labelFontSize: 10,
  valueFontSize: 10,
  valueGap: 19.84,
  responsibleMarginTop: 10,
  responsibleLabelLeft: 14.17,
  responsibleValueLeft: 99.21,
} as const

export const SECTION_TITLE = {
  barWidth: 11.33858,
} as const

// Gaps de fluxo entre blocos do corpo do documento, medidos no content stream real
// (ver "Modelo de geometria" no ACTION-PLAN desta feature) — nomeados para não ficarem
// como números mágicos soltos em `QuoteDocument.tsx`.
export const FLOW_GAPS = {
  // Depois do InfoCard/RESPONSÁVEL, antes da barra "DESCRIÇÃO DOS SERVIÇOS".
  afterInfoCard: 31.1811,
  // Depois da barra de título de seção, antes do conteúdo (tabela).
  afterSectionBar: 22.6772,
  // Depois da tabela de itens, antes dos totais.
  afterTable: 15.5906,
  // Depois dos totais, antes da seção "OBSERVAÇÕES".
  afterTotals: 21.2598,
} as const

export const TABLE = {
  width: 524.4094,
  // Larguras de coluna, na ordem ITEM · DESCRIÇÃO · QTD · UN. · VL. UNIT. · VL. TOTAL.
  columnWidths: [31.1811, 246.6142, 34.0157, 31.1811, 85.0394, 96.3779] as const,
  headerHeight: 22.67717,
  headerFontSize: 9,
  bodyFontSize: 9,
  gridWidth: 0.4,
  ruleWidth: 1.5,
} as const

export const TOTALS = {
  width: 212.5984,
  left: 340.1575,
  rowHeight: 21.25984,
  labelFontSize: 10,
  totalFontSize: 13,
  extensoFontSize: 8,
} as const

export const NOTES = {
  barHeight: 18.4252,
  titleFontSize: 11,
  // Gap real medido entre a base da barrinha e o topo do painel: 348.6614 − 345.8268,
  // coordenadas ReportLab — corrigido de 11.34 (que tinha sido lido por engano como a
  // largura da barra) para 2.83 pelo plan-reviewer.
  gapBarToPanel: 2.83,
  panelRadius: 8.5,
  panelBorderWidth: 0.5,
  bulletFontSize: 9,
  lineHeight: 13.04,
} as const

export const SIGNATURES = {
  gapAfterNotes: 5.6693,
  columnGap: 28.3465,
  labelFontSize: 9,
  captionFontSize: 8,
  lineColor: '#AAAAAA', // medido no content stream — não é token de Palette
  lineWidth: 0.5,
} as const

export const FOOTER = {
  height: 34.01575,
  ribbonHeight: 4.25197,
  line1FontSize: 8,
  line2FontSize: 7,
} as const

// Cor fixa medida no content stream para o corpo da tabela de itens (achado extra, não
// uma das 3 correções oficiais do plano — a referência usa preto puro ali, não `body`).
export const ITEM_TEXT_COLOR = '#000000'
