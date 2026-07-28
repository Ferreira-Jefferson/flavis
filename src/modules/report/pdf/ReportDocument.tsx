import { Document, Page, View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import { color, type Palette } from '@/shared/ui/tokens'
import { type Block, type ImageAsset, type Report } from '../domain'
import { registerPdfFonts } from './fonts'

registerPdfFonts()

// Estilos derivados da paleta ativa, para o PDF ficar na mesma cor da tela.
function createStyles(palette: Palette) {
  return StyleSheet.create({
    page: {
      paddingTop: 48,
      paddingBottom: 56,
      paddingHorizontal: 48,
      fontFamily: 'Inter',
      fontSize: 10,
      color: palette.ink,
      backgroundColor: palette.paper,
    },
    title: {
      fontFamily: 'Cormorant',
      fontWeight: 600,
      fontSize: 25,
      lineHeight: 1.12,
      marginBottom: 14,
      maxLines: 2,
      textOverflow: 'ellipsis',
    },
    metaBlock: { marginBottom: 24 },
    dividerRow: { flexDirection: 'row', alignItems: 'center' },
    dividerLine: { flex: 1, borderBottomWidth: 1, borderBottomColor: palette.line },
    dividerText: {
      marginHorizontal: 14,
      fontSize: 9.5,
      letterSpacing: 1.5,
      textTransform: 'uppercase',
      color: palette.stone,
    },
    metaDate: {
      marginBottom: 14,
      fontSize: 8.5,
      letterSpacing: 1,
      textTransform: 'uppercase',
      color: palette.stone,
    },
    rule: { borderBottomWidth: 1, borderBottomColor: palette.line },
    // Ocupa a largura dos separadores; quebra em até 5 linhas e nunca estoura
    // (palavras longas são quebradas pela hyphenationCallback em fonts.ts).
    description: {
      fontSize: 10.5,
      lineHeight: 1.5,
      color: palette.ink,
      marginBottom: 26,
      maxLines: 5,
      textOverflow: 'ellipsis',
    },

    block: { marginBottom: 22 },
    blockHead: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    blockLabel: {
      fontFamily: 'Cormorant',
      fontWeight: 600,
      fontSize: 15,
      color: palette.ink,
      marginHorizontal: 14,
      textAlign: 'center',
    },

    sides: { flexDirection: 'row' },
    side: { flex: 1 },
    sideGap: { width: 16 },
    tag: {
      fontSize: 8.5,
      fontWeight: 600,
      letterSpacing: 1.5,
      textTransform: 'uppercase',
      color: palette.stone,
      marginBottom: 6,
    },
    tagAfter: { color: palette.accent },

    frame: {
      borderWidth: 1,
      borderColor: palette.line,
      backgroundColor: palette.card,
      padding: 4,
      marginBottom: 8,
    },
    photo: { width: '100%', height: 132, objectFit: 'cover' },
    emptyFrame: {
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: palette.line,
      height: 60,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 8,
    },
    emptyText: { fontSize: 8, color: palette.stone },

    footer: {
      position: 'absolute',
      bottom: 28,
      left: 48,
      right: 48,
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    footerText: { fontSize: 8, letterSpacing: 1, textTransform: 'uppercase', color: palette.stone },
  })
}

type Styles = ReturnType<typeof createStyles>

function formatDate(): string {
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(new Date())
  } catch {
    return ''
  }
}

export function ReportDocument({
  report,
  palette = color,
  brand = '',
}: {
  report: Report
  palette?: Palette
  brand?: string
}) {
  const styles = createStyles(palette)
  const date = formatDate()
  // Sem nome definido pelo usuário, o rodapé traz só a legenda — nenhum nome de app.
  const name = brand.trim()
  const footerLabel = name ? `${name} · antes & depois` : 'antes & depois'
  return (
    <Document title={report.title || 'Relatório'} author={name || undefined}>
      <Page size="A4" style={styles.page}>
        {report.title ? <Text style={styles.title}>{report.title}</Text> : null}

        <View style={styles.metaBlock}>
          {date ? <Text style={styles.metaDate}>{date}</Text> : null}
          {report.location ? (
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>{report.location}</Text>
              <View style={styles.dividerLine} />
            </View>
          ) : (
            <View style={styles.rule} />
          )}
        </View>

        {report.description ? <Text style={styles.description}>{report.description}</Text> : null}

        {report.blocks.map((block, i) => (
          <BlockView key={block.id} block={block} index={i} styles={styles} />
        ))}

        <View style={styles.footer} fixed>
          <Text style={styles.footerText}>{footerLabel}</Text>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          />
        </View>
      </Page>
    </Document>
  )
}

function BlockView({ block, index, styles }: { block: Block; index: number; styles: Styles }) {
  const heading = block.label.trim() || `Antes & depois ${index + 1}`
  return (
    <View style={styles.block} wrap={false}>
      <View style={styles.blockHead}>
        <View style={styles.dividerLine} />
        <Text style={styles.blockLabel}>{heading}</Text>
        <View style={styles.dividerLine} />
      </View>
      <View style={styles.sides}>
        <SideView title="Antes" images={block.before} after={false} styles={styles} />
        <View style={styles.sideGap} />
        <SideView title="Depois" images={block.after} after styles={styles} />
      </View>
    </View>
  )
}

function SideView({
  title,
  images,
  after,
  styles,
}: {
  title: string
  images: ImageAsset[]
  after: boolean
  styles: Styles
}) {
  return (
    <View style={styles.side}>
      <Text style={[styles.tag, after ? styles.tagAfter : {}]}>{title}</Text>
      {images.length === 0 ? (
        <View style={styles.emptyFrame}>
          <Text style={styles.emptyText}>—</Text>
        </View>
      ) : (
        images.map((img) => (
          <View key={img.id} style={styles.frame}>
            <Image src={img.dataUrl} style={styles.photo} />
          </View>
        ))
      )}
    </View>
  )
}
