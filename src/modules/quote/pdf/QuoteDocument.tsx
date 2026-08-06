import { Document, Page, View, StyleSheet } from '@react-pdf/renderer'
import { type Palette } from '@/shared/ui/tokens'
import { type Company } from '@/shared/identity/company'
import { blockHasImages, type Quote } from '../domain'
import { FLOW_GAPS, PAGE, SIGNATURES } from './geometry'
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
  page: {
    fontFamily: 'Helvetica',
    paddingTop: PAGE.topClearance,
    paddingBottom: PAGE.footerBand + PAGE.footerClearance,
  },
  // O cabeçalho encosta na borda por design, então cancela o respiro de topo — que
  // existe para as páginas de continuação, onde não há cabeçalho nenhum.
  header: { marginTop: -PAGE.topClearance },
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
  // Quem fecha o documento antes da assinatura: no modo anexo são as fotos, no resto
  // são as observações. Esse bloco é quem exige espaço para a assinatura na página, para
  // os dois descerem juntos em vez de a assinatura cair sozinha numa folha em branco.
  const photosAreLast = hasPhotos && quote.photoPlacement === 'anexo'

  return (
    <Document title={`Orçamento ${quote.number}`} author={company.name}>
      <Page size="A4" style={styles.page} wrap>
        <View style={styles.header}>
          <Header company={company} palette={palette} />
        </View>
        <InfoCard quote={quote} palette={palette} />

        {hasPhotos && quote.photoPlacement === 'antes-da-tabela' ? (
          <>
            {/* Mesmo respiro que a tabela recebe quando vem logo após o cartão: sem ele
                a barra da seção encostava na linha "RESPONSÁVEL:". */}
            <View style={styles.gapAfterCard} />
            <Photos blocks={photoBlocks} palette={palette} />
          </>
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

        <Notes
          notes={quote.notes}
          palette={palette}
          minPresenceAhead={photosAreLast ? 0 : SIGNATURES.tailPresence}
        />

        {photosAreLast ? (
          <View break>
            <Photos
              blocks={photoBlocks}
              palette={palette}
              tailPresence={SIGNATURES.tailPresence}
            />
          </View>
        ) : null}

        <Signatures companyName={company.name} palette={palette} />
        <Footer company={company} palette={palette} />
      </Page>
    </Document>
  )
}
