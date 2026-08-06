import { Document, Page, View, StyleSheet } from '@react-pdf/renderer'
import { type Palette } from '@/shared/ui/tokens'
import { type Company } from '@/shared/identity/company'
import { blockHasImages, type Quote } from '../domain'
import { FLOW_GAPS } from './geometry'
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
  gap: { height: FLOW_GAPS.afterSectionBar },
  gapAfterCard: { height: FLOW_GAPS.afterInfoCard },
  gapAfterTable: { height: FLOW_GAPS.afterTable },
  gapAfterTotals: { height: FLOW_GAPS.afterTotals },
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
  const photoBlocks = quote.blocks.filter(blockHasImages)
  const hasPhotos = quote.photoPlacement !== 'sem-fotos' && photoBlocks.length > 0

  return (
    <Document title={`Orçamento ${quote.number}`} author={company.name}>
      <Page size="A4" style={styles.page} wrap>
        <Header company={company} palette={palette} />
        <InfoCard quote={quote} palette={palette} />

        {hasPhotos && quote.photoPlacement === 'antes-da-tabela' ? (
          <Photos blocks={photoBlocks} palette={palette} />
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

        {hasPhotos && quote.photoPlacement === 'apos-totais' ? (
          <Photos blocks={photoBlocks} palette={palette} />
        ) : null}

        <Notes notes={quote.notes} palette={palette} />

        {hasPhotos && quote.photoPlacement === 'anexo' ? (
          <View break>
            <Photos blocks={photoBlocks} palette={palette} />
          </View>
        ) : null}

        <Signatures companyName={company.name} palette={palette} />
        <Footer company={company} palette={palette} />
      </Page>
    </Document>
  )
}
