import { type DocMode, type PhotoPlacement } from '../domain'
import styles from '../sections.module.css'

interface Props {
  mode: DocMode
  photoPlacement: PhotoPlacement
  onModeChange: (mode: DocMode) => void
  onPhotoPlacementChange: (placement: PhotoPlacement) => void
}

const PLACEMENT_OPTIONS: ReadonlyArray<{ value: PhotoPlacement; label: string }> = [
  { value: 'anexo', label: 'Anexado ao final (nova página)' },
  { value: 'apos-observacoes', label: 'Depois das observações' },
  { value: 'antes-da-tabela', label: 'Antes da tabela de serviços' },
]

// Escolha entre as duas versões do documento e, só quando o modo inclui o
// registro fotográfico, a posição onde essa seção entra no PDF.
export function ModeSection({ mode, photoPlacement, onModeChange, onPhotoPlacementChange }: Props) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Tipo de documento</h2>

      <div className={styles.modeToggle} role="radiogroup" aria-label="Modo do orçamento">
        <label className={styles.modeOption}>
          <input
            type="radio"
            name="mode"
            checked={mode === 'orcamento'}
            onChange={() => onModeChange('orcamento')}
          />
          Orçamento
        </label>
        <label className={styles.modeOption}>
          <input
            type="radio"
            name="mode"
            checked={mode === 'com-registro'}
            onChange={() => onModeChange('com-registro')}
          />
          Orçamento com registro fotográfico
        </label>
      </div>

      {mode === 'com-registro' && (
        <div className={styles.placementGroup} role="radiogroup" aria-label="Posição das fotos">
          {PLACEMENT_OPTIONS.map(({ value, label }) => (
            <label key={value} className={styles.modeOption}>
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
      )}
    </section>
  )
}
