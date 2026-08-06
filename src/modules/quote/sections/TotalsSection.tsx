import { type Quote, grandTotal, subtotal } from '../domain'
import { extenso } from '@/shared/text/extenso'
import { formatBRL, parseBRL } from '@/shared/money/currency'
import styles from '../sections.module.css'
import quoteStyles from '../quote.module.css'

interface Props {
  quote: Quote
  onDiscountChange: (cents: number) => void
}

// Desconto + prévia de subtotal/total/valor por extenso. Recebe `Quote`
// inteiro porque `subtotal`/`grandTotal` (domain.ts) exigem o tipo completo,
// não um subconjunto — um `Pick<Quote,'items'|'discountCents'>` não seria
// atribuível a `Quote`.
export function TotalsSection({ quote, onDiscountChange }: Props) {
  const total = grandTotal(quote)

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Totais</h2>

      <div className={styles.totalsGrid}>
        <div className={styles.totalsRow}>
          <span>Subtotal</span>
          <strong data-role="subtotal">{formatBRL(subtotal(quote))}</strong>
        </div>

        <div className={styles.totalsRow}>
          <label className={quoteStyles.fieldLabel} htmlFor="quote-discount">
            Desconto
          </label>
          <input
            id="quote-discount"
            className={quoteStyles.input}
            value={formatBRL(quote.discountCents)}
            onChange={(e) => onDiscountChange(parseBRL(e.target.value))}
          />
        </div>

        <div className={`${styles.totalsRow} ${styles.grandTotal}`}>
          <span>Total geral</span>
          <strong data-role="grand-total">{formatBRL(total)}</strong>
        </div>

        <p className={styles.extenso} data-role="extenso">
          Valor por extenso: {extenso(total)}
        </p>
      </div>
    </section>
  )
}
