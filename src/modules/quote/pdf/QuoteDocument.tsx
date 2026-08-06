import { Document, Page, View, StyleSheet } from '@react-pdf/renderer'
import { type Palette } from '@/shared/ui/tokens'
import { type Company } from '@/shared/identity/company'
import { type Quote } from '../domain'
import { Header } from './parts/Header'
import { InfoCard } from './parts/InfoCard'
import { SectionTitle } from './parts/SectionTitle'
import { ItemsTable } from './parts/ItemsTable'
import { Totals } from './parts/Totals'
import { Notes } from './parts/Notes'
import { Photos } from './parts/Photos'
import { Signatures } from './parts/Signatures'
import { Footer } from './parts/Footer'

const styles = StyleSheet.create({
  page: { fontFamily: 'Helvetica' },
  gap: { height: 22.6772 },
  gapAfterCard: { height: 31.1811 },
  gapAfterTable: { height: 15.5906 },
  gapAfterTotals: { height: 21.2598 },
})

export function QuoteDocument({
  quote,
  company,
  palette,
}: {
  quote: Quote
  company: Company
  palette: Palette
}) {
  const hasPhotos = quote.mode === 'com-registro' && quote.blocks.length > 0

  return (
    <Document title={`Orçamento ${quote.number}`} author={company.name}>
      <Page size="A4" style={styles.page} wrap>
        <Header company={company} palette={palette} />
        <InfoCard quote={quote} palette={palette} />

        {hasPhotos && quote.photoPlacement === 'antes-da-tabela' ? (
          <Photos blocks={quote.blocks} palette={palette} />
        ) : null}

        <View style={styles.gapAfterCard} />
        <SectionTitle
          label="DESCRIÇÃO DOS SERVIÇOS"
          fontSize={13}
          barHeight={19.8425}
          palette={palette}
        />
        <View style={styles.gap} />
        <ItemsTable items={quote.items} palette={palette} />
        <View style={styles.gapAfterTable} />
        <Totals quote={quote} palette={palette} />
        <View style={styles.gapAfterTotals} />
        <Notes notes={quote.notes} palette={palette} />

        {hasPhotos && quote.photoPlacement === 'apos-observacoes' ? (
          <Photos blocks={quote.blocks} palette={palette} />
        ) : null}

        {hasPhotos && quote.photoPlacement === 'anexo' ? (
          <View break>
            <Photos blocks={quote.blocks} palette={palette} />
          </View>
        ) : null}

        <Signatures companyName={company.name} palette={palette} />
        <Footer company={company} palette={palette} />
      </Page>
    </Document>
  )
}
