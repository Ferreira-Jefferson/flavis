import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { type Palette } from '@/shared/ui/tokens'
import { formatBRL, formatQty } from '@/shared/money/currency'
import { type ServiceItem, unitPriceCents, itemTotal } from '../../domain'
import { ITEM_TEXT_COLOR, MARGIN_X, TABLE } from '../geometry'

const [wItem, wDesc, wQtd, wUn, wUnit, wTotal] = TABLE.columnWidths

function createStyles(palette: Palette) {
  return StyleSheet.create({
    wrapper: { paddingHorizontal: MARGIN_X },
    table: {
      width: TABLE.width,
      borderWidth: TABLE.gridWidth,
      borderColor: palette.grid,
    },
    headerRow: {
      flexDirection: 'row',
      height: TABLE.headerHeight,
      backgroundColor: palette.brand,
      alignItems: 'center',
      borderBottomWidth: TABLE.ruleWidth,
      borderBottomColor: palette.accent,
    },
    headerCell: {
      fontFamily: 'Helvetica-Bold',
      fontSize: TABLE.headerFontSize,
      color: '#FFFFFF',
      paddingLeft: 4,
    },
    bodyRow: {
      flexDirection: 'row',
      paddingVertical: 8,
      borderBottomWidth: TABLE.gridWidth,
      borderBottomColor: palette.grid,
    },
    bodyCell: {
      fontFamily: 'Helvetica',
      fontSize: TABLE.bodyFontSize,
      color: ITEM_TEXT_COLOR,
      paddingLeft: 4,
      paddingRight: 4,
    },
    totalCell: {
      fontFamily: 'Helvetica-Bold',
      fontSize: TABLE.bodyFontSize,
      color: palette.brand,
      paddingLeft: 4,
      paddingRight: 4,
    },
    descBlock: { flexDirection: 'column' },
  })
}

export function ItemsTable({ items, palette }: { items: ServiceItem[]; palette: Palette }) {
  const styles = createStyles(palette)
  return (
    <View style={styles.wrapper}>
      <View style={styles.table}>
        <View style={styles.headerRow}>
          <Text style={[styles.headerCell, { width: wItem }]}>ITEM</Text>
          <Text style={[styles.headerCell, { width: wDesc }]}>DESCRIÇÃO DO SERVIÇO</Text>
          <Text style={[styles.headerCell, { width: wQtd }]}>QTD</Text>
          <Text style={[styles.headerCell, { width: wUn }]}>UN.</Text>
          <Text style={[styles.headerCell, { width: wUnit }]}>VL. UNIT.</Text>
          <Text style={[styles.headerCell, { width: wTotal }]}>VL. TOTAL</Text>
        </View>
        {items.map((item, index) => (
          <ItemRow key={item.id} item={item} index={index} styles={styles} />
        ))}
      </View>
    </View>
  )
}

function ItemRow({
  item,
  index,
  styles,
}: {
  item: ServiceItem
  index: number
  styles: ReturnType<typeof createStyles>
}) {
  const unitCents = unitPriceCents(item.quantity, item.totalCents)
  return (
    <View style={styles.bodyRow} wrap={false}>
      <Text style={[styles.bodyCell, { width: wItem }]}>{String(index + 1).padStart(2, '0')}</Text>
      <View style={[styles.descBlock, { width: wDesc }]}>
        <Text style={styles.bodyCell}>{item.description}</Text>
        {item.details ? <Text style={styles.bodyCell}>{item.details}</Text> : null}
      </View>
      <Text style={[styles.bodyCell, { width: wQtd }]}>{formatQty(item.quantity)}</Text>
      <Text style={[styles.bodyCell, { width: wUn }]}>{item.unit}</Text>
      <Text style={[styles.bodyCell, { width: wUnit }]}>{formatBRL(unitCents)}</Text>
      <Text style={[styles.totalCell, { width: wTotal }]}>{formatBRL(itemTotal(item))}</Text>
    </View>
  )
}
