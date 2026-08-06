import { pdf } from '@react-pdf/renderer'
import { type Palette } from '@/shared/ui/tokens'
import { type Company } from '@/shared/identity/company'
import { type Quote } from '../domain'
import { QuoteDocument } from './QuoteDocument'

const DIACRITICS = new RegExp('[\\u0300-\\u036f]', 'g')

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(DIACRITICS, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function fileName(quote: Quote): string {
  const slug = slugify(quote.number) || 'orcamento'
  return `orcamento-${slug}.pdf`
}

// Gera o PDF no navegador e dispara o download.
export async function downloadQuotePdf(
  quote: Quote,
  company: Company,
  palette: Palette,
): Promise<void> {
  const blob = await pdf(
    <QuoteDocument quote={quote} company={company} palette={palette} />,
  ).toBlob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName(quote)
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 4000)
}
