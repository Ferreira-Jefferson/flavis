import { type Block, type Side } from './domain'
import { ImageSlots } from './ImageSlots'
import styles from './quote.module.css'

interface Props {
  block: Block
  index: number
  canRemove: boolean
  busy: boolean
  onLabelChange: (label: string) => void
  onRemoveBlock: () => void
  onAddImages: (side: Side, files: File[]) => void
  onRemoveImage: (side: Side, imageId: string) => void
}

export function BlockEditor({
  block,
  index,
  canRemove,
  busy,
  onLabelChange,
  onRemoveBlock,
  onAddImages,
  onRemoveImage,
}: Props) {
  return (
    <section className={styles.block}>
      <header className={styles.blockHead}>
        <span className={styles.blockEyebrow}>Antes e depois {index + 1}</span>
        {canRemove && (
          <button type="button" className={styles.ghostBtn} onClick={onRemoveBlock}>
            Remover
          </button>
        )}
      </header>

      <label className={styles.field}>
        <span className={styles.fieldLabel}>Cômodo ou área (opcional)</span>
        <input
          className={styles.input}
          value={block.label}
          onChange={(e) => onLabelChange(e.target.value)}
          placeholder="Ex: Cozinha"
        />
      </label>

      <div className={styles.sides}>
        <ImageSlots
          block={block}
          side="before"
          label="Antes"
          disabled={busy}
          onAdd={(files) => onAddImages('before', files)}
          onRemove={(id) => onRemoveImage('before', id)}
        />
        <ImageSlots
          block={block}
          side="after"
          label="Depois"
          disabled={busy}
          onAdd={(files) => onAddImages('after', files)}
          onRemove={(id) => onRemoveImage('after', id)}
        />
      </div>
    </section>
  )
}
