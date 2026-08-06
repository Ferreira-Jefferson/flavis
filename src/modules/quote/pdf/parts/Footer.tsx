import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { type Palette } from '@/shared/ui/tokens'
import { type Company } from '@/shared/identity/company'
import { FOOTER, PAGE_WIDTH } from '../geometry'

function createStyles(palette: Palette) {
  return StyleSheet.create({
    footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      width: PAGE_WIDTH,
      height: FOOTER.height + FOOTER.ribbonHeight,
    },
    ribbon: {
      width: PAGE_WIDTH,
      height: FOOTER.ribbonHeight,
      backgroundColor: palette.accent,
    },
    band: {
      width: PAGE_WIDTH,
      height: FOOTER.height,
      backgroundColor: palette.brand,
      alignItems: 'center',
      justifyContent: 'center',
    },
    line1: { fontSize: FOOTER.line1FontSize, color: '#FFFFFF' },
    line2: { fontSize: FOOTER.line2FontSize, color: palette.brandSoft, marginTop: 3 },
  })
}

export function Footer({ company, palette }: { company: Company; palette: Palette }) {
  const styles = createStyles(palette)
  return (
    <View style={styles.footer} fixed>
      <View style={styles.ribbon} />
      <View style={styles.band}>
        <Text style={styles.line1}>
          {company.name} - {company.tagline}
        </Text>
        <Text style={styles.line2}>
          {company.phone} | {company.email}
        </Text>
      </View>
    </View>
  )
}
