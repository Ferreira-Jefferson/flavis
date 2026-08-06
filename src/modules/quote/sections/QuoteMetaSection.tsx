import styles from '../sections.module.css'
import quoteStyles from '../quote.module.css'

// Espelha estruturalmente o tipo local (não-exportado) `MetaField` de
// `useQuote.ts` — TypeScript aceita por estrutura, não por identidade
// nominal, então não é preciso exportar/alterar `useQuote.ts` para isso.
type MetaField = 'number' | 'issueDate' | 'validUntil' | 'responsible'

interface Props {
  number: string
  issueDate: string
  validUntil: string
  responsible: string
  onFieldChange: (key: MetaField, value: string) => void
}

export function QuoteMetaSection({ number, issueDate, validUntil, responsible, onFieldChange }: Props) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Dados do orçamento</h2>

      <div className={styles.companyGrid}>
        <label className={quoteStyles.field}>
          <span className={quoteStyles.fieldLabel}>Número</span>
          <input
            className={quoteStyles.input}
            value={number}
            onChange={(e) => onFieldChange('number', e.target.value)}
          />
        </label>
        <label className={quoteStyles.field}>
          <span className={quoteStyles.fieldLabel}>Responsável</span>
          <input
            className={quoteStyles.input}
            value={responsible}
            onChange={(e) => onFieldChange('responsible', e.target.value)}
          />
        </label>
        <label className={quoteStyles.field}>
          <span className={quoteStyles.fieldLabel}>Emissão</span>
          <input
            type="date"
            className={quoteStyles.input}
            value={issueDate}
            onChange={(e) => onFieldChange('issueDate', e.target.value)}
          />
        </label>
        <label className={quoteStyles.field}>
          <span className={quoteStyles.fieldLabel}>Válido até</span>
          <input
            type="date"
            className={quoteStyles.input}
            value={validUntil}
            onChange={(e) => onFieldChange('validUntil', e.target.value)}
          />
        </label>
      </div>
    </section>
  )
}
