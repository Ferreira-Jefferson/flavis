import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { type Palette } from '@/shared/ui/tokens'
import { MARGIN_X, NOTES } from '../geometry'
import { SectionTitle } from './SectionTitle'

function createStyles(palette: Palette) {
  return StyleSheet.create({
    wrapper: { marginTop: NOTES.gapBarToPanel },
    panel: {
      marginHorizontal: MARGIN_X + 8.5,
      borderRadius: NOTES.panelRadius,
      borderWidth: NOTES.panelBorderWidth,
      borderColor: palette.accent,
      backgroundColor: palette.panel,
      paddingVertical: 10,
      paddingHorizontal: 14,
    },
    bullet: {
      fontSize: NOTES.bulletFontSize,
      color: palette.body,
      lineHeight: NOTES.lineHeight / NOTES.bulletFontSize,
    },
  })
}

export function Notes({ notes, palette }: { notes: string[]; palette: Palette }) {
  const styles = createStyles(palette)
  return (
    <View wrap={false}>
      <SectionTitle label="OBSERVAÇÕES" fontSize={NOTES.titleFontSize} barHeight={NOTES.barHeight} palette={palette} />
      <View style={styles.wrapper}>
        <View style={styles.panel}>
          {notes.map((note, i) => (
            <Text key={i} style={styles.bullet}>
              * {note}
            </Text>
          ))}
        </View>
      </View>
    </View>
  )
}
