import styles from '../sections.module.css'
import quoteStyles from '../quote.module.css'

interface Props {
  notes: string[]
  onChange: (index: number, value: string) => void
  onAdd: () => void
  onRemove: (index: number) => void
}

// Observações do orçamento — bullets editáveis (a referência traz 5 padrão,
// ver `domain.ts`), livremente adicionáveis/removíveis.
export function NotesSection({ notes, onChange, onAdd, onRemove }: Props) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Observações</h2>

      <div className={styles.notesList}>
        {notes.map((note, index) => (
          <div key={index} className={styles.noteRow}>
            <input
              data-role="note"
              className={quoteStyles.input}
              value={note}
              onChange={(e) => onChange(index, e.target.value)}
            />
            <button
              type="button"
              className={quoteStyles.ghostBtn}
              onClick={() => onRemove(index)}
            >
              Remover
            </button>
          </div>
        ))}
      </div>

      <button type="button" className={quoteStyles.addBlock} onClick={onAdd}>
        + Adicionar observação
      </button>
    </section>
  )
}
