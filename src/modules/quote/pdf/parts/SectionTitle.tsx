import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { type Palette } from '@/shared/ui/tokens'
import { MARGIN_X, SECTION_TITLE } from '../geometry'

function createStyles(palette: Palette, barHeight: number, fontSize: number) {
  return StyleSheet.create({
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: MARGIN_X,
    },
    bar: {
      width: SECTION_TITLE.barWidth,
      height: barHeight,
      backgroundColor: palette.accent,
    },
    label: {
      marginLeft: 19.84,
      fontFamily: 'Helvetica-Bold',
      fontSize,
      color: palette.brand,
    },
  })
}

export function SectionTitle({
  label,
  fontSize,
  barHeight,
  palette,
  minPresenceAhead = SECTION_TITLE.minPresenceAhead,
}: {
  label: string
  fontSize: number
  barHeight: number
  palette: Palette
  minPresenceAhead?: number
}) {
  const styles = createStyles(palette, barHeight, fontSize)
  return (
    <View style={styles.row} minPresenceAhead={minPresenceAhead}>
      <View style={styles.bar} />
      <Text style={styles.label}>{label}</Text>
    </View>
  )
}
