import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { type Palette } from '@/shared/ui/tokens'
import { formatBRL, formatQty } from '@/shared/money/currency'
import { extenso } from '@/shared/text/extenso'
import { type Quote, subtotal, grandTotal } from '../../domain'
import { MARGIN_X, TOTALS } from '../geometry'

function createStyles(palette: Palette) {
  return StyleSheet.create({
    wrapper: {
      paddingHorizontal: MARGIN_X,
      flexDirection: 'row',
      alignItems: 'flex-end',
      justifyContent: 'space-between',
    },
    extenso: {
      fontFamily: 'Helvetica-Oblique',
      fontSize: TOTALS.extensoFontSize,
      color: palette.body,
      maxWidth: TABLE_LEFT_WIDTH,
    },
    box: { width: TOTALS.width },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: TOTALS.rowHeight,
      paddingHorizontal: 8,
    },
    subtotalRow: { backgroundColor: palette.panel },
    discountRow: { backgroundColor: palette.card },
    totalRow: { backgroundColor: palette.brand },
    label: { fontSize: TOTALS.labelFontSize, color: palette.body },
    value: { fontSize: TOTALS.labelFontSize, color: palette.body },
    totalLabel: {
      fontFamily: 'Helvetica-Bold',
      fontSize: TOTALS.totalFontSize,
      color: '#FFFFFF',
    },
    totalValue: {
      fontFamily: 'Helvetica-Bold',
      fontSize: TOTALS.totalFontSize,
      color: '#FFFFFF',
    },
  })
}

const TABLE_LEFT_WIDTH = 280

export function Totals({ quote, palette }: { quote: Quote; palette: Palette }) {
  const styles = createStyles(palette)
  const sub = subtotal(quote)
  const total = grandTotal(quote)
  const firstItem = quote.items[0]
  const qtyLabel = firstItem
    ? `${formatQty(quote.items.reduce((sum, i) => sum + i.quantity, 0))} un. x ${formatBRL(
        Math.round(firstItem.totalCents / (firstItem.quantity || 1)),
      )}`
    : ''

  return (
    <View style={styles.wrapper} wrap={false}>
      <Text style={styles.extenso}>Valor por extenso: {extenso(total)}</Text>
      <View style={styles.box}>
        <View style={[styles.row, styles.subtotalRow]}>
          <Text style={styles.label}>Subtotal ({qtyLabel}):</Text>
          <Text style={styles.value}>{formatBRL(sub)}</Text>
        </View>
        <View style={[styles.row, styles.discountRow]}>
          <Text style={styles.label}>Desconto:</Text>
          <Text style={styles.value}>{formatBRL(quote.discountCents)}</Text>
        </View>
        <View style={[styles.row, styles.totalRow]}>
          <Text style={styles.totalLabel}>TOTAL GERAL:</Text>
          <Text style={styles.totalValue}>{formatBRL(total)}</Text>
        </View>
      </View>
    </View>
  )
}
