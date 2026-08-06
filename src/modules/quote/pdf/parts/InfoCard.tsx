import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { type Palette } from '@/shared/ui/tokens'
import { type Quote } from '../../domain'
import { INFO_CARD, MARGIN_X, PAGE_WIDTH } from '../geometry'

function createStyles(palette: Palette) {
  const cardWidth = PAGE_WIDTH - MARGIN_X * 2 - 8.5
  return StyleSheet.create({
    wrapper: {
      marginTop: INFO_CARD.overlapWithHeader,
      paddingHorizontal: MARGIN_X + 8.5,
    },
    card: {
      width: cardWidth,
      height: INFO_CARD.height,
      borderRadius: INFO_CARD.radius,
      borderWidth: INFO_CARD.borderWidth,
      borderColor: palette.accent,
      backgroundColor: palette.panel,
      paddingTop: INFO_CARD.paddingTop,
      paddingHorizontal: INFO_CARD.paddingX,
    },
    row: { flexDirection: 'row' },
    col: { flex: 1 },
    label: {
      fontFamily: 'Helvetica-Bold',
      fontSize: INFO_CARD.labelFontSize,
      color: palette.brand,
      marginBottom: INFO_CARD.valueGap - INFO_CARD.paddingTop,
    },
    value: {
      fontSize: INFO_CARD.valueFontSize,
      color: palette.body,
    },
    responsible: {
      flexDirection: 'row',
      marginTop: INFO_CARD.responsibleMarginTop,
    },
    responsibleLabel: {
      fontFamily: 'Helvetica-Bold',
      fontSize: INFO_CARD.labelFontSize,
      color: palette.brand,
    },
    responsibleValue: {
      fontSize: INFO_CARD.valueFontSize,
      color: palette.body,
      marginLeft: INFO_CARD.responsibleValueLeft - INFO_CARD.responsibleLabelLeft - 70,
    },
  })
}

function formatDateBr(iso: string): string {
  const [year, month, day] = iso.split('-')
  return `${day}/${month}/${year}`
}

export function InfoCard({ quote, palette }: { quote: Quote; palette: Palette }) {
  const styles = createStyles(palette)
  return (
    <View style={styles.wrapper}>
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Nº DO ORÇAMENTO:</Text>
            <Text style={styles.value}>{quote.number}</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>DATA DE EMISSÃO:</Text>
            <Text style={styles.value}>{formatDateBr(quote.issueDate)}</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>VÁLIDO ATÉ:</Text>
            <Text style={styles.value}>{formatDateBr(quote.validUntil)}</Text>
          </View>
        </View>
      </View>
      <View style={styles.responsible}>
        <Text style={styles.responsibleLabel}>RESPONSÁVEL: </Text>
        <Text style={styles.responsibleValue}>{quote.responsible}</Text>
      </View>
    </View>
  )
}
