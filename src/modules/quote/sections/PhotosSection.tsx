import { type Block, type Side } from '../domain'
import { BlockEditor } from '../BlockEditor'
import styles from '../sections.module.css'
import quoteStyles from '../quote.module.css'

interface Props {
  blocks: Block[]
  busy: boolean
  onAddBlock: () => void
  onRemoveBlock: (blockId: string) => void
  onLabelChange: (blockId: string, label: string) => void
  onAddImages: (blockId: string, side: Side, files: File[]) => void
  onRemoveImage: (blockId: string, side: Side, imageId: string) => void
}

// Registro fotográfico antes/depois — só é montada por `QuoteEditor.tsx`
// quando `quote.mode === 'com-registro'` (a decisão de mostrar ou não fica no
// composition root, não aqui). Reaproveita `BlockEditor`/`ImageSlots`
// movidos de `report/` quase intactos.
export function PhotosSection({
  blocks,
  busy,
  onAddBlock,
  onRemoveBlock,
  onLabelChange,
  onAddImages,
  onRemoveImage,
}: Props) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Registro fotográfico — antes &amp; depois</h2>

      <div className={styles.photos}>
        {blocks.map((block, i) => (
          <BlockEditor
            key={block.id}
            block={block}
            index={i}
            canRemove={blocks.length > 1}
            busy={busy}
            onLabelChange={(label) => onLabelChange(block.id, label)}
            onRemoveBlock={() => onRemoveBlock(block.id)}
            onAddImages={(side, files) => onAddImages(block.id, side, files)}
            onRemoveImage={(side, imageId) => onRemoveImage(block.id, side, imageId)}
          />
        ))}
      </div>

      <button type="button" className={quoteStyles.addBlock} onClick={onAddBlock}>
        + Adicionar bloco antes/depois
      </button>
    </section>
  )
}
