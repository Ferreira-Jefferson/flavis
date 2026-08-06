import { useRef } from 'react'
import { type Block, type Side, MAX_IMAGES_PER_SIDE } from './domain'
import styles from './quote.module.css'

interface Props {
  block: Block
  side: Side
  label: string
  disabled?: boolean
  onAdd: (files: File[]) => void
  onRemove: (imageId: string) => void
}

export function ImageSlots({ block, side, label, disabled, onAdd, onRemove }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const images = block[side]
  const remaining = MAX_IMAGES_PER_SIDE - images.length
  const isAfter = side === 'after'

  return (
    <div className={styles.side}>
      <span className={`${styles.tag} ${isAfter ? styles.tagAfter : ''}`}>{label}</span>

      <div className={styles.slots}>
        {images.map((img) => (
          <figure key={img.id} className={styles.thumb}>
            <img src={img.dataUrl} alt={img.name} />
            <button
              type="button"
              className={styles.remove}
              onClick={() => onRemove(img.id)}
              aria-label="Remover imagem"
            >
              ×
            </button>
          </figure>
        ))}

        {remaining > 0 && (
          <button
            type="button"
            className={styles.addTile}
            onClick={() => inputRef.current?.click()}
            disabled={disabled}
          >
            <span className={styles.plus}>+</span>
            <span className={styles.addHint}>
              {images.length === 0 ? `Até ${MAX_IMAGES_PER_SIDE} fotos` : `Mais ${remaining}`}
            </span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={remaining > 1}
        hidden
        onChange={(e) => {
          // corta o excedente já na seleção — nunca passa do limite por lado
          const files = Array.from(e.target.files ?? []).slice(0, remaining)
          if (files.length) onAdd(files)
          e.target.value = ''
        }}
      />
    </div>
  )
}
