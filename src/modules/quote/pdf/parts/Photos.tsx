import { View, Text, Image, StyleSheet } from '@react-pdf/renderer'
import { type Palette } from '@/shared/ui/tokens'
import { blockHasImages, isBeforeAfterPair, type Block, type ImageAsset } from '../../domain'
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
    // Célula do grid de bloco com um lado só: mesma largura de uma coluna do par
    // antes/depois, para a foto sair no mesmo tamanho nos dois casos.
    cellGap: { marginLeft: 12 },
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

// Colunas do grid usado nos blocos com um lado só — 2 para a foto ter a mesma largura
// que teria numa das colunas do par antes/depois.
const GRID_COLUMNS = 2

export function Photos({ blocks, palette }: { blocks: Block[]; palette: Palette }) {
  const styles = createStyles(palette)
  const visible = blocks.filter(blockHasImages)
  if (visible.length === 0) return null

  return (
    <View>
      <SectionTitle
        label="REGISTRO FOTOGRÁFICO"
        fontSize={13}
        barHeight={19.8425}
        palette={palette}
      />
      <View style={styles.wrapper}>
        {visible.map((block, i) => (
          <BlockView key={block.id} block={block} index={i} styles={styles} />
        ))}
      </View>
    </View>
  )
}

// Duas formas de bloco: par antes/depois (duas colunas legendadas) ou lado único (grid
// de fotos, sem legenda — não há comparação a rotular nem moldura vazia a preencher).
function BlockView({ block, index, styles }: { block: Block; index: number; styles: Styles }) {
  const heading = block.label.trim() || `Registro ${index + 1}`
  return (
    <View style={styles.block} wrap={false}>
      <Text style={styles.blockLabel}>{heading}</Text>
      {isBeforeAfterPair(block) ? (
        <View style={styles.sides}>
          <SideView title="Antes" images={block.before} after={false} styles={styles} />
          <View style={styles.sideGap} />
          <SideView title="Depois" images={block.after} after styles={styles} />
        </View>
      ) : (
        <PhotoGrid
          images={block.before.length > 0 ? block.before : block.after}
          styles={styles}
        />
      )}
    </View>
  )
}

// Só é montada dentro de um par, então `images` nunca está vazia — a moldura tracejada
// permanece como salvaguarda de layout.
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

function PhotoGrid({ images, styles }: { images: ImageAsset[]; styles: Styles }) {
  const rows: ImageAsset[][] = []
  for (let i = 0; i < images.length; i += GRID_COLUMNS) {
    rows.push(images.slice(i, i + GRID_COLUMNS))
  }

  return (
    <View>
      {rows.map((row, r) => (
        <View key={r} style={styles.sides}>
          {row.map((img, c) => (
            <View key={img.id} style={c > 0 ? [styles.side, styles.cellGap] : styles.side}>
              <View style={styles.frame}>
                <Image src={img.dataUrl} style={styles.photo} />
              </View>
            </View>
          ))}
          {/* Célula vazia da última linha ímpar: mantém a foto restante na largura de
              uma coluna em vez de esticá-la pela página inteira. */}
          {row.length < GRID_COLUMNS ? <View style={[styles.side, styles.cellGap]} /> : null}
        </View>
      ))}
    </View>
  )
}
