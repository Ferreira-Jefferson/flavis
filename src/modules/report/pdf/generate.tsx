import { pdf } from '@react-pdf/renderer'
import { type Palette } from '@/shared/ui/tokens'
import { type Report } from '../domain'
import { ReportDocument } from './ReportDocument'

const DIACRITICS = new RegExp('[\\u0300-\\u036f]', 'g')

function slugify(value: string, max: number): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(DIACRITICS, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, max)
}

// Prefixa com o nome do usuário só quando ele definiu um — sem nome, nenhum prefixo.
function fileName(report: Report, brand: string): string {
  const slug = slugify(report.title, 60) || 'relatorio'
  const prefix = slugify(brand, 30)
  return prefix ? `${prefix}-${slug}.pdf` : `${slug}.pdf`
}

// Gera o PDF no navegador e dispara o download.
export async function downloadReportPdf(
  report: Report,
  palette: Palette,
  brand = '',
): Promise<void> {
  const blob = await pdf(
    <ReportDocument report={report} palette={palette} brand={brand} />,
  ).toBlob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName(report, brand)
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 4000)
}
