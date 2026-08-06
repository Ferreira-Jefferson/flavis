// Dinheiro em centavos inteiros — evita erro de ponto flutuante nos totais
// do orçamento (ex: 29 × R$ 155,17 tem que fechar em R$ 4.500,00 exatos).
// Sem Intl.NumberFormat de propósito: o formato é fixado à mão para bater
// caractere a caractere com a referência ("R$ 4.500,00"), independente da
// disponibilidade de dados de locale ICU no ambiente de execução.

function groupThousands(digits: string): string {
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

export function formatBRL(cents: number): string {
  const rounded = Math.round(cents)
  const sign = rounded < 0 ? '-' : ''
  const abs = Math.abs(rounded)
  const intPart = Math.floor(abs / 100)
  const centPart = abs % 100
  return `${sign}R$ ${groupThousands(String(intPart))},${String(centPart).padStart(2, '0')}`
}

// Aceita "R$ 4.500,00", "4500,00", "4500.00" ou "4500" (reais inteiros).
export function parseBRL(input: string): number {
  const cleaned = input.replace(/[^\d,.-]/g, '')
  if (!cleaned) return 0
  const negative = cleaned.startsWith('-')
  const s = cleaned.replace(/^-/, '')
  const lastComma = s.lastIndexOf(',')
  const lastDot = s.lastIndexOf('.')
  const decimalIdx = Math.max(lastComma, lastDot)
  const hasDecimals = decimalIdx !== -1 && s.length - decimalIdx - 1 <= 2

  const intDigits = (hasDecimals ? s.slice(0, decimalIdx) : s).replace(/[.,]/g, '')
  const centDigits = hasDecimals ? s.slice(decimalIdx + 1).padEnd(2, '0').slice(0, 2) : '00'

  const cents = parseInt(intDigits || '0', 10) * 100 + parseInt(centDigits || '0', 10)
  return negative ? -cents : cents
}

// Quantidade: inteira quando possível ("29"), senão até 2 casas com vírgula.
export function formatQty(qty: number): string {
  return Number.isInteger(qty) ? String(qty) : qty.toFixed(2).replace('.', ',')
}
