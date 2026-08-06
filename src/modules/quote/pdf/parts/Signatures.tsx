import { View, Text, StyleSheet } from '@react-pdf/renderer'
import { type Palette } from '@/shared/ui/tokens'
import { MARGIN_X, SIGNATURES } from '../geometry'

function createStyles(palette: Palette) {
  return StyleSheet.create({
    // `wrap={false}` no bloco: a faixa desce inteira para a página seguinte quando não
    // couber, em vez de deixar as linhas numa página e os rótulos na outra. O respiro
    // até o rodapé quem garante é o `paddingBottom` da página (ver geometry.PAGE).
    wrapper: {
      marginTop: SIGNATURES.gapAboveBlock,
      paddingHorizontal: MARGIN_X,
      flexDirection: 'row',
    },
    column: { flex: 1, alignItems: 'center' },
    gap: { width: SIGNATURES.columnGap },
    line: {
      width: '100%',
      borderBottomWidth: SIGNATURES.lineWidth,
      borderBottomColor: SIGNATURES.lineColor,
      marginBottom: 6,
    },
    label: {
      fontFamily: 'Helvetica-Bold',
      fontSize: SIGNATURES.labelFontSize,
      color: palette.brand,
      textAlign: 'center',
    },
    caption: {
      fontSize: SIGNATURES.captionFontSize,
      color: palette.body,
      textAlign: 'center',
      marginTop: 2,
    },
  })
}

export function Signatures({ companyName, palette }: { companyName: string; palette: Palette }) {
  const styles = createStyles(palette)
  return (
    <View style={styles.wrapper} wrap={false}>
      <View style={styles.column}>
        <View style={styles.line} />
        <Text style={styles.label}>{companyName.toUpperCase()}</Text>
        <Text style={styles.caption}>Responsável pelo Serviço</Text>
      </View>
      <View style={styles.gap} />
      <View style={styles.column}>
        <View style={styles.line} />
        <Text style={styles.label}>CLIENTE</Text>
        <Text style={styles.caption}>Assinatura e Carimbo</Text>
      </View>
    </View>
  )
}
