import { type Block, type PhotoPlacement, type Side } from '../domain'
import { BlockEditor } from '../BlockEditor'
import styles from '../sections.module.css'
import quoteStyles from '../quote.module.css'

interface Props {
  blocks: Block[]
  photoPlacement: PhotoPlacement
  busy: boolean
  onPhotoPlacementChange: (placement: PhotoPlacement) => void
  onAddBlock: () => void
  onRemoveBlock: (blockId: string) => void
  onLabelChange: (blockId: string, label: string) => void
  onAddImages: (blockId: string, side: Side, files: File[]) => void
  onRemoveImage: (blockId: string, side: Side, imageId: string) => void
}

const PLACEMENT_OPTIONS: ReadonlyArray<{ value: PhotoPlacement; label: string }> = [
  { value: 'sem-fotos', label: 'Sem fotos' },
  { value: 'antes-da-tabela', label: 'Depois de Orçamento' },
  { value: 'apos-totais', label: 'Depois de Totais' },
  { value: 'anexo', label: 'Anexado ao final' },
]

// Registro fotográfico antes/depois — sempre montada por `QuoteEditor.tsx`.
// A posição escolhida decide onde a seção entra no PDF; "Sem fotos" (padrão)
// mantém a inserção de fotos desabilitada sem esconder a seção.
export function PhotosSection({
  blocks,
  photoPlacement,
  busy,
  onPhotoPlacementChange,
  onAddBlock,
  onRemoveBlock,
  onLabelChange,
  onAddImages,
  onRemoveImage,
}: Props) {
  const disabled = photoPlacement === 'sem-fotos'

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Registro fotográfico — antes &amp; depois</h2>

      <div className={styles.placementGroup} role="radiogroup" aria-label="Posição das fotos">
        {PLACEMENT_OPTIONS.map(({ value, label }) => (
          <label key={value} className={styles.placementOption}>
            <input
              type="radio"
              name="photoPlacement"
              data-value={value}
              checked={photoPlacement === value}
              onChange={() => onPhotoPlacementChange(value)}
            />
            {label}
          </label>
        ))}
      </div>

      <div
        className={disabled ? `${styles.photos} ${styles.photosDisabled}` : styles.photos}
        aria-disabled={disabled}
      >
        {blocks.map((block, i) => (
          <BlockEditor
            key={block.id}
            block={block}
            index={i}
            canRemove={blocks.length > 1}
            busy={busy}
            disabled={disabled}
            onLabelChange={(label) => onLabelChange(block.id, label)}
            onRemoveBlock={() => onRemoveBlock(block.id)}
            onAddImages={(side, files) => onAddImages(block.id, side, files)}
            onRemoveImage={(side, imageId) => onRemoveImage(block.id, side, imageId)}
          />
        ))}
      </div>

      <button
        type="button"
        className={quoteStyles.addBlock}
        onClick={onAddBlock}
        disabled={disabled}
      >
        + Adicionar bloco antes/depois
      </button>
    </section>
  )
}
