import { View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import { type Palette } from '@/shared/ui/tokens'
import { type Company, defaultLogoUrl } from '@/shared/identity/company'
import { HEADER, PAGE_WIDTH } from '../geometry'

// Subtítulo do cabeçalho é texto fixo (chrome estrutural, mesma categoria do badge
// "ORÇAMENTO" fixo) — a referência tem 2 textos distintos (descrição de ramo aqui,
// slogan no rodapé) e `Company` só tem 1 campo de subtítulo (`tagline`), que já
// representa o slogan do rodapé. Ver ACTION-PLAN, "Decisões sem contrato explícito" #1.
const HEADER_SUBTITLE = 'SF Higienização de Estofados & Ar-Condicionado'

function createStyles(palette: Palette) {
  return StyleSheet.create({
    header: {
      position: 'relative',
      width: PAGE_WIDTH,
      height: HEADER.height,
      backgroundColor: palette.brand,
    },
    ribbon: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: PAGE_WIDTH,
      height: HEADER.ribbonHeight,
      backgroundColor: palette.accent,
    },
    logoTile: {
      position: 'absolute',
      left: HEADER.logoTile.left,
      top: HEADER.logoTile.top,
      width: HEADER.logoTile.size,
      height: HEADER.logoTile.size,
      borderRadius: HEADER.logoTile.radius,
      backgroundColor: '#FFFFFF',
    },
    logo: {
      position: 'absolute',
      left: HEADER.logo.left,
      top: HEADER.logo.top,
      width: HEADER.logo.size,
      height: HEADER.logo.size,
      objectFit: 'contain',
    },
    brandRow: {
      position: 'absolute',
      top: HEADER.brandText.top,
      left: HEADER.brandText.leftF,
      flexDirection: 'row',
      alignItems: 'flex-end',
    },
    brandF: { color: palette.accent, fontFamily: 'Helvetica-Bold', fontSize: HEADER.brandText.fontSize },
    brandSanches: {
      color: '#FFFFFF',
      fontFamily: 'Helvetica-Bold',
      fontSize: HEADER.brandText.fontSize,
      // -20: largura aproximada do "F" em Helvetica-Bold 26pt (não há medição exata
      // disponível em flex, então ajusta o gap medido no PDF de referência pelo avanço
      // estimado do glifo anterior).
      marginLeft: HEADER.brandText.leftSanches - HEADER.brandText.leftF - 20,
    },
    subtitle: {
      position: 'absolute',
      top: HEADER.subtitle.top,
      left: HEADER.subtitle.left,
      fontSize: HEADER.subtitle.fontSize,
      color: palette.brandSoft,
    },
    ruleLine: {
      position: 'absolute',
      top: HEADER.ruleLine.top,
      left: HEADER.ruleLine.left,
      width: HEADER.ruleLine.right - HEADER.ruleLine.left,
      borderBottomWidth: HEADER.ruleLine.width,
      borderBottomColor: palette.accent,
    },
    contact: {
      position: 'absolute',
      top: HEADER.contact.top,
      left: HEADER.contact.left,
      fontSize: HEADER.contact.fontSize,
      color: palette.brandSoft,
    },
    badge: {
      position: 'absolute',
      left: HEADER.badge.left,
      top: HEADER.badge.top,
      width: HEADER.badge.width,
      height: HEADER.badge.height,
      borderRadius: HEADER.badge.radius,
      backgroundColor: palette.positive,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeText: {
      color: '#FFFFFF',
      fontFamily: 'Helvetica-Bold',
      fontSize: HEADER.badge.fontSize,
    },
  })
}

export function Header({ company, palette }: { company: Company; palette: Palette }) {
  const styles = createStyles(palette)
  return (
    <View style={styles.header}>
      <View style={styles.logoTile} />
      <Image style={styles.logo} src={company.logoDataUrl ?? defaultLogoUrl} />
      <View style={styles.ribbon} />
      <View style={styles.brandRow}>
        <Text style={styles.brandF}>F</Text>
        <Text style={styles.brandSanches}>SANCHES</Text>
      </View>
      <Text style={styles.subtitle}>{HEADER_SUBTITLE}</Text>
      <View style={styles.ruleLine} />
      <Text style={styles.contact}>
        {company.phone} | {company.email} | {company.city}
      </Text>
      <View style={styles.badge}>
        <Text style={styles.badgeText}>ORÇAMENTO</Text>
      </View>
    </View>
  )
}
