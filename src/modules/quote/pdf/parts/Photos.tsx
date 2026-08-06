import { View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import { type Palette } from '@/shared/ui/tokens'
import { type Block, type ImageAsset } from '../../domain'
import { MARGIN_X } from '../geometry'
import { SectionTitle } from './SectionTitle'

function createStyles(palette: Palette) {
  return StyleSheet.create({
    wrapper: { paddingHorizontal: MARGIN_X, paddingTop: 16 },
    block: { marginBottom: 18 },
    blockLabel: {
      fontFamily: 'Helvetica-Bold',
      fontSize: 11,
      color: palette.brand,
      marginBottom: 8,
    },
    sides: { flexDirection: 'row' },
    side: { flex: 1 },
    sideGap: { width: 12 },
    tag: {
      fontSize: 8.5,
      fontFamily: 'Helvetica-Bold',
      letterSpacing: 1,
      textTransform: 'uppercase',
      color: palette.body,
      marginBottom: 4,
    },
    tagAfter: { color: palette.accent },
    frame: {
      borderWidth: 1,
      borderColor: palette.grid,
      backgroundColor: palette.card,
      padding: 3,
      marginBottom: 6,
    },
    photo: { width: '100%', height: 120, objectFit: 'cover' },
    emptyFrame: {
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: palette.grid,
      height: 50,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 6,
    },
    emptyText: { fontSize: 8, color: palette.body },
  })
}

type Styles = ReturnType<typeof createStyles>

export function Photos({ blocks, palette }: { blocks: Block[]; palette: Palette }) {
  const styles = createStyles(palette)
  return (
    <View>
      <SectionTitle
        label="REGISTRO FOTOGRÁFICO — ANTES & DEPOIS"
        fontSize={13}
        barHeight={19.8425}
        palette={palette}
      />
      <View style={styles.wrapper}>
        {blocks.map((block, i) => (
          <BlockView key={block.id} block={block} index={i} styles={styles} />
        ))}
      </View>
    </View>
  )
}

function BlockView({ block, index, styles }: { block: Block; index: number; styles: Styles }) {
  const heading = block.label.trim() || `Registro ${index + 1}`
  return (
    <View style={styles.block} wrap={false}>
      <Text style={styles.blockLabel}>{heading}</Text>
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
