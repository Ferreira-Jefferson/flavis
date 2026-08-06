// Domínio da feature "quote": o que é um orçamento (com registro fotográfico
// antes/depois opcional). Substitui o antigo domínio de "report".

export const MAX_IMAGES_PER_SIDE = 3

const VALIDITY_DAYS = 15

// Observações padrão da referência (flavis.pdf), extraídas via `pdftotext -layout`
// e com os acentos corrigidos (a fonte base-14 do PDF de origem não os tem).
const DEFAULT_NOTES: readonly string[] = [
  'Orçamento válido por 15 dias a partir da data de emissão.',
  'Serviço realizado por equipe especializada com produtos certificados e homologados.',
  'Inclui limpeza de filtros, serpentina, bandeja e higienização com bactericida.',
  'Forma de pagamento: A combinar (dinheiro, PIX ou cartão).',
  'PIX: (11) 98471-4782 | Agendamento mediante confirmação e sinal de 30%.',
]

export type DocMode = 'orcamento' | 'com-registro'

export type PhotoPlacement = 'anexo' | 'apos-observacoes' | 'antes-da-tabela'

export type Side = 'before' | 'after'

export interface ImageAsset {
  id: string
  dataUrl: string
  width: number
  height: number
  name: string
}

export interface Block {
  id: string
  label: string // rótulo opcional do bloco (ex: "Cozinha")
  before: ImageAsset[] // 0..3 na edição; ideal 1..3 ao exportar
  after: ImageAsset[]
}

export interface ServiceItem {
  id: string
  description: string
  details: string
  quantity: number
  unit: string
  totalCents: number // dado de entrada; o unitário é derivado, nunca o contrário
}

export interface Quote {
  number: string
  issueDate: string // ISO 'YYYY-MM-DD'
  validUntil: string // ISO 'YYYY-MM-DD'
  responsible: string
  items: ServiceItem[]
  discountCents: number
  notes: string[]
  mode: DocMode
  photoPlacement: PhotoPlacement
  blocks: Block[]
}

export function newId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return 'id-' + Math.random().toString(36).slice(2)
}

export function createItem(): ServiceItem {
  return { id: newId(), description: '', details: '', quantity: 1, unit: 'un.', totalCents: 0 }
}

export function createBlock(): Block {
  return { id: newId(), label: '', before: [], after: [] }
}

// Soma de dias sobre uma data ISO 'YYYY-MM-DD', sem passar por `Date`/fuso-horário
// no cálculo em si — determinístico e fácil de testar.
function addIsoDays(iso: string, days: number): string {
  const [year, month, day] = iso.split('-').map(Number)
  const utcMs = Date.UTC(year, month - 1, day) + days * 86_400_000
  const date = new Date(utcMs)
  const y = date.getUTCFullYear()
  const m = String(date.getUTCMonth() + 1).padStart(2, '0')
  const d = String(date.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

function todayIso(): string {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function createQuote(): Quote {
  const issueDate = todayIso()
  const year = issueDate.slice(0, 4)
  return {
    number: `ORC-${year}-001`,
    issueDate,
    validUntil: addIsoDays(issueDate, VALIDITY_DAYS),
    responsible: '',
    items: [createItem()],
    discountCents: 0,
    notes: [...DEFAULT_NOTES],
    mode: 'orcamento',
    photoPlacement: 'anexo',
    blocks: [createBlock()],
  }
}

// Preço unitário derivado do total informado (a referência fecha em R$ 4.500,00
// para 29 un., não em 29 × unitário arredondado) — ver "Correções a aplicar" do plano.
export function unitPriceCents(quantity: number, totalCents: number): number {
  if (!quantity) return 0
  return Math.round(totalCents / quantity)
}

// Passthrough deliberado: o total é o dado de entrada do item. Nunca recalcular
// a partir de `unitPriceCents` arredondado, senão reintroduz o erro de
// arredondamento que esta feature existe para eliminar.
export function itemTotal(item: ServiceItem): number {
  return item.totalCents
}

export function subtotal(quote: Quote): number {
  return quote.items.reduce((sum, item) => sum + itemTotal(item), 0)
}

export function grandTotal(quote: Quote): number {
  return subtotal(quote) - quote.discountCents
}
